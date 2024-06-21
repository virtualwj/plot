import {Stage, GraphMode} from "../Stage";
import {Plugin} from "../Plugin";

export class Drag extends Plugin {
  public name = "EventManager"
  public activeMode: Array<GraphMode> = ["drag"]
  static priority = 10

  constructor(public stage: Stage) {
    super(stage);
  }
}
