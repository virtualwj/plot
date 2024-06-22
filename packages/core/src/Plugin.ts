import {Stage, StageEvent, StageMode} from "./Stage";
import {CallbackFunction, StringKeyOf} from "./EventEmitter";

export class Plugin {
  public name = 'Plugin';
  public active = true;
  public activeMode: Array<StageMode> = ["drag"];
  static priority: number = 0

  constructor(public stage: Stage, public options?: any) {

  }

  draw() {

  }

  // on<EventName extends StringKeyOf<StageEvent>>(event: EventName, fn: CallbackFunction<StageEvent, EventName>) {
  //   this.stage.on(event, fn)
  // }

  modeChanged(mode: StageMode) {
    this.active = this.activeMode.includes(mode);
  }

  extend(options: any) {
    return (stage: Stage) => new Plugin(stage, options)
  }
}
