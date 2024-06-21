import {Stage, GraphOptions} from "./Stage";

export function render(el: HTMLCanvasElement, options: GraphOptions){
  return new Stage(el, options)
}
export * from "@plot/render"
export * from "./Stage";
export * from "./nodes/index";
export * from "./Plugin";
export * from "./plugins/index";
