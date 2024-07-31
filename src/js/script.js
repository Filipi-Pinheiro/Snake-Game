const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")
const audio = document.querySelector("audio")

const controls = document.querySelector(".btn-container")
const up = document.querySelector(".up")
const down = document.querySelector(".down")
const left = document.querySelector(".left")
const right = document.querySelector(".right")

const score = document.querySelector(".score-value")
const finalScore = document.querySelector(".final-score > span")
const menu = document.querySelector(".menu-screen")
const buttonPlay = document.querySelector(".btn-play")

const size = 30

const initialPosition = {x: 300, y: 300}

let snake = [initialPosition]

const incrementScore = () => {
  score.innerText = +score.innerText + 10
}

const screenSize = () => {
  const screenWidth = window.innerWidth

  if (screenWidth < 768) {
    controls.style.display = "flex"
    canvas.style.width = "400px"
  }
}

screenSize()

const randomNumber = (min, max) => {
  return Math.round(Math.random() * (max - min) + min)
}

const randomPosition = () => {
  const number = randomNumber(0, canvas.width - size)
  return Math.round(number / 30) * 30
}

const randomColor = () => {
  const red = randomNumber(0, 255)
  const green = randomNumber(0, 255)
  const blue = randomNumber(0, 255)

  return `rgb(${red},${green},${blue})`
}

const food = {
  x: randomPosition(),
  y: randomPosition(),
  color: randomColor()
}

let direction, loopId

const drawFood = () => {
  const { x, y, color } = food

  ctx.shadowColor = color
  ctx.shadowBlur = 10
  ctx.fillStyle = color
  ctx.fillRect(x, y, size, size)
  ctx.shadowBlur = 0
}

const drawSnake = () => {
  ctx.fillStyle = "#ddd"

  snake.forEach((position, index) =>{

    if(index == snake.length -1) {
      ctx.fillStyle = "#fff"
    }
    
    ctx.fillRect(position.x, position.y, size, size)
  })
}

const moveSnake = () => {
  if(!direction) return
  
  const head = snake[snake.length -1]

  snake.shift()

  if(direction == "right") {
    snake.push({x: head.x + size, y: head.y })
  }

  if(direction == "left") {
    snake.push({x: head.x - size, y: head.y })
  }

  if(direction == "down") {
    snake.push({x: head.x , y: head.y + size})
  }

  if(direction == "up") {
    snake.push({x: head.x, y: head.y - size})
  }
}

const drawGrid = () => {
  ctx.lineWidth = 1
  ctx.strokeStyle = "#191919"

  for (let i = 30; i < canvas.width; i += 30) {
    ctx.beginPath()
    ctx.lineTo(i, 0)
    ctx.lineTo(i, 600)
    ctx.stroke()

    ctx.beginPath()
    ctx.lineTo(0, i)
    ctx.lineTo(600, i)
    ctx.stroke()
  }
}

const heEat = () => {
  let x = randomPosition()
  let y = randomPosition()
  
  while (snake.find((position) => position.x == x && position.y == y)) {
    x = randomPosition()
    y = randomPosition()
  }

  food.x = x
  food.y = y
  food.color = randomColor()
}

const chackEat = () => {
  const head = snake[snake.length -1]

  if (head.x == food.x && head.y == food.y) {
    incrementScore()
    snake.push(head)
    audio.play()
    heEat()
  }
}

const chackCollision = () => {
  const head = snake[snake.length -1]
  const canvasLimit = canvas.width - size
  const neckIndex = snake.length -2

  const wallCollision = 
    head.x < 0 || head.x > canvasLimit || head.y < 0 || head.y > canvasLimit

  const selfCollision = snake.find((position, index) => {
    return index < neckIndex && position.x == head.x && position.y == head.y
  })

  if (wallCollision || selfCollision) {
    gameOver()
  }
}

const gameOver = () => {
  direction = undefined

  menu.style.display = "flex"
  finalScore.innerText = score.innerText
  canvas.style.filter = "blur(2px)"
  controls.style.display = "none"
}

const gameLoop = () => {
  clearInterval(loopId)
  ctx.clearRect(0, 0, 600, 600)

  drawGrid()
  drawFood()
  drawSnake()
  moveSnake()
  chackEat()
  chackCollision()

  loopId = setTimeout(() => {
    gameLoop()
  }, 300)
}

gameLoop()

document.addEventListener('keydown', ({ key }) => {
  if(key == "arrowRight" && direction != "left") {
    direction = "right"
  }

  if(key == "arrowRight" && direction != "right") {
    direction = "right"
  }

  if(key == "arrowDown" && direction != "up") {
    direction = "down"
  }

  if(key == "arrowUp" && direction != "down") {
    direction = "up"
  }
})

up.addEventListener('mousedown', () => {
  if (direction != "down") {
    direction = "up"
  }
})

down.addEventListener('mousedown', () => {
  if (direction != "up") {
    direction = "down"
  }
})

left.addEventListener('mousedown', () => {
  if (direction != "right") {
    direction = "left"
  }
})

right.addEventListener('mousedown', () => {
  if (direction != "left") {
    direction = "right"
  }
})

buttonPlay.addEventListener('click', () => {
  score.innerText = "00"
  menu.style.display = "none"
  canvas.style.filter = "none"
  controls.style.display = "flex"
  heEat()

  snake = [initialPosition]
})