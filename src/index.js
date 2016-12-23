import './index.css'
import Sandpit from './Sandpit'
import Vector from './utils/vector'
import Color from 'color'

let sandpit = new Sandpit(document.querySelector('#root'), Sandpit.CANVAS)
sandpit.settings({
  gravity: {value: 2, step: 0.1, min: 0.1, max: 5},
  count: {value: 50, step: 1, min: 1, max: 500},
  size: {value: 5, step: 1, min: 1, max: 20},
  color: {value: '#000', color: true},
  background: {value: {white: 'hsl(0, 100%, 100%)', aqua: 'hsl(175, 100%, 45%)', blue: 'hsl(185, 69%, 63%)', orange: 'hsl(39, 100%, 54%)', pink: 'hsl(333, 100%, 68%)', green: 'hsl(84, 100%, 68%)', violet: 'hsl(270, 100%, 80%)'}}
}, true)

let ctx = sandpit.context()
let random = sandpit.random('Hello!')

function Particle () {
  const shadowBlur = Math.ceil(random() * 3)
  const strokeWidth = 1
  const strokeStyle = Color(sandpit.settings.color).alpha(random() * 0.5)

  const initX = random() * sandpit.width()
  const initY = random() * sandpit.height()
  const position = new Vector(initX, initY)
  const velocity = new Vector(0, 0)
  const acceleration = new Vector(0, 0)
  const previousPositions = []

  this.update = () => {
    let force = new Vector(Math.cos(random() * Math.PI * 2), Math.sin(random() * Math.PI * 2))
    acceleration.add(new Vector(1 + random(), 1 + random()).multiply(force))

    const dx = position.x - sandpit.width() / 2
    const dy = position.y - sandpit.height() / 2
    const fSpring = new Vector(dx, dy).multiplyScalar(-1 / (Math.min(sandpit.width(), sandpit.height()) * (sandpit.defaults.gravity.max - (sandpit.settings.gravity - 0.1))))
    acceleration.add(fSpring)

    velocity.add(acceleration)
    velocity.limit(10, 0.9)
    position.add(velocity)
    acceleration.multiply(new Vector(0, 0))

    ctx.beginPath()
    ctx.lineWidth = strokeWidth
    ctx.strokeStyle = strokeStyle
    ctx.shadowBlur = shadowBlur
    ctx.shadowColor = sandpit.settings.color
    if (previousPositions.length > 1) {
      const [first, ...rest] = previousPositions
      ctx.moveTo(first.x, first.y)
      rest.forEach(p => ctx.lineTo(p.x, p.y))
      ctx.lineTo(position.x, position.y)
      if (previousPositions.length === sandpit.settings.size) previousPositions.shift()
    }

    previousPositions.push(position.clone())
    ctx.stroke()
  }
}

let particles = []

sandpit.change = () => {
  particles = Array(Math.round(sandpit.settings.count)).fill().map(() => new Particle())
}

sandpit.change()

sandpit.loop = () => {
  sandpit.fill(sandpit.settings.background)
  particles.forEach(particle => particle.update())
}

sandpit.start()
