const SECOND = 1000;

const display = {
  minutes: document.querySelector('#display >#minutes'),
  seconds: document.querySelector('#display >#seconds'),
  millis: document.querySelector('#display >#millis'),
  eventList: document.querySelector('#event-list')
};

const subscriptions = [];

const subscribe = (delay, cb) => {
  subscriptions.push({
    start: Date.now(),
    delay,
    cb
  });

  if (subscriptions.length > 1) {
    subscriptions.sort((a, b) => {
      return a.delay > b.delay;
    })
  }
}

let time = 0;
const pad = (input) => {
  return input.toString().length < 2 ? `0${input}` : input;
}

const animate = (start, d) => {
  //update time
  const now = Date.now();
  const delta = (now - start);
  time += delta;

  //display
  const minutes = Math.floor(time / 60000);
  display.minutes.innerHTML = minutes;
  const seconds = ((time % 60000) / 1000).toFixed(0);
  display.seconds.innerHTML = seconds;
  const millis = ((time % 1000) / 10).toFixed(0);
  display.millis.innerHTML = pad(millis);

   for (let i = subscriptions.length - 1; i >= 0; i--) {
    const {start, delay, cb} = subscriptions[i];
    const expired = now - start >= delay;
    if (expired) {
      const newLi = document.createElement('li');
      newLi.innerHTML = `Complete at ${time / SECOND}s, after ${delay / SECOND}s.`
      display.eventList.appendChild(newLi);
      if (cb) {
        console.log(delay);
        cb();
      }
      subscriptions.splice(i, 1);
    }
  }

  //repeat
  requestAnimationFrame((d) => animate(now, d));
};

subscribe(SECOND * 3, () => { 
  subscribe(SECOND * 3, () => {console.log('DONE 2!') })
  console.log('DONE!') 
});

subscribe(SECOND * 30, () => { console.log('DONE 30') }); 

function start() {
  const now = Date.now();
  console.log('start:', now);
  requestAnimationFrame((delta) => animate(now, delta));
}

start();
