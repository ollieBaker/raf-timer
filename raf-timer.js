let totalProgress = 0;
const subscriptions = [];
let log = 0;

const timer = {
  id: null,
  stopped: null,
  paused: null,
  time: {
    minutes: 0,
    seconds: 0,
    millis: 0,
    total: 0,
  },
  start(updateCb) {
    this.id = window.requestAnimationFrame((delta) =>
      this.animate(delta, delta)
    );
    this.updateCb = updateCb;
    return this;
  },
  pause() {
    this.paused = true;
  },
  resume() {
    this.paused = false;
    this.id = window.requestAnimationFrame((delta) =>
      this.animate(delta, delta)
    );
  },
  stop() {
    this.stopped = this.id;
  },
  subscribe(delay, callback) {
    subscriptions.push({
      start: totalProgress,
      delay,
      callback,
    });

    if (subscriptions.length > 1) {
      subscriptions.sort((a, b) => {
        return a.delay > b.delay;
      });
    }
  },
  animate(start, delta) {
    const progress = delta - start;

    //update time
    if (!this.paused) {
      totalProgress += progress;
    }

    if (++log < 5) {
      console.log(
        'start',
        start,
        'delta',
        delta,
        // 'now', now,
        'progress',
        progress,
        'totalProgress',
        totalProgress
      );
    }

    const minutes = Math.floor(totalProgress / 60000);
    this.time.minutes = minutes;
    const seconds = Math.floor((totalProgress % 60000) / 1000).toFixed(0);
    this.time.seconds = seconds;
    const millis = Math.floor((totalProgress % 1000) / 10).toFixed(0);
    this.time.millis = millis;

    this.time.total = totalProgress;

    this.updateCb(this.time);

    for (let i = subscriptions.length - 1; i >= 0; i--) {
      const { start, delay, callback } = subscriptions[i];
      const expired = totalProgress - start >= delay;
      if (expired) {
        if (callback) {
          callback();
        }
        subscriptions.splice(i, 1);
      }
    }

    if (this.stopped) {
      window.cancelAnimationFrame(this.stopped);
      this.stopped = null;
      this.id = null;
      return;
    }
    // if (!this.paused) {
    //repeat
    this.id = window.requestAnimationFrame((nd) => this.animate(delta, nd));
    // }
  },
};
