// DEMO: the crane. The scene: a port of src/components/CraneScene.tsx of main-frame to plain DOM.
// The scene has a fixed design size (SCENE_W x SCENE_H); the stage scales it to the window, so the pixel
// values of the CSS (the magnet, the containers) stay as they were drawn.

const SCENE_W = 720;
const SCENE_H = 420;
const ARM_RAISED = 16;
const ARM_RAISED_STACK = 8;

const el = (cls, html) => {
  const d = document.createElement("div");
  d.className = cls;
  if (html) d.innerHTML = html;
  return d;
};
const containerHtml = (c) => `<div class="container" data-id="${c.id}"><span class="container-value">${c.value}</span></div>`;

class Scene {
  constructor(stage) {
    this.stage = stage;
    this.length = 0;
    this.armDrop = ARM_RAISED;
    this.scale = 1;
    this.keys = {};
    this.root = null;
  }

  // the skeleton of the scene for a row of n cells
  build(n) {
    this.length = n;
    this.stage.innerHTML = "";
    const s = el("scene");
    s.innerHTML =
      `<div class="scene-sky"></div><div class="scene-grid"></div>` +
      `<div class="gantry"><div class="gantry-rail"></div>` +
      `<div class="crane"><div class="crane-trolley"><div class="crane-cabin"></div>` +
      `<div class="crane-winch"><span></span><span></span><span></span></div></div>` +
      `<div class="crane-cable"></div>` +
      `<div class="crane-spreader"><div class="spreader-beam"><em></em><em></em></div>` +
      `<div class="magnet"><div class="magnet-yoke"><span></span><span></span></div>` +
      `<div class="magnet-core"><i class="magnet-coil"></i><i class="magnet-coil"></i><i class="magnet-coil"></i><b class="magnet-face"></b></div>` +
      `<div class="magnet-rack"></div><div class="magnet-bay"></div>` +
      `<div class="laser-gun"><span class="laser-gun-body"></span><span class="laser-gun-barrel"></span><span class="laser-gun-lens"></span></div>` +
      `</div></div></div></div>` +
      `<div class="crane-laser" hidden><span class="crane-laser-core"></span><span class="crane-laser-glow"></span><span class="crane-laser-spot"></span></div>` +
      `<div class="deck"><div class="deck-hull"></div><div class="deck-slots" style="--n:${n}"></div><div class="deck-water"></div></div>` +
      `<div class="op-badge"><span class="op-kind"></span><span class="op-detail"></span></div>`;
    this.stage.appendChild(s);
    this.root = s;
    const q = (c) => s.querySelector(c);
    this.q = {
      crane: q(".crane"),
      trolley: q(".crane-trolley"),
      cable: q(".crane-cable"),
      magnet: q(".magnet"),
      rack: q(".magnet-rack"),
      bay: q(".magnet-bay"),
      gun: q(".laser-gun"),
      lens: q(".laser-gun-lens"),
      laser: q(".crane-laser"),
      slots: q(".deck-slots"),
      kind: q(".op-kind"),
      detail: q(".op-detail"),
    };
    this.slotEls = [];
    for (let i = 0; i < n; i++) {
      const slot = el("deck-slot");
      slot.innerHTML = `<div class="deck-index">${i}</div><div class="deck-target"></div><div class="deck-pedestal"></div>`;
      this.q.slots.appendChild(slot);
      this.slotEls.push({
        slot,
        target: slot.querySelector(".deck-target"),
        pedestal: slot.querySelector(".deck-pedestal"),
      });
    }
    this.keys = {};
    this.fit();
  }

  // scale the design size to the stage
  fit() {
    if (!this.root) return;
    const w = this.stage.clientWidth,
      h = this.stage.clientHeight;
    this.scale = Math.max(0.2, Math.min(w / SCENE_W, h / SCENE_H));
    const x = (w - SCENE_W * this.scale) / 2,
      y = (h - SCENE_H * this.scale) / 2;
    this.root.style.transform = `translate(${x}px, ${y}px) scale(${this.scale})`;
  }

  // a size on the screen → the size in the design pixels of the scene
  design(px) {
    return px / this.scale;
  }

  // set the innerHTML of a node only when it changed (the CSS animation of a node is not restarted)
  setHtml(name, node, html) {
    if (this.keys[name] === html) return;
    this.keys[name] = html;
    node.innerHTML = html;
  }
}
