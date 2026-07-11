      // ═══════════ BACKGROUND ═══════════
      const cv = document.getElementById("bg"),
        cx = cv.getContext("2d");
      let T = 0,
        lightnings = [];
      function resize() {
        cv.width = innerWidth;
        cv.height = innerHeight;
      }
      resize();
      window.addEventListener("resize", resize);

      function lcg(seed) {
        let s = seed >>> 0;
        return () => {
          s = (1664525 * s + 1013904223) >>> 0;
          return s / 4294967296;
        };
      }
      const rnd = lcg(0xcafe1234);
      const STARS = Array.from({ length: 120 }, () => ({
        x: rnd(),
        y: rnd() * 0.44,
        sz: rnd() < 0.14 ? 1.5 : 1,
        ph: rnd() * Math.PI * 2,
        sp: 0.28 + rnd() * 0.48,
      }));

      function drawBg(t) {
        const W = cv.width,
          H = cv.height;
        const sky = cx.createLinearGradient(0, 0, 0, H * 0.56);
        sky.addColorStop(0, "#000005");
        sky.addColorStop(0.75, "#000a10");
        sky.addColorStop(1, "#001420");
        cx.fillStyle = sky;
        cx.fillRect(0, 0, W, H);
        const gnd = cx.createLinearGradient(0, H * 0.5, 0, H);
        gnd.addColorStop(0, "#000d18");
        gnd.addColorStop(1, "#000208");
        cx.fillStyle = gnd;
        cx.fillRect(0, H * 0.5, W, H * 0.5);
        const hg = cx.createLinearGradient(0, H * 0.43, 0, H * 0.62);
        hg.addColorStop(0, "rgba(0,80,140,0)");
        hg.addColorStop(0.5, "rgba(0,180,220,.1)");
        hg.addColorStop(1, "rgba(0,80,140,0)");
        cx.fillStyle = hg;
        cx.fillRect(0, H * 0.43, W, H * 0.22);
        cx.save();
        STARS.forEach((s) => {
          const fl = 0.3 + 0.7 * Math.abs(Math.sin(t * s.sp + s.ph));
          cx.fillStyle = `rgba(160,220,255,${fl * 0.5})`;
          cx.fillRect(s.x * W, s.y * H, s.sz, s.sz);
        });
        cx.restore();
        drawGrid(W, H, t);
        if (Math.random() < 0.0038) lightnings.push(mkLightning(W, H));
        cx.save();
        lightnings = lightnings.filter((l) => l.a > 0.01);
        lightnings.forEach((l) => {
          l.a -= l.dk;
          drawLP(l.pts, 1.4, l.a * 0.88);
          l.br.forEach((b) => drawLP(b, 0.65, l.a * 0.36));
          if (l.a > 0.65) {
            cx.fillStyle = `rgba(100,170,255,${(l.a - 0.65) * 0.07})`;
            cx.fillRect(0, 0, W, H);
          }
        });
        cx.restore();
      }
      function drawGrid(W, H, t) {
        const hz = H * 0.5,
          vpX = W * 0.5,
          NV = 26,
          dz = 1,
          spd = 0.52,
          scroll = (t * spd) % dz,
          maxN = 32;
        // ── GRID_SPREAD controls how wide the infinite plane appears.
        // 0.0 = road-narrow,  0.8 = moderate (default),  2.0+ = extremely wide.
        // Increase to push vertical lines further beyond screen edges.
        const GRID_SPREAD = 0.8;
        const BL = -W * GRID_SPREAD;
        const BR = W * (1 + GRID_SPREAD);
        cx.save();
        cx.beginPath();
        cx.rect(0, hz, W, H - hz + 2);
        cx.clip();
        for (let i = 0; i <= NV; i++) {
          const bx = BL + (i / NV) * (BR - BL),
            isMid = i === NV / 2;
          cx.beginPath();
          cx.moveTo(vpX, hz);
          cx.lineTo(bx, H + 4);
          cx.strokeStyle = `rgba(0,200,255,${isMid ? 0.5 : 0.14})`;
          cx.lineWidth = isMid ? 1.2 : 0.55;
          cx.stroke();
        }
        const C = (H - hz) * dz;
        for (let n = 1; n <= maxN; n++) {
          const wz = n * dz - scroll;
          if (wz <= 0.01) continue;
          const y = hz + C / wz;
          if (y <= hz + 0.5 || y > H + 4) continue;
          const frac = (y - hz) / (H - hz);
          const lx = vpX + (BL - vpX) * frac,
            rx = vpX + (BR - vpX) * frac;
          const alpha = Math.min(0.42, frac * frac * 1.8);
          cx.beginPath();
          cx.moveTo(lx, y);
          cx.lineTo(rx, y);
          cx.strokeStyle = `rgba(0,200,255,${alpha})`;
          cx.lineWidth = 0.55;
          cx.stroke();
        }
        const hgl = cx.createLinearGradient(0, hz - 2, 0, hz + 7);
        hgl.addColorStop(0, "rgba(0,200,255,0)");
        hgl.addColorStop(0.5, "rgba(0,200,255,.17)");
        hgl.addColorStop(1, "rgba(0,200,255,0)");
        cx.fillStyle = hgl;
        cx.fillRect(0, hz - 2, W, 9);
        cx.restore();
      }
      function mkLightning(W, H) {
        const x = rnd() * W,
          y0 = rnd() * H * 0.22,
          y1 = y0 + 50 + rnd() * 100;
        const pts = [{ x, y: y0 }];
        let cx2 = x,
          cy = y0;
        while (cy < y1) {
          cy += 7 + rnd() * 13;
          cx2 += (rnd() - 0.5) * 33;
          pts.push({ x: cx2, y: cy });
        }
        const br = [];
        if (pts.length > 2 && rnd() > 0.52) {
          const bi = Math.floor(pts.length * 0.4);
          let bx = pts[bi].x,
            by = pts[bi].y;
          const bp = [{ x: bx, y: by }];
          for (let i = 0; i < 3 + Math.floor(rnd() * 4); i++) {
            by += 5 + rnd() * 9;
            bx += (rnd() - 0.5) * 23;
            bp.push({ x: bx, y: by });
          }
          br.push(bp);
        }
        return { pts, br, a: 1, dk: 0.046 + rnd() * 0.05 };
      }
      function drawLP(pts, w, a) {
        if (pts.length < 2) return;
        cx.beginPath();
        cx.moveTo(pts[0].x, pts[0].y);
        for (let i = 1; i < pts.length; i++) cx.lineTo(pts[i].x, pts[i].y);
        cx.strokeStyle = `rgba(160,212,255,${a})`;
        cx.lineWidth = w;
        cx.shadowBlur = 10;
        cx.shadowColor = "#55aaff";
        cx.stroke();
        cx.shadowBlur = 0;
      }
      function loop(ts) {
        T = ts / 1000;
        resize();
        drawBg(T);
        requestAnimationFrame(loop);
      }
      requestAnimationFrame(loop);

