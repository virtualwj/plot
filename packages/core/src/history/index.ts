import {Stage, StageMode} from "../Stage";
import {Plugin} from "../Plugin";

export class Drag extends Plugin {
  public name = "EventManager"
  public activeMode: Array<StageMode> = ["drag"]
  static priority = 10

  constructor(public stage: Stage) {
    super(stage);
  }
}
