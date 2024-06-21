import {Tween, TweenSettings} from './Tween';
import {Stage} from "@plot/core";

//调度动画执行
export default class Animate {
  public tweens: Array<Tween> = [];
  public jobs: Array<Function> = [];
  public ticking: any = 0;
  constructor(public stage:Stage) {
  }

  addTween(target: any, settings: Partial<TweenSettings>) {

    this.jobs.push((now: number) => {
      const tween = new Tween(target, settings);
      this.tweens.push(tween);
    });
    if (!this.ticking) {
      this.ticking = window.requestAnimationFrame(this.tick.bind(this));
    }
  }

  tick() {
    let now = Date.now()
    while (this.jobs.length) {
      const job = this.jobs.shift() as Function;
      job(now);
    }

    for (let i = 0; i < this.tweens.length; i++) {
      const tween = this.tweens[i];
      if (now < tween.start) {
        continue;
      }


      if (!tween.started && !tween.finished) {
        tween.started = true;
        tween.onStart(tween.target);
      }

      const t = (now - tween.start) / (tween.end - tween.start);

      tween.tick((t < 1) ? t : 1);

      if (tween.finished) {
        this.tweens.splice(i--, 1);
      }
    }

    if (this.jobs.length || this.tweens.length) {
      this.ticking = window.requestAnimationFrame(this.tick.bind(this));
    } else {
      this.ticking = undefined;
      this.stage.emit("animationEnd", {stage: this.stage})
    }
  };
};
