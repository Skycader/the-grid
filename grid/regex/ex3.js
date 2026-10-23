/*
 * Ex3
 * Replace all possible Google, Goooogle, goooooooooooogle with Yandex.
 *
 * The name is a G, then two or more o, then "gle". The case does not matter
 * (google, GOOGLE, GoOgLe). Everything else stays untouched.
 *
 * Examples:
 *   "Google Gooooooogle Gogle goooooooooooogle Yandex Googl"  →  "Yandex Yandex Gogle Yandex Yandex Googl"
 *   "Search in GOOGLE, not in Bing"                           →  "Search in Yandex, not in Bing"
 *   "google.com"                                              →  "Yandex.com"
 *   "Gogle Go gle Googl"                                      →  "Gogle Go gle Googl"     (one o, a gap, no "e")
 *   ""                                                        →  ""
 */

const f = txt => {
  const r = /sample/;
  return;
};

module.exports = f;
