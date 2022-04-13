declare module 'p5.js-svg' {
  declare function p5JsSVG(p5: any): void
  export default p5JsSVG
}

declare module '*.svg' {
  declare const svg = string
  export default svg
}
