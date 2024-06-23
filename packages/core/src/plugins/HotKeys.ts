import {Stage} from "../Stage";
import {Plugin} from "../Plugin";
import hotkeys from "../hot-keys";

//画布拖动
export class HotKeys extends Plugin {

  constructor(public stage: Stage, public options?: any) {
    super(stage);

    hotkeys('command+c', function () {
      console.log(stage.selectedNode)

    });
  }


  draw() {

  }

}
