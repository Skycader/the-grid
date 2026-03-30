/**
 * Count SPECIAL* ip addresses in the given text.
 * *SPECIAL IP ADDRESS LOOKS LIKE: 192.168.92.102...55.34.204
 * IN SUMMARY, IT CAN BE ANY LENGTH FROM 4 UNITS TO INFINITY.
 * TASK: FIND THEM ALL.
 *  */

/**
 * 03 march 2025 quick solution
 */
const f = (text) => {
  const r = /^(\d{1,3}\.){3,}\d{1,3}$/gm;
  return text.match(r)?.length || 0;
};

/** 23 september 2024 10:26 took me 30 seconds ti write it down */
const f = (text) => {
  const r = /^(\d{1,3}\.){3,}\d{1,3}$/gm;
  return text.match(r)?.length || 0;
};

const f = (text) => {
  const r = /^(\d{1,3}\.){3,}\d{1,3}$/gm;
  return text.match(r)?.length || 0;
};

const r = /^(\d{1,3}\.){3,}\d{1,3}$/gm;
const f = (text) => {
  return text.match(r)?.length || 0;
};

module.exports = f;
