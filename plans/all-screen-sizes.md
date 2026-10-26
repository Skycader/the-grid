# Optimize for all screen resolutions

Ideas that are not built yet. Written down as they were said; "Open" lists what has to be decided
before the work starts. Move an item to `changelog/` when it ships.

---

## 1. Every screen size works and looks right

Wanted: the whole app is comfortable on **every** resolution: a phone in portrait and landscape, a
tablet, a laptop, a wide and a 4K monitor, a small window of a desktop browser; no cut-off text, no
buttons pushed out, no tiny click targets, no empty acres on a big screen.

Already there:
- `<meta name="viewport" content="width=device-width, initial-scale=1.0">` in `index.html`.
- Four `@media (max-width ...)` blocks in `assets/styles.css`: `640px` (the search keycap hides; the
  transactions table drops its head and goes to two lines), `680px` (the task bar wraps into two
  rows, smaller wallet and need meter, the MEM field hides), `400px` (two columns of the catalog
  grid, smaller tabs). Nothing for a wide screen and nothing by the height of the window.
- Some parts are already fluid: the home row of buttons wraps nowhere but shrinks the search field;
  the settings row wraps its slider to a second line; the profile window is as tall as its tallest
  tab; modals have `max-width` and `width: 90%`.

Seen while working (a window of 490 px, a phone width):
- The home row (search, RANDOM, the need pool, HARVEST with the balance, PROFILE, TRANSACTIONS,
  SETTINGS) is **seven items in one line**: the search field is squeezed to the magnifier only; the
  ghost typist and the `F` keycap have no room. It needs a rule: wrap the buttons under the search
  field, or collapse some of them (an overflow menu), below a width.
- Pools, keycaps, rank patches, `+ / -` steppers are 8-38 px: the touch targets are small (the
  rank patch got an invisible area, the rest did not); the hover menus (RANDOM, HARVEST filters, the
  sort, the rank tooltip) are **hover-only**: a touch screen has no hover.
- Fixed sizes in px for text (`0.6rem`-`0.8rem`) and for the modals (`600px` settings, `820px`
  transactions) are not scaled by the screen.
- The editor view (Monaco + the result panel + the task bar with the tabs, the font size, STRICT,
  MEM, RUN and the wallet) is the most crowded screen; on a phone the code editor is hardly usable.

Not there:
- A list of the target sizes and a way to check them (a table of widths x heights to look at, or a
  Playwright run that takes screenshots at each size).

Open:
- Which sizes are the target: the phone (360-430 px wide), a tablet (768-1024), a laptop (1280-1536),
  a monitor (1920-2560), a 4K (3840)? Is the phone a full target or "it should not break"?
- Touch: hover menus need a tap version (a tap opens, a tap outside closes); the minimum size of a
  target (44 px by the guides), keyboard and pointer both.
- The layout of the home row on a narrow screen (wrap / a second row / a menu).
- The editor on a phone: the code and the result as two screens with a switch, the task bar
  collapsed into a menu.
- A wide screen: a max width of the content so the lists do not stretch over 2000 px; a bigger base
  font (`rem`) on a big monitor.
- The height: a low window (a phone in landscape, 400-500 px tall) and the bottom sheet of the
  category (`cat-sheet`), the modals taller than the window (they must scroll inside, not outside).
- The rest of the plans that touch the layout (the notes of a task, the income rate) should be
  designed for the narrow screen from the start.
