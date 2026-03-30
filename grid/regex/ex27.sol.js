/**
 * Write regex to test if there is
 * 1) exactly 3 digits in a given string
 * 2) less than 3 digits in a given string
 * 3) 3 or more digits in a given string
 */

const r1 = /^(?:\D*\d){3}\D*$/;
const r2 = /^(?:\D*\d){0,2}\D*$/;
const r3 = /^(?:\D*\d){3,}\D*$/;
module.exports = [r1, r2, r3];
