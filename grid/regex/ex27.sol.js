/**
 * Write regex to test if there is
 * 1) exactly 3 digits in a given string
 * 2) less than 3 digits in a given string
 * 3) 3 or more digits in a given string
 */

const r1 = /^(?:\D*\d){3}\D*$/;
const r2 = /^(?:\D*\d){0,2}\D*$/;
const r3 = /^(?:\D*\d){3,}\D*$/;

/**
 * Сложность: 4 = Знания 3 + Жирность 1
 * Знания 3 — незахватывающая группа (?:...), якоря ^$; backreference нет,
 *            т.к. группа (?:...) ничего не захватывает
 * Жирность 1 — до 19 символов на каждый паттерн
 */
module.exports = [r1, r2, r3];
