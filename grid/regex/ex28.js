/**
 * Ex28
 * Write regex, that checks if password is strong enough
 * - has at least one upper case letter
 * - has at least one lowercase letter
 * - has at least 3 digits
 * - has special character
 * - has no whitespaces
 * - has length from 24 to 256 symbols
 *
 * Export ONE regex r. It is used as r.test(password), so it has no `g` and no `y` flag.
 *
 * Details:
 *   - letters are the Latin A-Z and a-z; digits are 0-9: any 3 of them, they need not stand together
 *   - a special character is any other visible ASCII symbol:
 *       ! " # $ % & ' ( ) * + , - . / : ; < = > ? @ [ \ ] ^ _ ` { | } ~
 *   - a space, a tab or a new line anywhere makes the password weak
 *   - the length counts every character; 24 and 256 are fine
 *   - the order of the characters does not matter
 *
 * Examples:
 *   "$MySup3erHard0Pass0wor0d"       →  true
 *   "MySuperHardPassword"            →  false     (no digits, no special character, shorter than 24)
 *   "$mysuperhardpassword"           →  false     (no upper case letter, no digits, shorter than 24)
 *   "$$$MMMoney"                     →  false     (no digits, shorter than 24)
 *   "$TooShort3000"                  →  false     (shorter than 24)
 *   "$SpaceBarsAre Forbidden"        →  false     (a space)
 */

module.exports = r;
