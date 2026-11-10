// Worker of the crane DEMO: runs the player's f(crane) on a recording crane and posts the events
// ({ kind: "get" | "grab" | "put", index, value }: the format of the Api of main-frame) for the timeline.
// The rules are the same as in the spec (grab / put are a stack of 2, an accident stops the crane).
const MAX_EVENTS = 5000;

self.onmessage = (e) => {
  const { code, row } = e.data;
  const events = [];
  const cells = row.slice();
  const hand = [];
  const stop = (m) => {
    throw new Error(m);
  };
  const inRow = (i) => Number.isInteger(i) && i >= 0 && i < cells.length;
  const log = (ev) => {
    if (events.length >= MAX_EVENTS) stop("too many commands");
    events.push(ev);
  };
  const crane = {
    getLength: () => cells.length,
    scan(i) {
      if (!inRow(i)) stop("scan outside of the row: " + i);
      const value = cells[i] === null ? undefined : cells[i];
      log({ kind: "get", index: i, value });
      return value;
    },
    grab(i) {
      if (hand.length >= 2) stop("the magnet holds 2 containers already");
      if (!inRow(i)) stop("grab outside of the row: " + i);
      if (cells[i] === null) stop("grab from an empty cell: " + i);
      const value = cells[i];
      hand.push(value);
      cells[i] = null;
      log({ kind: "grab", index: i, value });
    },
    put(i) {
      if (!hand.length) stop("put with an empty magnet");
      if (!inRow(i)) stop("put outside of the row: " + i);
      if (cells[i] !== null) stop("put into a taken cell: " + i);
      const value = hand.pop();
      cells[i] = value;
      log({ kind: "put", index: i, value });
    },
  };
  let error = null;
  try {
    const mod = { exports: {} };
    new Function("module", "exports", "require", code)(mod, mod.exports, () => mod.exports);
    mod.exports(crane);
    if (hand.length) error = "the magnet is not empty at the end";
    else if (cells.some((c) => c === null)) error = "a cell is empty at the end";
  } catch (err) {
    error = String(err.message || err);
  }
  self.postMessage({ events, error });
};
