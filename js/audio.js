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

