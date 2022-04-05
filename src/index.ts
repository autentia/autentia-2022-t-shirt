import P5 from 'p5'

function draw(p5: P5) {
  p5.setup = () => {
    const CANVAS_HEIGHT = p5.windowHeight
    const CANVAS_WIDTH = p5.windowWidth
    p5.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT)
    p5.colorMode(p5.HSB, 100)

    p5.background(10)

    p5.textSize(46)
    p5.fill(100)
    p5.text('Autentia', CANVAS_HEIGHT / 2 - 80, CANVAS_WIDTH / 2 - 16).textAlign('center')
  }
}

new P5(draw)
