const SECOND = 1000;

const display = {
  minutes: document.querySelector('#display >#minutes'),
  seconds: document.querySelector('#display >#seconds'),
  millis: document.querySelector('#display >#millis'),
  eventList: document.querySelector('#event-list'),
};

const pad = (input) => {
  return input.toString().length < 2 ? `0${input}` : input;
};

console.log(timer);

function onUpdate(time) {
  ['minutes', 'seconds', 'millis'].forEach((key) => {
    const el = display[key];
    const value = pad(time[key]);
    el.innerHTML = value;
  });
}

function start() {
  timer.start(onUpdate);

  timer.subscribe(SECOND * 3, () => {
    timer.subscribe(SECOND * 3, () => {
      console.log('DONE 2!');
    });
    timer.pause();
    console.log('DONE!');
  });

  timer.subscribe(SECOND * 30, () => {
    console.log('DONE 30');
    timer.stop();
  });

  setTimeout(() => {
    // console.log('RIVAL 3');
  }, SECOND * 3);
  setTimeout(() => {
    // console.log('RIVAL 6');
    timer.resume();
  }, SECOND * 6);
  setTimeout(() => {
    // console.log('RIVAL 30');
  }, SECOND * 30);
}

start();
