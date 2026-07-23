/*
 * Find all lol words like lel lil lal and change them to l*l but don't change lol itself
 * Export r
 * NOTE: use exclude marker for regexp
 */

const r = /\bl[^o]l\b/gi;

/**
 * Сложность: 3 — якорь \b; [^o] — обычный класс (тир 2), якорь выше него
 */
module.exports = r;
