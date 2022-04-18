import P5 from 'p5'
import p5Svg from 'p5.js-svg'
import logo from './logo.svg'

p5Svg(P5)

type HSL = [number, number, number]
type Color = 'blue' | 'dark-blue' | 'pink' | 'black' | 'gray' | 'gray-3'
const allColors = new Map<Color, HSL>([
  ['blue', [244, 93, 60]],
  ['dark-blue', [244, 93, 20]],
  ['pink', [340, 100, 70]],
  ['gray', [0, 0, 65]],
  ['gray-3', [0, 0, 30]],
  ['black', [18, 11, 18]],
])
const allColorsGrandient = new Map<Color, Array<HSL>>([
  [
    'blue',
    [
      [244, 93, 60],
      [200.6, 25.1, 100],
    ],
  ],
  [
    'dark-blue',
    [
      [244, 93, 20],
      [179.3, 40.4, 79.6],
    ],
  ],
  [
    'pink',
    [
      [340, 100, 70],
      [49.6, 85.9, 97.6],
    ],
  ],
  [
    'gray',
    [
      [0, 0, 65],
      [191.3, 54, 92.9],
    ],
  ],
  [
    'black',
    [
      [18, 11, 18],
      [285.4, 57.4, 53.3],
    ],
  ],
])

const triangleColorsGrandient = new Map(allColorsGrandient)
triangleColorsGrandient.delete('black')
triangleColorsGrandient.delete('gray-3')

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
        p5.stroke(getColor('gray-3'))
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

  function getColor(color: Color): HSL {
    return allColors.get(color)!
  }

  function getRandomColorGrandient(): Array<HSL> {
    return p5.random(Array.from(triangleColorsGrandient.values()))
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
    const colorGrandient = getRandomColorGrandient()
    linearGradient(x, y, x2, y2, colorGrandient)
    p5.triangle(x, y, x2, y2, x3, y3)
    p5.pop()
  }

  function linearGradient(sX: number, sY: number, eX: number, eY: number, colors: Array<HSL>) {
    let gradient = p5.drawingContext.createLinearGradient(sX, sY, eX, eY)
    colors.forEach((color, index) => {
      gradient.addColorStop(index, p5.color(color))
    })

    p5.drawingContext.fillStyle = gradient
    p5.drawingContext.strokeStyle = gradient
  }
}

new P5(render, document.body)
