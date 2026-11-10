// DEMO: the crane. The timeline: the events of the Api → the frames of the animation.
// A port of src/lib/craneCompiler.ts of main-frame. A frame is one step of the show:
//   op      { type: move | lower | raise | hoist | scan | grab | place | mark, ... }
//   cells   the containers on the deck ({ value, id } or null)
//   stack   the containers on the magnet: [first grabbed, ..., last grabbed]; the last one leaves first
//   craneIndex, craneLowered, hoisting (the first container is parked up before the 2nd grab), magnetOn, releasing
//   apiReads / apiGrabs / apiPuts   the counters at this frame

const cellId = (index, value, salt) => `c-${index}-${value}-${salt}`;

function initialFrame(arr) {
  return {
    op: { type: "mark", label: "ready" },
    cells: arr.map((value, index) => ({ value, id: cellId(index, value, index) })),
    stack: [],
    craneIndex: 0,
    craneLowered: false,
    hoisting: false,
    magnetOn: false,
    releasing: false,
    apiReads: 0,
    apiGrabs: 0,
    apiPuts: 0,
  };
}

function compileTimeline(initial, events) {
  const cells = initial.map((value, index) => ({ value, id: cellId(index, value, index) }));
  const stack = [];
  let craneIndex = 0,
    craneLowered = false,
    hoisting = false,
    releasing = false,
    reads = 0,
    grabs = 0,
    puts = 0;
  const frames = [];

  const push = (op) => {
    if (op.type === "move") craneIndex = op.index;
    if (op.type === "lower") craneLowered = true;
    if (op.type === "raise") craneLowered = false;
    if (op.type === "hoist") hoisting = true;
    frames.push({
      op,
      cells: cells.map((c) => (c ? { ...c } : null)),
      stack: stack.map((h) => ({ ...h })),
      craneIndex,
      craneLowered,
      hoisting,
      magnetOn: stack.length > 0 || craneLowered || hoisting,
      releasing,
      apiReads: reads,
      apiGrabs: grabs,
      apiPuts: puts,
    });
  };
  const raiseArm = () => {
    if (!craneLowered) return;
    push({ type: "raise" });
    push({ type: "raise" });
  };
  const lowerArm = () => {
    if (craneLowered) return;
    push({ type: "lower" });
    push({ type: "lower" });
  };
  // one slide; the hold frames keep the playback time close to the travel time
  const moveTo = (index) => {
    if (craneIndex === index) return;
    raiseArm();
    const from = craneIndex,
      steps = Math.abs(index - from);
    for (let i = 0; i < steps; i++) push({ type: "move", index, from, steps });
  };

  for (const ev of events) {
    if (ev.kind === "get") {
      reads++;
      moveTo(ev.index);
      raiseArm();
      push({ type: "scan", index: ev.index, value: ev.value });
      continue;
    }
    if (ev.kind === "grab") {
      grabs++;
      moveTo(ev.index);
      // already holding one: park it up before the next one is attached below it
      if (stack.length === 1) {
        raiseArm();
        push({ type: "hoist" });
        push({ type: "hoist" });
      }
      lowerArm();
      const held = cells[ev.index];
      if (!held) {
        push({ type: "mark", label: `grab fail @${ev.index}` });
        continue;
      }
      cells[ev.index] = null;
      stack.push(held);
      hoisting = false;
      push({ type: "grab", index: ev.index, value: held.value, depth: stack.length });
      push({ type: "grab", index: ev.index, value: held.value, depth: stack.length });
      raiseArm();
      continue;
    }
    // put: the last grabbed one leaves first
    puts++;
    moveTo(ev.index);
    lowerArm();
    if (!stack.length) {
      push({ type: "mark", label: `put fail @${ev.index}` });
      continue;
    }
    push({ type: "lower" });
    const held = stack[stack.length - 1];
    cells[ev.index] = held;
    releasing = true;
    push({ type: "place", index: ev.index, value: held.value, depth: stack.length });
    stack.pop();
    releasing = false;
    // what is left on the magnet is parked up, so it does not sit on the box just placed
    hoisting = stack.length > 0;
    push({ type: "place", index: ev.index, value: held.value, depth: stack.length + 1 });
    push({ type: "place", index: ev.index, value: held.value, depth: stack.length + 1 });
    raiseArm();
    if (hoisting) {
      hoisting = false;
      push({ type: "raise" });
    }
  }

  // the end: the arm is up, no blinking laser on the last frame
  raiseArm();
  hoisting = false;
  releasing = false;
  push({ type: "mark", label: "done" });
  return frames;
}

// the pedestal lamp of a cell: green = the final place, yellow = a wrong place but a right neighbour, red = lost
function sortedTarget(values) {
  return [...values].sort((a, b) => a - b);
}
function placementStatus(cellValues, target, index) {
  const v = cellValues[index];
  if (v === null || v === undefined || index >= target.length) return null;
  if (v === target[index]) return "green";
  const pair = (l, r) => target.some((t, i) => t === l && target[i + 1] === r);
  const left = index > 0 ? cellValues[index - 1] : null;
  const right = index < cellValues.length - 1 ? cellValues[index + 1] : null;
  if ((left != null && pair(left, v)) || (right != null && pair(v, right))) return "yellow";
  return "red";
}
