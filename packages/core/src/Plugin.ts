import {Graph} from "./Graph";


export class Plugin {
  constructor(public graph: Graph, public options?: any ) {

  }

  draw() {

  }

  extend(options: any) {
    return (graph: Graph) => new Plugin(graph, options)
  }
}
