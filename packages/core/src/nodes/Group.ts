import {EventEmitter} from "../EventEmitter";
import {Stage} from "../Stage";
import {NodeAnchors} from "./anchors/NodeAnchors";


export abstract class Group extends EventEmitter<any> {
  public type = 'group'
  public anchor: boolean = true
  public zIndex: number = 0
  nodeAnchor!: NodeAnchors
  //x,y图形参照坐标
  x!: number
  y!: number
  w!: number //外接矩形宽
  h!: number //外接矩形高
  constructor(public stage: Stage) {
    super();
  }

  draw() {

  }


}
