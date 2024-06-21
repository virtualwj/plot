//https://github.com/LiikeJS/Liike
import * as ease from './ease';

const nullFunc = () => {
};

export type TweenSettings = {
  start: number,
  from: Record<string, number>,
  to: Record<string, number>,
  duration: number,
  delay: number,
  timingFunction: string,
  iterationCount: number | "infinite";
  onStart: Function,
  onUpdate: (x: any, y: any) => any,
  onFinish: Function,
  end: number,
}

export class Tween {
  start: number;
  end: number;
  from: Record<string, number>;
  to: Record<string, number>;
  duration: number;
  elapsed!: number;
  delay: number;
  timingFunction: string;
  // iterationCount: number | "infinite";
  onStart: Function;
  onUpdate: Function;
  onFinish: Function;
  started: boolean;
  finished: boolean;
  keys: Record<string, number>;

  constructor(public target: any, settings: Partial<TweenSettings>) {
    const {
      from = {},
      to = {},
      duration,
      delay,
      timingFunction,
      onStart = nullFunc,
      onUpdate = nullFunc,
      onFinish = nullFunc,
      iterationCount =  1
    } = settings;

    for (let key in from) {
      if (to[key] === undefined) {
        to[key] = from[key];
      }
    }
    for (let key in to) {
      if (from[key] === undefined) {
        from[key] = to[key];
      }
    }

    this.from = from;
    this.to = to;
    this.duration = duration || 500;
    this.delay = delay || 0;
    this.timingFunction = timingFunction || 'linear';
    this.onStart = onStart;
    this.onUpdate = onUpdate;
    this.onFinish = onFinish;
    this.start = Date.now() + this.delay;
    this.end = this.start + this.duration;
    this.started = false;
    this.finished = false;
    this.keys = {};
  }

  autoUpdate() {
    const time = Date.now();
    if (time < this.start) {
      return;
    }
    // finish animation
    if (this.elapsed === this.duration) {
      if (!this.finished) {
        this.finished = true;
        this.onFinish && this.onFinish(this.keys);
      }
      return;
    }
    this.elapsed = time - this.start;
    this.elapsed = this.elapsed > this.duration ? this.duration : this.elapsed;
    for (let key in this.to) {
      //@ts-ignore
      this.keys[key] = this.from[key] + (this.to[key] - this.from[key]) * ease[this.timingFunction](this.elapsed / this.duration);
    }
    if (!this.started) {
      this.onStart && this.onStart(this.keys);
      this.started = true;
    }
    this.onUpdate(this.keys);
    window.requestAnimationFrame(this.autoUpdate);
  }

  tick(t: number) {
    if (t == 1 && this.finished) {
      return
    }
    const {keys, from, to, timingFunction} = this;
    //@ts-ignore
    const e = ease[this.timingFunction](t);
    for (let key in this.to) {
      //@ts-ignore
      this.keys[key] = from[key] + (to[key] - from[key]) * e;
    }
    this.onUpdate(this.target, this.keys);

    if (t == 1) {
      this.finished = true;
      this.onFinish(this.target, this.keys);
    }
  }
}
