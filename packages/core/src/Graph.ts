import {SVGDrawer, CanvasDrawer} from "@sketch-flow/render";
import {Node} from "./nodes/Node";
import {Edge} from "./edges/Edge";
import {EventEmitter} from "./EventEmitter";
import {Anchor} from "./nodes/anchors/Anchor";
import {EventManager} from "./EventManager";
import {Painter} from "./painter/Painter";

// 声明 Graph 类
export interface GraphOptions {
  engine: "svg" | "canvas",
  toolbar: HTMLDivElement
}

interface GraphEvent {
  mousedown: { e: MouseEvent, x: number, y: number },
  mouseup: { e: MouseEvent, x: number, y: number },
  mousemove: { e: MouseEvent, x: number, y: number },
  mouseleave: { e: MouseEvent, x: number, y: number },
  contextmenu: { e: MouseEvent, x: number, y: number },
}

/**
 * Graph 类
 */
export class Graph extends EventEmitter<GraphEvent> {
  nodes: Array<Node>
  edges: Array<Edge>
  engine: CanvasDrawer | SVGDrawer
  toolbar: HTMLDivElement
  painter: Painter

  isAddingEdge = false
  isAddingStartAnchor?: Anchor
  eventManager: EventManager

  //被选中的Node
  selectedNode!: null | Node

  constructor(public element: HTMLCanvasElement | SVGSVGElement, public options: GraphOptions) {
    super()
    this.nodes = [];
    this.edges = [];
    this.options = Object.assign({
      engine: "canvas"
    }, options)
    this.toolbar = options.toolbar;
    this.painter = new Painter();

    if (this.options.engine === 'svg') {
      this.engine = new SVGDrawer(element as SVGSVGElement);
    } else {
      this.engine = new CanvasDrawer(element as HTMLCanvasElement);
    }
    this.bindEvent()
    this.eventManager = new EventManager(this);
  }

  /**
   * 添加一个节点
   */
  addNode(node: Node) {
    this.nodes.push(node);
    this.draw();
  }

  addEdge(edge: Edge) {
    this.edges.push(edge);
    this.draw();
  }

  deleteNode() {
    if (this.selectedNode) {
      this.selectedNode.delete()
      this.draw()
      this.hideToolbar()
    }
  }

  showToolbar(e: any) {
    const mousePos = this.getMousePos(e);
    this.toolbar.style.display = 'block';
    this.toolbar.style.left = `${mousePos.x + 10}px`;
    this.toolbar.style.top = `${mousePos.y + 10}px`;
  }

  hideToolbar() {
    this.toolbar.style.display = 'none';
  }


  draw() {
    if (this.engine instanceof CanvasDrawer) {
      this.engine.ctx.clearRect(0, 0, this.engine.canvas.width, this.engine.canvas.height);
      this.engine.drawGrid()
    } else {
      this.element.innerHTML = ""
    }

    this.nodes.forEach(node => node.draw())
    this.edges.forEach(edge => edge.draw())
  }


  getMousePos(e: MouseEvent) {
    const rect = this.element.getBoundingClientRect();
    let width, height;
    const dpr = window.devicePixelRatio || 1;
    if (this.options.engine === 'svg') {
      this.element = this.element as SVGSVGElement
      width = this.element.width.baseVal.value;
      height = this.element.width.baseVal.value;
    } else {
      width = this.element.width;
      height = this.element.height;
    }
    return {
      x: (e.clientX - rect.left) / (rect.right - rect.left) * (width as number / dpr),
      y: (e.clientY - rect.top) / (rect.bottom - rect.top) * (height as number / dpr),
    };
  }

  bindEvent() {
    ["mousedown", "mousemove", "mouseup", "mouseleave"].forEach(name => {
      this.element.addEventListener(name, (event) => {
        const e = event as MouseEvent;
        const {x, y} = this.getMousePos(e)
        //TODO
        // @ts-ignore
        this.emit(name, {
          e, x, y
        })
      });
    })
  }
}
