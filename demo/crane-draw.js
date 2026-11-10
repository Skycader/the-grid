// DEMO: the crane. Scene.draw(frame): puts every element where the frame says (CraneScene.tsx of main-frame).

const describeOp = (frame) => {
  const op = frame.op;
  switch (op.type) {
    case "move":
      return `→ index ${op.index}`;
    case "scan":
      return `read [${op.index}] = ${op.value}`;
    case "grab":
      return `stack[${op.depth}] ← [${op.index}] (${op.value})`;
    case "place":
      return frame.releasing ? `release @ [${op.index}] (${op.value})` : `stack → [${op.index}] (${op.value})`;
    case "hoist":
      return "park #1 up — clear magnet face";
    case "mark":
      return op.label === "done" ? "sorted — standby" : op.label;
    case "lower":
      return "arm down";
    case "raise":
      return "arm up";
    default:
      return "";
  }
};

Scene.prototype.draw = function (frame, target, speedMs) {
  const q = this.q,
    n = this.length,
    op = frame.op;
  const armMs = Math.max(160, Math.round(speedMs * 0.92));
  const steps = op.type === "move" ? Math.max(1, op.steps || 1) : 1;
  // a ride that starts with the arm up waits a little, so the load clears the neighbours; the slot of the frames is kept
  const lead = op.type === "move" && op.lift ? Math.round(armMs * 0.4) : 0;
  const moveMs = op.type === "move" ? Math.max(120, Math.round(speedMs * steps) - lead) : speedMs;
  this.root.style.setProperty("--arm-ms", armMs + "ms");
  this.root.style.setProperty("--move-ms", moveMs + "ms");
  this.root.style.setProperty("--move-lead", lead + "ms");
  // one cell at a time (the scan walk): constant speed, no brake at every cell; a long ride accelerates and brakes softly
  this.root.style.setProperty("--move-ease", op.type === "move" && steps === 1 && !op.lift ? "linear" : "cubic-bezier(0.45, 0.05, 0.25, 1)");

  const scanning = op.type === "scan";
  const scanIndex = scanning ? op.index : -1;
  const busy = op.type === "grab" || op.type === "place" || op.type === "hoist" || frame.craneLowered;
  const tallStack = frame.hoisting || frame.stack.length >= 2;
  const st = frame.stack;

  // the crane rides along the rail
  q.crane.style.left = `${((frame.craneIndex + 0.5) * 100) / Math.max(n, 1)}%`;
  // the rollers of the trolley turn while it rides, in the direction of the ride
  if (this.craneShown !== undefined && this.craneShown !== frame.craneIndex) {
    q.crane.classList.add("is-riding");
    q.crane.classList.toggle("is-left", frame.craneIndex < this.craneShown);
    clearTimeout(this.rideTimer);
    this.rideTimer = setTimeout(() => q.crane.classList.remove("is-riding"), moveMs);
  }
  this.craneShown = frame.craneIndex;
  q.crane.classList.toggle("is-scanning", scanning);
  q.crane.classList.toggle("is-working", busy);

  // what hangs on the magnet: [upper (the first grabbed), lower (the tip, leaves first)]
  const upper = frame.hoisting && st.length === 1 ? st[0] : st.length === 2 ? st[0] : null;
  const lower = frame.hoisting && st.length === 1 ? null : st.length === 2 ? st[1] : st[0] || null;
  q.magnet.className =
    "magnet" + (frame.magnetOn ? " is-on" : "") + (upper ? " has-upper" : "") + (lower ? " has-lower" : "") + (scanning ? " is-scanning" : "");
  q.magnet.querySelector(".magnet-core").classList.toggle("is-on", frame.magnetOn);
  q.rack.classList.toggle("has-cargo", !!upper);
  this.setHtml("upper", q.rack, upper ? `<div class="magnet-item magnet-item-upper">${containerHtml(upper)}</div>` : "");
  this.setHtml("lower", q.bay, lower ? `<div class="magnet-item magnet-item-lower">${containerHtml(lower)}</div>` : "");
  q.gun.classList.toggle("is-firing", scanning);

  // the deck
  const values = frame.cells.map((c) => (c ? c.value : null));
  let activeTarget = null;
  for (let i = 0; i < n; i++) {
    const cell = frame.cells[i],
      d = this.slotEls[i];
    const active = frame.craneIndex === i,
      isScan = scanIndex === i;
    const isWork = (op.type === "grab" || op.type === "place") && op.index === i;
    const hide = frame.releasing && op.type === "place" && op.index === i;
    const showCargo = !!(cell && !hide);
    const lamp = showCargo ? placementStatus(values, target, i) : null;
    d.slot.className =
      "deck-slot" + (active ? " is-active" : "") + (isScan ? " is-scan" : "") + (isWork ? " is-grab" : "") + (lamp ? ` lamp-${lamp}` : "");
    this.setHtml(`cell${i}`, d.target, showCargo ? containerHtml(cell) : `<div class="deck-empty">∅</div>`);
    this.setHtml(
      `lamp${i}`,
      d.pedestal,
      lamp ? `<div class="pedestal-lamp is-${lamp}"><span class="pedestal-lamp-bulb"></span><span class="pedestal-lamp-glow"></span></div>` : "",
    );
    if (active || isScan) activeTarget = d.target;
  }

  q.kind.textContent = op.type;
  q.detail.textContent = describeOp(frame);

  // the depth of the arm: measured from the real geometry (the design pixels), never prev + delta
  if (!frame.craneLowered) {
    this.armDrop = tallStack ? ARM_RAISED_STACK : ARM_RAISED;
  } else if (activeTarget) {
    const tb = q.trolley.getBoundingClientRect().bottom;
    const cableH = q.cable.getBoundingClientRect().height;
    const bayTop = q.bay.getBoundingClientRect().top;
    const belowCable = bayTop - tb - cableH;
    const padTop = activeTarget.getBoundingClientRect().top;
    let aimTop = padTop;
    const deckBox = activeTarget.querySelector(":scope > .container");
    const heldBox = q.bay.querySelector(".container");
    if (deckBox && heldBox) aimTop = deckBox.getBoundingClientRect().top - heldBox.getBoundingClientRect().height - 2 * this.scale;
    const needed = Math.round(this.design(aimTop - tb - belowCable));
    const next = Math.max(8, needed);
    if (Math.abs(this.armDrop - next) > 2) this.armDrop = next;
  }
  // the winch drum turns while the chain is paid out or hauled in
  if (this.armShown !== undefined && this.armShown !== this.armDrop) {
    q.crane.classList.add("is-winding");
    q.crane.classList.toggle("is-up", this.armDrop < this.armShown);
    clearTimeout(this.windTimer);
    this.windTimer = setTimeout(() => q.crane.classList.remove("is-winding"), armMs);
  }
  this.armShown = this.armDrop;
  q.crane.style.setProperty("--arm", this.armDrop + "px");

  // the laser: from the lens down to the container that is read
  if (scanning && activeTarget) {
    const sr = this.root.getBoundingClientRect();
    const er = q.lens.getBoundingClientRect();
    const tr = activeTarget.getBoundingClientRect();
    const height = Math.max(0, this.design(tr.top + tr.height * 0.15 - er.bottom));
    if (height >= 4) {
      q.laser.hidden = false;
      q.laser.style.left = Math.round(this.design(er.left + er.width / 2 - sr.left)) + "px";
      q.laser.style.top = Math.round(this.design(er.bottom - sr.top)) + "px";
      q.laser.style.height = Math.round(height) + "px";
      return;
    }
  }
  q.laser.hidden = true;
};
