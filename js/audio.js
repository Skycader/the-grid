      // ═══════════ AUDIO ═══════════
      let _ac = null,
        _muted = false;
      function ac() {
        if (!_ac)
          _ac = new (window.AudioContext || window.webkitAudioContext)();
        if (_ac.state === "suspended") _ac.resume();
        return _ac;
      }
      function snd(fn) {
        if (_muted) return;
        try {
          fn(ac());
        } catch (e) {}
      }

      const playClick = () =>
        snd((c) => {
          const o = c.createOscillator(),
            g = c.createGain();
          o.connect(g);
          g.connect(c.destination);
          o.type = "square";
          o.frequency.value = 1050;
          g.gain.setValueAtTime(0.048, c.currentTime);
          g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 0.057);
          o.start();
          o.stop(c.currentTime + 0.06);
        });
      const playNav = () =>
        snd((c) => {
          [260, 430].forEach((fr, i) => {
            const o = c.createOscillator(),
              g = c.createGain();
            o.connect(g);
            g.connect(c.destination);
            o.type = "sine";
            o.frequency.value = fr;
            const t = c.currentTime + i * 0.05;
            g.gain.setValueAtTime(0.043, t);
            g.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
            o.start(t);
            o.stop(t + 0.13);
          });
        });
      const playRunStart = () =>
        snd((c) => {
          const o = c.createOscillator(),
            g = c.createGain();
          o.connect(g);
          g.connect(c.destination);
          o.type = "sawtooth";
          o.frequency.setValueAtTime(148, c.currentTime);
          o.frequency.exponentialRampToValueAtTime(760, c.currentTime + 0.24);
          g.gain.setValueAtTime(0.058, c.currentTime);
          g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 0.27);
          o.start();
          o.stop(c.currentTime + 0.28);
        });
      const playAllPass = () =>
        snd((c) => {
          [440, 554, 659, 880].forEach((fr, i) => {
            const o = c.createOscillator(),
              g = c.createGain();
            o.connect(g);
            g.connect(c.destination);
            o.type = "sine";
            o.frequency.value = fr;
            const t = c.currentTime + i * 0.07;
            g.gain.setValueAtTime(0.0001, t);
            g.gain.linearRampToValueAtTime(0.052, t + 0.03);
            g.gain.exponentialRampToValueAtTime(0.0001, t + 0.32);
            o.start(t);
            o.stop(t + 0.34);
          });
        });
      // ── the rank-up animation (js/rank-anim.js) ──
      // While the bar fills: soft TICKS, like a counter (no continuous tone, no glide: nothing that can
      // whistle). One tick every ~70 ms, a short low "bloop" (a triangle wave behind a low-pass filter at
      // 800 Hz); the pitch of the ticks rises a little with the progress inside the rank (half an octave:
      // base → 1.41 × base; base = 200 Hz for a task, 300 Hz for the level of the player).
      // p0 → p1 = the part of the rank that is filled in this segment, ease = the easing of the bar
      // (0..1 → 0..1). Returns a function that silences it (a new run cancels the old one).
      const playRankCharge = (ms, p0, p1, ease, base = 200) => {
        let stop = () => {};
        snd((c) => {
          const master = c.createGain(),
            lp = c.createBiquadFilter(),
            t = c.currentTime,
            dur = Math.max(0.25, ms / 1000),
            n = Math.max(3, Math.round(dur / 0.07));
          lp.type = "lowpass";
          lp.frequency.value = 800;
          lp.Q.value = 0.5;
          master.connect(lp);
          lp.connect(c.destination);
          for (let i = 0; i < n; i++) {
            const at = t + (dur * i) / n,
              f = base * Math.pow(2, 0.5 * (p0 + (p1 - p0) * ease(i / (n - 1)))),
              o = c.createOscillator(),
              g = c.createGain();
            o.type = "triangle";
            o.frequency.value = f;
            o.connect(g);
            g.connect(master);
            g.gain.setValueAtTime(0.0001, at);
            g.gain.linearRampToValueAtTime(0.07, at + 0.004);
            g.gain.exponentialRampToValueAtTime(0.0001, at + 0.055);
            o.start(at);
            o.stop(at + 0.06);
          }
          stop = () => {
            try {
              master.gain.cancelScheduledValues(c.currentTime);
              master.gain.setValueAtTime(0, c.currentTime);
            } catch (e) {}
          };
        });
        return () => stop();
      };
      // the rank goes up: a warm arpeggio (C E G C, from the 4th octave) with a quiet shimmer an octave
      // above and a low thump
      const playRankUp = () =>
        snd((c) => {
          [261.63, 329.63, 392, 523.25].forEach((fr, i) => {
            const o = c.createOscillator(),
              g = c.createGain(),
              t = c.currentTime + i * 0.075;
            o.type = "triangle";
            o.frequency.value = fr;
            o.connect(g);
            g.connect(c.destination);
            g.gain.setValueAtTime(0.0001, t);
            g.gain.linearRampToValueAtTime(0.085, t + 0.02);
            g.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);
            o.start(t);
            o.stop(t + 0.47);
            if (fr * 2 > 800) return; // no shimmer above 800 Hz: nothing shrill
            const s = c.createOscillator(),
              sg = c.createGain();
            s.type = "sine";
            s.frequency.value = fr * 2;
            s.connect(sg);
            sg.connect(c.destination);
            sg.gain.setValueAtTime(0.0001, t);
            sg.gain.linearRampToValueAtTime(0.016, t + 0.02);
            sg.gain.exponentialRampToValueAtTime(0.0001, t + 0.3);
            s.start(t);
            s.stop(t + 0.32);
          });
          const b = c.createOscillator(),
            bg = c.createGain();
          b.type = "sine";
          b.frequency.setValueAtTime(130, c.currentTime);
          b.frequency.exponentialRampToValueAtTime(55, c.currentTime + 0.22);
          b.connect(bg);
          bg.connect(c.destination);
          bg.gain.setValueAtTime(0.09, c.currentTime);
          bg.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 0.25);
          b.start();
          b.stop(c.currentTime + 0.27);
        });
      // the bar stopped inside the rank: a soft two-note "done"
      const playRankDone = () =>
        snd((c) => {
          [392, 523.25].forEach((fr, i) => {
            const o = c.createOscillator(),
              g = c.createGain(),
              t = c.currentTime + i * 0.09;
            o.type = "sine";
            o.frequency.value = fr;
            o.connect(g);
            g.connect(c.destination);
            g.gain.setValueAtTime(0.0001, t);
            g.gain.linearRampToValueAtTime(0.06, t + 0.02);
            g.gain.exponentialRampToValueAtTime(0.0001, t + 0.3);
            o.start(t);
            o.stop(t + 0.3);
          });
        });
      const playFail = () =>
        snd((c) => {
          const o = c.createOscillator(),
            g = c.createGain();
          o.connect(g);
          g.connect(c.destination);
          o.type = "sawtooth";
          o.frequency.setValueAtTime(395, c.currentTime);
          o.frequency.exponentialRampToValueAtTime(152, c.currentTime + 0.34);
          g.gain.setValueAtTime(0.07, c.currentTime);
          g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 0.37);
          o.start();
          o.stop(c.currentTime + 0.38);
        });
      const playError = () =>
        snd((c) => {
          [298, 278, 258].forEach((fr, i) => {
            const o = c.createOscillator(),
              g = c.createGain();
            o.connect(g);
            g.connect(c.destination);
            o.type = "square";
            o.frequency.value = fr;
            const t = c.currentTime + i * 0.08;
            g.gain.setValueAtTime(0.058, t);
            g.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);
            o.start(t);
            o.stop(t + 0.11);
          });
        });
      let _lt = 0;
      const playType = () => {
        const n = Date.now();
        if (n - _lt < 34) return;
        _lt = n;
        snd((c) => {
          const buf = c.createBuffer(
            1,
            Math.floor(c.sampleRate * 0.02),
            c.sampleRate,
          );
          const d = buf.getChannelData(0);
          for (let i = 0; i < d.length; i++)
            d[i] = (Math.random() * 2 - 1) * (1 - i / d.length) * 0.74;
          const src = c.createBufferSource(),
            fi = c.createBiquadFilter(),
            g = c.createGain();
          fi.type = "bandpass";
          fi.frequency.value = 2580;
          fi.Q.value = 1.9;
          src.buffer = buf;
          src.connect(fi);
          fi.connect(g);
          g.connect(c.destination);
          g.gain.value = 0.014;
          src.start();
        });
      };

      function toggleMute() {
        _muted = !_muted;
        const b = document.getElementById("btn-mute");
        b.textContent = _muted ? "♪ MUTED" : "♪ SOUND";
        b.classList.toggle("active", _muted);
        if (!_muted) playClick();
      }
      function toggleFS() {
        if (!document.fullscreenElement)
          document.documentElement.requestFullscreen().catch(() => {});
        else document.exitFullscreen().catch(() => {});
        playClick();
      }

