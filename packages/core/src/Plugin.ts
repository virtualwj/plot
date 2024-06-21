import {Stage, GraphEvent, GraphMode} from "./Stage";
import {CallbackFunction, StringKeyOf} from "./EventEmitter";

export class Plugin {
  public name = 'Plugin';
  public active = true;
  public activeMode: Array<GraphMode> = ["drag"];
  static priority: number = 0

  constructor(public stage: Stage, public options?: any) {

  }

  draw() {

  }

  // on<EventName extends StringKeyOf<GraphEvent>>(event: EventName, fn: CallbackFunction<GraphEvent, EventName>) {
  //   this.stage.on(event, fn)
  // }

  modeChanged(mode: GraphMode) {
    this.active = this.activeMode.includes(mode);
  }

  extend(options: any) {
    return (stage: Stage) => new Plugin(stage, options)
  }
}
