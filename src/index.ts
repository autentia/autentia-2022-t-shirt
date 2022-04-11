import P5 from 'p5'
import p5Svg from 'p5.js-svg'
import logo from './logo.svg'

p5Svg(P5)

function draw(p5: P5) {
  let svg: any

  p5.preload = () => {
    svg = p5.loadSVG(logo)
    console.log({svg})
  }

  p5.setup = () => {
    const CANVAS_HEIGHT = p5.windowHeight
    const CANVAS_WIDTH = p5.windowWidth
    // @ts-ignore
    p5.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT, p5.SVG)
    p5.image(svg, 0, 0, 200, 200)

  }
}

new P5(draw, document.body)
