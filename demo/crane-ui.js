// DEMO: the crane. The controls (play / step / restart / speed) and the talk with the app.
//
// The app puts this page in an iframe above the test results and talks to it with postMessage:
//   app → demo:  { type: "crane-run", code }   play this solution (sent after every RUN)
//   demo → app:  { type: "crane-ready" }       the page is loaded, the app may send the code
// Opened alone, the page plays the reference solution.
// The player's code is run by a worker (crane-rec.js) on a recording crane: it posts the events, the timeline
// (crane-timeline.js) turns them into frames, and the scene (crane-scene.js, crane-draw.js) draws one frame.

const ROW = [5, 3, 8, 1, 9, 2, 7, 4];
const REF = `const f = (crane) => {
  const n = crane.getLength();
  for (let i = 0; i < n - 1; i++) {
    let m = i, min = crane.scan(i);
    for (let j = i + 1; j < n; j++) { const v = crane.scan(j); if (v < min) { min = v; m = j; } }
    if (m !== i) { crane.grab(i); crane.grab(m); crane.put(i); crane.put(m); }
  }
};
module.exports = f;`;

const $ = (id) => document.getElementById(id);
const scene = new Scene($("stage"));
const TARGET = sortedTarget(ROW);

let frames = [initialFrame(ROW)],
  recErr = null,
  index = 0,
  playing = false,
  timer = 0;

const speed = () => 840 - Number($("speed").value); // ms of one frame, as in main-frame

function say(text, bad) {
  $("msg").textContent = text || "";
  $("msg").classList.toggle("err", !!bad);
}

function show() {
  const f = frames[index];
  scene.draw(f, TARGET, speed());
  $("n-scan").textContent = f.apiReads;
  $("n-grab").textContent = f.apiGrabs;
  $("n-put").textContent = f.apiPuts;
  $("n-frame").textContent = frames.length > 1 ? `frame ${index + 1} / ${frames.length}` : "";
  $("b-play").textContent = playing ? "⏸" : "▶";
  if (index >= frames.length - 1 && frames.length > 1) say(recErr ? "ACCIDENT: " + recErr : "done", !!recErr);
}

function tick() {
  clearTimeout(timer);
  if (!playing) return;
  if (index >= frames.length - 1) {
    playing = false;
    show();
    return;
  }
  // the scan is a short blink while the crane glides on: it must not feel like a stop at every cell
  const scanNext = frames[index].op.type === "scan" && frames[index + 1] && frames[index + 1].op.type === "move";
  const wait = Math.max(40, scanNext ? speed() * 0.22 : speed());
  timer = setTimeout(() => {
    index++;
    show();
    tick();
  }, wait);
}

function play() {
  if (frames.length <= 1) return;
  if (index >= frames.length - 1) index = 0;
  say("");
  playing = true;
  show();
  tick();
}
const pause = () => {
  playing = false;
  clearTimeout(timer);
  show();
};
const seek = (i) => {
  pause();
  index = Math.max(0, Math.min(frames.length - 1, i));
  say("");
  show();
};

// the recorder: the code of the player → the events
function record(code) {
  return new Promise((res) => {
    const w = new Worker("crane-rec.js");
    const done = (r) => {
      clearTimeout(dead);
      w.terminate();
      res(r);
    };
    const dead = setTimeout(() => done({ events: [], error: "TIMEOUT (2s)" }), 2000);
    w.onmessage = (e) => done(e.data);
    w.onerror = (e) => done({ events: [], error: "Worker: " + e.message });
    w.postMessage({ code, row: ROW });
  });
}

async function load(code) {
  pause();
  say("recording…");
  const r = await record(code);
  recErr = r.error;
  frames = [initialFrame(ROW), ...compileTimeline(ROW, r.events)];
  index = 0;
  scene.build(ROW.length);
  say("");
  play();
}

$("b-play").onclick = () => (playing ? pause() : play());
$("b-step").onclick = () => seek(index + 1);
$("b-back").onclick = () => seek(index - 1);
$("b-restart").onclick = () => seek(0);
$("speed").oninput = show;
window.addEventListener("resize", () => {
  scene.fit();
  show();
});
window.addEventListener("message", (e) => {
  if (e.data && e.data.type === "crane-run" && typeof e.data.code === "string") load(e.data.code);
});

scene.build(ROW.length);
show();
if (window.parent !== window) parent.postMessage({ type: "crane-ready" }, "*");
else load(REF);
