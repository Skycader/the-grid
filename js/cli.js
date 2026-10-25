      // ═══════════ CLI (the browser console / DevTools) ═══════════
      // The console has ONE command: run. Everything else is what you give to run:
      //   run("help")
      //   run("edit regex_15 lastSolved 01.10.2026:14:26:00")
      //   run("animation level-up +23 days")
      //   run("override global_need 100")
      // DevTools cannot parse a bare `edit regex_15 lastSolved ...` (it is not JS), so the command is a string
      // (or a tagged template: run`edit regex_15 lastSolved now`). Several strings are joined with a space.
      const CLI_STYLE = {
        h: "color:#00ffff;font-weight:bold",
        cmd: "color:#ffd84a;font-weight:bold",
        ok: "color:#859900;font-weight:bold",
        err: "color:#dc322f;font-weight:bold",
        dim: "color:#839496",
      };

      function cliFmtDate(ts) {
        if (ts == null) return "never";
        const d = new Date(ts),
          p = (n) => String(n).padStart(2, "0");
        return `${p(d.getDate())}.${p(d.getMonth() + 1)}.${d.getFullYear()} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
      }

      // DD.MM.YYYY[:HH:MM[:SS]] | now | none  →  ms | null | NaN (an error)
      function cliParseDate(s) {
        s = s.trim();
        if (/^now$/i.test(s)) return Date.now();
        if (/^(none|never)$/i.test(s)) return null;
        const m = s.match(
          /^(\d{1,2})\.(\d{1,2})\.(\d{4})(?:[: ](\d{1,2}):(\d{2})(?::(\d{2}))?)?$/,
        );
        if (!m) return NaN;
        const n = (i) => (m[i] === undefined ? 0 : +m[i]);
        const [d, mo, y, h, mi, se] = [1, 2, 3, 4, 5, 6].map(n);
        const dt = new Date(y, mo - 1, d, h, mi, se);
        // 31.02, 25:99 and the like are cut off (Date silently carries them over)
        if (
          dt.getFullYear() !== y ||
          dt.getMonth() !== mo - 1 ||
          dt.getDate() !== d ||
          dt.getHours() !== h ||
          dt.getMinutes() !== mi ||
          dt.getSeconds() !== se
        )
          return NaN;
        return dt.getTime();
      }

      // a task by id (regex_15) or by the name of the file (ex15), case does not matter
      function cliFindTask(name) {
        const q = name.toLowerCase(),
          all = [];
        MENU.forEach((top) => gatherAllTasks(top, all));
        return all.filter(
          ({ task }) =>
            task.id.toLowerCase() === q ||
            String(task.file).toLowerCase() === q,
        );
      }

      function cliErr(msg) {
        console.log("%c✗ " + msg, CLI_STYLE.err);
      }

      function cliHelp() {
        const L = (cmd, desc, examples = []) => {
          console.log("%c" + cmd, CLI_STYLE.cmd);
          console.log("%c  " + desc, CLI_STYLE.dim);
          examples.forEach((e) => console.log("    " + e));
        };
        console.log("%cGRID::RUNNER CLI: one command, run(\"<what to do>\")", CLI_STYLE.h);
        L("run(\"help\")", "show this help");
        L(
          "run(\"edit <task> lastSolved <date>\")",
          "set the date of the last solve of a task (<task> is an id or a file: regex_15, ex15).\n  <date> = DD.MM.YYYY[:HH:MM[:SS]] | now | none (back to \"never solved\")",
          [
            'run("edit regex_15 lastSolved 01.10.2026:14:26:00")',
            'run("edit regex_15 lastSolved 01.10.2026")   // the time is optional: 00:00:00',
            'run("edit ex15 lastSolved now")',
            'run("edit regex_15 lastSolved none")',
          ],
        );
        L(
          "run(\"animation level-up +<N> days\")",
          "a plate under the rank of the open task: the bar goes from the rank to the next one (the data is not changed)",
          ['run("animation level-up +23 days")'],
        );
        L(
          "run(\"override global_need <0-100>|off\")",
          "fill the square of the total need on the HARVEST button with the given percent (a test: nothing is saved); off = back to the measured value",
          ['run("override global_need 100")', 'run("override global_need off")'],
        );
        console.log(
          "%cThe quotes (or backticks) are needed: the console does not parse a bare `edit regex_15 ...` as JS.",
          CLI_STYLE.dim,
        );
      }

      const CLI_EDIT_FIELDS = {
        lastsolved(task, cat, dateStr) {
          const ts = cliParseDate(dateStr);
          if (Number.isNaN(ts))
            return cliErr(
              `cannot read the date "${dateStr}". Format: DD.MM.YYYY[:HH:MM[:SS]] | now | none`,
            );
          if (ts != null && ts > Date.now())
            return cliErr("the date is in the future: lastSolved cannot be later than now");
          const key = `${cat.id}/${task.id}`;
          const prev = walletSetLastSolved(key, ts);
          if (_vsCat && view === "category") renderRows(); // redraw the need meters
          console.log(
            `%c✓ ${key} lastSolved: ${cliFmtDate(prev)} → ${cliFmtDate(ts)}`,
            CLI_STYLE.ok,
          );
        },
      };

      // edit <task> lastSolved <date>
      function cliEdit(line) {
        const m = line.trim().match(/^(\S+)\s+(\S+)\s+([\s\S]+)$/);
        if (!m) return cliErr('format: run("edit <task> lastSolved <date>")  (see run("help"))');
        const [, name, field, value] = m;
        const handler = CLI_EDIT_FIELDS[field.toLowerCase()];
        if (!handler) return cliErr(`unknown field "${field}". Available: lastSolved`);
        const hits = cliFindTask(name);
        if (!hits.length)
          return cliErr(`task "${name}" not found (the catalog may not be loaded yet: try again in a couple of seconds)`);
        if (hits.length > 1)
          return cliErr(`"${name}" is ambiguous: ${hits.map((h) => h.cat.id + "/" + h.task.id).join(", ")}`);
        handler(hits[0].task, hits[0].cat, value);
      }

      // override global_need <0-100>|off
      function cliOverride(what, value) {
        if (what.toLowerCase() !== "global_need") return cliErr(`unknown value "${what}". Available: global_need`);
        if (/^(off|none)$/i.test(value)) {
          hvNeedOverride(null);
          return console.log("%c✓ global_need: the measured value again", CLI_STYLE.ok);
        }
        const v = Number(value);
        if (!value || !Number.isFinite(v) || v < 0 || v > 100) return cliErr('the value is a percent from 0 to 100 (or off): run("override global_need 100")');
        hvNeedOverride(v);
        console.log(`%c✓ global_need: ${v}% (a test: it is not saved)`, CLI_STYLE.ok);
      }

      // the one command of the console
      function cliRun(line) {
        const s = line.trim();
        if (!s || /^help$/i.test(s)) return cliHelp();
        let m = s.match(/^edit\s+([\s\S]+)$/i);
        if (m) return cliEdit(m[1]);
        m = s.match(/^animation\s+level-up\s+\+?(\d+(?:\.\d+)?)\s*days?$/i);
        if (m) return rankAnimLevelUp(+m[1]);
        m = s.match(/^override\s+(\S+)\s+(\S+)$/i);
        if (m) return cliOverride(m[1], m[2]);
        cliErr(`unknown command "${s}". Try run("help")`);
      }

      window.run = function (first, ...rest) {
        const line =
          Array.isArray(first) && first.raw
            ? String.raw({ raw: first }, ...rest)
            : [first, ...rest].join(" ");
        cliRun(line);
      };

      console.log('%cGRID::RUNNER CLI: run("help")', CLI_STYLE.h);
