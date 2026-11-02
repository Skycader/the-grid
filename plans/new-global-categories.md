# New global categories of exercises

Ideas that are not built yet. Written down as they were said; "Open" lists what has to be decided
before the work starts. Move an item to `changelog/` when it ships.

Today there are two global categories: `algo` and `regex` (`grid/`, `config/`).

---

## 1. HTML: knowledge of the DOM functions

A global category of exercises on the DOM API: finding, creating, changing and removing nodes,
attributes, classes, events, traversal.

Examples of tasks:
- `querySelector` / `querySelectorAll` / `closest` / `matches`: pick the right element by a selector;
- build a list from an array with `createElement` / `append` / `DocumentFragment`;
- `classList`, `dataset`, `setAttribute`: toggle and read state;
- traversal: `parentElement`, `children`, `nextElementSibling`;
- events: delegation, `addEventListener`, `stopPropagation`, `preventDefault`.

Open:
- How a task is checked: the runner is a worker (`js/worker-client.js`), which has no DOM. Needs a
  DOM in the test (an iframe or `DOMParser` / a small DOM implementation) and a spec format for it.
- Whether the task shows the rendered HTML next to the editor.

---

## 2. TypeScript: knowledge of the types

A global category on the type system. For example: write a type so that the given set of
assertions compiles (and the wrong ones do not).

Examples of tasks:
- utility types by hand: `Partial`, `Pick`, `Omit`, `ReturnType`;
- generics and constraints, `keyof`, `typeof`, indexed access;
- conditional types, `infer`, mapped types, template literal types;
- narrowing: type guards, discriminated unions, `never` and exhaustive checks.

Open:
- How a task is checked: Monaco already ships the TypeScript worker (`assets/monaco/vs/language/typescript`),
  so the check can be "no diagnostics" for the solution + "expected errors" for the negative cases.
- Whether the type tasks are run at all or only compiled (no output to compare).

---

## 3. Node.js: for example the file API

A global category on the Node.js standard library. For example the file API: `fs`, `path`, streams.

Examples of tasks:
- read / write / append a file, `fs.promises`;
- `path.join` / `resolve` / `parse`;
- list a directory recursively, filter by extension;
- streams: `createReadStream`, `pipeline`, line-by-line reading;
- `process.argv`, `process.env`, `EventEmitter`.

Open:
- Where it runs: the browser has no Node. Needs an in-memory fake of `fs` / `path` injected into the
  worker (a virtual file system per test) instead of a real one.
- The scope of the faked API (what is in and what is out).
