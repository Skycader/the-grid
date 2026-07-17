/**
 * Given [key: string]: string[] object,
 * render it into array of [key]: string
 * Example:
 * {
 * username: ['cannot be empty, minimal length is 3'],
 * password: ['must contain letters']
 * }
 */

const f = (obj) =>
  Object.entries(obj).flatMap(([key, msgs]) => msgs.map((m) => `${key} ${m}`));
