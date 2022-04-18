import P5 from 'p5'
import p5Svg from 'p5.js-svg'
import logo from './logo.svg'

p5Svg(P5)

type HSLA = [number, number, number, number]
type Color = 'blue' | 'dark-blue' | 'pink' | 'pink-gradient' | 'black' | 'gray-to-transparent' | 'gray' | 'blue-to-pink'
const allColors = new Map<Color, HSLA>([
  ['gray', [0, 0, 30, 100]],
  ['black', [18, 11, 18, 100]],
])
const triangleColorsGradients = new Map<Color, HSLA[]>([
  ['blue', [[244, 93, 32, 100]]],
  ['pink', [[340, 100, 50, 100]]],
  [
    'pink-gradient',
    [
      [340, 100, 50, 100],
      [331, 100, 36, 100],
    ],
  ],
  [
    'gray-to-transparent',
    [
      [0, 0, 65, 100],
      [0, 0, 65, 0],
    ],
  ],
  [
    'blue-to-pink',
    [
      [244, 100, 48, 100],
      [340, 100, 50, 100],
    ],
  ],
])

function render(p5: P5) {
  let svg: P5.Image
  let CANVAS_HEIGHT: number
  let CANVAS_WIDTH: number

  p5.preload = () => {
    // @ts-ignore
    svg = p5.loadSVG(logo)
    CANVAS_HEIGHT = p5.windowHeight
    CANVAS_WIDTH = p5.windowWidth
  }

  p5.setup = () => {
    // @ts-ignore
    p5.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT, p5.SVG)
    p5.colorMode(p5.HSL, 360, 100, 100, 100)
    p5.noLoop()
    p5.noStroke()
    p5.angleMode(p5.DEGREES)
  }

  p5.draw = () => {
    const columns = 15
    const rows = 15
    const coordinates = generateCoordinates(rows, columns)
    generateTriangles(coordinates, rows)
    generateLogo()
  }

  function generateCoordinates(rows: number, columns: number): number[][] {
    p5.push()
    p5.fill(getColor('black'))
    const coordinates = []
    const columnWidth = CANVAS_WIDTH / columns
    const columnHeight = CANVAS_HEIGHT / rows
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        p5.strokeWeight(1)
        p5.rect(j * columnWidth, i * columnHeight, columnWidth, columnHeight)
        p5.stroke(getColor('gray'))
        const x = p5.random(j * columnWidth + columnWidth, j * columnWidth)
        const y = p5.random(i * columnHeight + columnHeight, i * columnHeight)

        coordinates.push([x, y])
      }
    }
    p5.pop()
    return coordinates
  }

  function generateTriangles(coordinates: number[][], rows: number) {
    let currentRow = 1
    let i = 0
    while (i < coordinates.length) {
      if (!(currentRow === 1 || currentRow === rows || (i + 1) % rows === 0)) {
        const currentPoint = i
        const nextPoint = i + 1
        const bottomPoint = i + rows

        generateTriangle(coordinates, currentPoint, nextPoint, bottomPoint)

        const nextPoint2 = i - rows
        const bottomPoint2 = i + 1
        generateTriangle(coordinates, currentPoint, nextPoint2, bottomPoint2)
      }
      i++
      if (i % rows === 0) {
        currentRow++
      }
    }
  }

  function getColor(color: Color): HSLA {
    return allColors.get(color)!
  }

  function getRandomColorGradients(): HSLA[] {
    return p5.random(Array.from(triangleColorsGradients.values()))
  }

  function generateLogo() {
    const size = 400
    p5.image(svg, CANVAS_WIDTH / 2 - size / 2, CANVAS_HEIGHT / 2 - size / 2, size, size)
  }

  function generateTriangle(coordinates: number[][], currentPoint: number, nextPoint: number, bottomPoint: number) {
    p5.push()
    const [x, y] = coordinates[currentPoint]
    const [x2, y2] = coordinates[nextPoint]
    const [x3, y3] = coordinates[bottomPoint]
    const gradient = getRandomColorGradients()
    linearGradient(x, y, x2, y2, gradient)
    p5.triangle(x, y, x2, y2, x3, y3)
    p5.pop()
  }

  function linearGradient(sX: number, sY: number, eX: number, eY: number, colors: HSLA[]) {
    const gradient = p5.drawingContext.createLinearGradient(sX, sY, eX, eY)
    colors.forEach((color, index) => {
      gradient.addColorStop(index, p5.color(color))
    })

    p5.drawingContext.fillStyle = gradient
    p5.drawingContext.strokeStyle = gradient
  }
}

new P5(render, document.body)
