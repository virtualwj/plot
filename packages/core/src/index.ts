import {Graph} from "./Graph";
import {GraphOptions} from "../index";

export function render(el: HTMLCanvasElement, options: GraphOptions){
  return new Graph(el, options)
}
export * from './svg/index'
export * from './Graph'
