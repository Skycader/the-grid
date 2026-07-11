      // ═══════════ MONACO — DARK SOLARIZED ═══════════
      require.config({ paths: { vs: "assets/monaco/vs" } });

      // ── Editor bracket-match palette (change these to restyle paired brackets) ──
      const BRACKET_BG = "rgba(0,160,200,.18)"; // match-highlight fill
      const BRACKET_BORDER = "#0099bb"; // match-highlight border
      // Bracket pair colorization levels (foreground on the bracket chars themselves)
      const BRACKET_L1 = "#00aacc"; // level 1 — cyan
      const BRACKET_L2 = "#2aa198"; // level 2 — teal
      const BRACKET_L3 = "#268bd2"; // level 3 — blue
      const BRACKET_L4 = "#6c71c4"; // level 4 — indigo (solarized violet)
      const BRACKET_L5 = "#00aacc"; // level 5 — repeat cycle
      const BRACKET_L6 = "#2aa198"; // level 6 — repeat cycle

      require(["vs/editor/editor.main"], function () {
        monaco.editor.defineTheme("solarized-dark", {
          base: "vs-dark",
          inherit: false,
          rules: [
            { token: "", foreground: "839496", background: "002b36" },
            { token: "keyword", foreground: "859900", fontStyle: "bold" },
            { token: "keyword.operator", foreground: "657b83" },
            { token: "string", foreground: "2aa198" },
            { token: "string.escape", foreground: "cb4b16" },
            { token: "comment", foreground: "586e75", fontStyle: "italic" },
            { token: "number", foreground: "d33682" },
            { token: "regexp", foreground: "cb4b16" },
            { token: "regexp.escape", foreground: "dc322f" },
            { token: "delimiter", foreground: "586e75" },
            { token: "delimiter.curly", foreground: "657b83" },
            { token: "delimiter.paren", foreground: "657b83" },
            { token: "delimiter.square", foreground: "657b83" },
            { token: "type", foreground: "268bd2" },
            { token: "variable", foreground: "839496" },
            { token: "identifier", foreground: "268bd2" },
            { token: "constant", foreground: "b58900" },
            { token: "function", foreground: "268bd2" },
          ],
          colors: {
            "editor.background": "#002b36",
            "editor.foreground": "#839496",
            "editorCursor.foreground": "#2aa198",
            "editor.lineHighlightBackground": "#073642",
            "editor.selectionBackground": "#1a4a5e",
            "editor.inactiveSelectionBackground": "#0d3040",
            "editorLineNumber.foreground": "#405c64",
            "editorLineNumber.activeForeground": "#839496",
            "editorGutter.background": "#002028",
            "editorIndentGuide.background": "#073642",
            "editorIndentGuide.activeBackground": "#586e75",
            "editorWidget.background": "#002b36",
            "editorWidget.border": "#073642",
            "editorSuggestWidget.background": "#002b36",
            "editorSuggestWidget.border": "#073642",
            "editorSuggestWidget.selectedBackground": "#073642",
            "editorSuggestWidget.foreground": "#839496",
            "editorSuggestWidget.highlightForeground": "#2aa198",
            "list.hoverBackground": "#073642",
            "list.activeSelectionBackground": "#073642",
            "list.activeSelectionForeground": "#93a1a1",
            "scrollbarSlider.background": "rgba(42,161,152,.22)",
            "scrollbarSlider.hoverBackground": "rgba(42,161,152,.42)",
            "scrollbarSlider.activeBackground": "rgba(42,161,152,.62)",
            "editor.findMatchBackground": "rgba(181,137,0,.3)",
            "editor.findMatchHighlightBackground": "rgba(181,137,0,.15)",
            // "editorBracketMatch.background": BRACKET_BG,
            // "editorBracketMatch.border": BRACKET_BORDER,
            // Bracket pair colorization — overrides the default red/green/blue cycle
            // Bracket pair colorization foreground (the bracket characters)
            // "editorBracketHighlight.foreground1": BRACKET_L1,
            // "editorBracketHighlight.foreground2": BRACKET_L2,
            // "editorBracketHighlight.foreground3": BRACKET_L3,
            // "editorBracketHighlight.foreground4": BRACKET_L4,
            // "editorBracketHighlight.foreground5": BRACKET_L5,
            // "editorBracketHighlight.foreground6": BRACKET_L6,
            // "editorBracketHighlight.unexpectedBracket.foreground": "#dc322f",
            // Bracket pair colorization background (the box behind each bracket char)
            // "editorBracketHighlight.background1": "#00000000",
            // "editorBracketHighlight.background2": "#00000000",
            // "editorBracketHighlight.background3": "#00000000",
            // "editorBracketHighlight.background4": "#00000000",
            // "editorBracketHighlight.background5": "#00000000",
            // "editorBracketHighlight.background6": "#00000000",
          },
        });
        editor = monaco.editor.create(document.getElementById("monaco"), {
          value: "",
          language: "javascript",
          theme: "solarized-dark",
          fontSize: 14,
          fontFamily: '"JetBrains Mono",monospace',
          fontWeight: "bold",
          fontLigatures: true,
          lineNumbers: "on",
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          renderWhitespace: "selection",
          cursorBlinking: "smooth",
          cursorStyle: "line",
          cursorWidth: 2,
          smoothScrolling: true,
          padding: { top: 13, bottom: 13 },
          wordWrap: "on",
          contextmenu: true,
          fixedOverflowWidgets: true,
          scrollbar: { verticalScrollbarSize: 3, horizontalScrollbarSize: 3 },
          bracketPairColorization: { enabled: false },
        });
        editor.onDidChangeModelContent(() => {
          if (!_editorLoading && curTab === "ed" && curTask) {
            solCode = editor.getValue();
            CODE[`${curCat().id}/${curTask.id}`] = solCode;
          }
          if (!_editorLoading) playType();
        });
        if (curTask && !_editorLoading) {
          editor.setValue(solCode);
          editor.updateOptions({ readOnly: false });
        }
        // Init font size + strict UI
        applyFZ();
        updateStrictUI();
        // Ctrl+Wheel to resize font
        document.getElementById("monaco").addEventListener(
          "wheel",
          (e) => {
            if (!(e.ctrlKey || e.metaKey)) return;
            e.preventDefault();
            e.stopPropagation();
            changeFZ(e.deltaY < 0 ? 1 : -1);
          },
          { passive: false },
        );
      });

      // ═══════════ PRETTIER ═══════════
      function fmt(code) {
        try {
          if (typeof prettier === "undefined")
            return { ok: false, err: "prettier not loaded" };
          const plugins = [];
          if (typeof prettierPlugins !== "undefined" && prettierPlugins.babel)
            plugins.push(prettierPlugins.babel);
          if (!plugins.length)
            return { ok: false, err: "babel plugin missing" };
          return {
            ok: true,
            code: prettier.format(code, {
              parser: "babel",
              plugins,
              printWidth: 80,
              tabWidth: 2,
              singleQuote: true,
              trailingComma: "es5",
              semi: true,
            }),
          };
        } catch (e) {
          return { ok: false, err: e.message };
        }
      }

