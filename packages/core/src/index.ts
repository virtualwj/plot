import {Graph, GraphOptions} from "./Graph";

export function render(el: HTMLCanvasElement, options: GraphOptions){
  return new Graph(el, options)
}
export * from "@plot/render"
export * from "./Graph";
export * from "./nodes/index";
