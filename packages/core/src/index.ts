import {Graph, GraphOptions} from "./Graph";

export function render(el: HTMLCanvasElement, options: GraphOptions){
  return new Graph(el, options)
}
export * from "@sketch-flow/render"
export * from "./Graph";
export * from "./nodes/index";
