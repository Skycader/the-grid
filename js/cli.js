      // ═══════════ CLI (консоль браузера / DevTools) ═══════════
      // DevTools не умеет парсить `edit regex_15 lastSolved ...` без кавычек (это не JS),
      // поэтому `help` — геттер (работает голым словом), а `edit` принимает:
      //   edit`regex_15 lastSolved 01.10.2026:14:26:00`        (tagged template)
      //   edit("regex_15 lastSolved 01.10.2026:14:26:00")
      //   edit("regex_15", "lastSolved", "01.10.2026:14:26:00")
      const CLI_STYLE = {
        h: "color:#00ffff;font-weight:bold",
        cmd: "color:#ffd84a;font-weight:bold",
        ok: "color:#859900;font-weight:bold",
        err: "color:#dc322f;font-weight:bold",
        dim: "color:#839496",
      };

      function cliFmtDate(ts) {
        if (ts == null) return "никогда";
        const d = new Date(ts),
          p = (n) => String(n).padStart(2, "0");
        return `${p(d.getDate())}.${p(d.getMonth() + 1)}.${d.getFullYear()} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
      }

      // DD.MM.YYYY[:HH:MM[:SS]] | now | none  →  ms | null | NaN (ошибка)
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
        // отсекаем 31.02, 25:99 и т.п. (Date молча переносит)
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

      // задача по id (regex_15) или имени файла (ex15), без учёта регистра
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
        console.log("%cGRID::RUNNER CLI", CLI_STYLE.h);
        L("help", "показать эту справку");
        L(
          "edit <task> lastSolved <date>",
          "поставить дату последнего решения задачи (<task> — id или файл: regex_15, ex15).\n  <date> = DD.MM.YYYY[:HH:MM[:SS]] | now | none (сбросить в «не решалась»)",
          [
            "edit`regex_15 lastSolved 01.10.2026:14:26:00`",
            "edit`regex_15 lastSolved 01.10.2026`   // время необязательно → 00:00:00",
            'edit("ex15", "lastSolved", "now")',
            'edit("regex_15 lastSolved none")',
          ],
        );
        console.log(
          "%cКавычки/бэктики нужны: консоль не парсит голое `edit regex_15 ...` как JS. Голое `help` работает.",
          CLI_STYLE.dim,
        );
      }

      const CLI_EDIT_FIELDS = {
        lastsolved(task, cat, dateStr) {
          const ts = cliParseDate(dateStr);
          if (Number.isNaN(ts))
            return cliErr(
              `не разобрал дату «${dateStr}». Формат: DD.MM.YYYY[:HH:MM[:SS]] | now | none`,
            );
          if (ts != null && ts > Date.now())
            return cliErr("дата в будущем — lastSolved не может быть позже «сейчас»");
          const key = `${cat.id}/${task.id}`;
          const prev = walletSetLastSolved(key, ts);
          if (_vsCat && view === "category") renderRows(); // обновить шкалы
          console.log(
            `%c✓ ${key} lastSolved: ${cliFmtDate(prev)} → ${cliFmtDate(ts)}`,
            CLI_STYLE.ok,
          );
        },
      };

      function cliEdit(line) {
        const m = line.trim().match(/^(\S+)\s+(\S+)\s+([\s\S]+)$/);
        if (!m)
          return cliErr(
            "формат: edit <task> lastSolved <date>  (см. help)",
          );
        const [, name, field, value] = m;
        const handler = CLI_EDIT_FIELDS[field.toLowerCase()];
        if (!handler)
          return cliErr(
            `неизвестное поле «${field}». Доступно: lastSolved`,
          );
        const hits = cliFindTask(name);
        if (!hits.length)
          return cliErr(
            `задача «${name}» не найдена (каталог мог ещё не загрузиться — повтори через пару секунд)`,
          );
        if (hits.length > 1)
          return cliErr(
            `«${name}» неоднозначно: ${hits.map((h) => h.cat.id + "/" + h.task.id).join(", ")}`,
          );
        handler(hits[0].task, hits[0].cat, value);
      }

      Object.defineProperty(window, "help", {
        configurable: true,
        get() {
          cliHelp();
        },
      });
      window.edit = function (first, ...rest) {
        const line =
          Array.isArray(first) && first.raw
            ? String.raw({ raw: first }, ...rest)
            : [first, ...rest].join(" ");
        cliEdit(line);
      };

      console.log("%cGRID::RUNNER CLI — введи help", CLI_STYLE.h);
