import {Graph, GraphEvent, GraphMode} from "./Graph";
import {CallbackFunction, StringKeyOf} from "./EventEmitter";

export class Plugin {
  public name = 'Plugin';
  public active = true;
  public activeMode: Array<GraphMode> = ["drag"];
  static priority: number = 0

  constructor(public graph: Graph, public options?: any) {

  }

  draw() {

  }

  // on<EventName extends StringKeyOf<GraphEvent>>(event: EventName, fn: CallbackFunction<GraphEvent, EventName>) {
  //   this.graph.on(event, fn)
  // }

  modeChanged(mode: GraphMode) {
    this.active = this.activeMode.includes(mode);
  }

  extend(options: any) {
    return (graph: Graph) => new Plugin(graph, options)
  }
}
