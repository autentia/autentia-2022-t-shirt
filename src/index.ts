import P5 from 'p5'
import p5Svg from 'p5.js-svg'
import logo from './logo.svg'

p5Svg(P5)

type HSL = [number, number, number]
type Color = 'blue' | 'dark-blue' | 'pink' | 'black' | 'gray'
const allColors = new Map<Color, HSL>([
  ['blue', [244, 93, 60]],
  ['dark-blue', [244, 93, 20]],
  ['pink', [340, 100, 70]],
  ['gray', [0, 0, 65]],
  ['black', [18, 11, 18]],
])

const triangleColors = new Map(allColors)
triangleColors.delete('black')

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
    p5.colorMode(p5.HSB)
    p5.noLoop()
    p5.noStroke()
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
        p5.rect(j * columnWidth, i * columnHeight, columnWidth, columnHeight)
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

  function getRandomColor(): HSL {
    return p5.random(Array.from(triangleColors.values()))
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
    p5.fill(getRandomColor())
    p5.triangle(x, y, x2, y2, x3, y3)
    p5.pop()
  }
}

new P5(render, document.body)
