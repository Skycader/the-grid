Вот полная таблица:

---

## Сторонние библиотеки

| Библиотека                  | Версия | Назначение                                                                                             | Откуда                            |
| --------------------------- | ------ | ------------------------------------------------------------------------------------------------------ | --------------------------------- |
| **Monaco Editor**           | 0.44.0 | Редактор кода — тот самый движок VS Code. Подсветка синтаксиса, автодополнение, bracket matching, темы | `assets/monaco/` (CDN: jsdelivr)  |
| **Prettier** (standalone)   | 2.8.8  | Форматирование кода по Ctrl+S перед запуском тестов                                                    | `assets/prettier-standalone.js`   |
| **Prettier** (babel parser) | 2.8.8  | Парсер JS для Prettier — без него standalone не знает как разбирать код                                | `assets/prettier-parser-babel.js` |
| **JetBrains Mono**          | latest | Шрифт для всего UI и редактора. Моноширинный, создан специально для кода                               | `assets/fonts/` (Google Fonts)    |
| **Orbitron**                | latest | Шрифт для заголовков (GRID::RUNNER, названия категорий). Sci-fi / Tron-стиль                           | `assets/fonts/` (Google Fonts)    |

---

## Браузерные API (нулевые зависимости, встроено в браузер)

| API                    | Назначение                                                               |
| ---------------------- | ------------------------------------------------------------------------ |
| **Web Workers**        | Изолированный поток для запуска тестов — UI не зависает                  |
| **Web Audio API**      | Все звуки: клики, типинг, молнии, pass/fail. Без внешних звуковых файлов |
| **Canvas 2D API**      | Анимированный фон — Tron-грид, звёзды, молнии                            |
| **performance.now()**  | Замер времени выполнения тестов (мс)                                     |
| **performance.memory** | Замер памяти (только Chrome с флагом)                                    |
| **localStorage**       | Сохранение размера шрифта редактора                                      |
| **History API**        | Навигация (был роутинг, убрали)                                          |
| **Fullscreen API**     | Кнопка ⛶ FULLSCREEN                                                      |
| **Fetch API**          | Загрузка файлов задач (`.js`, `.spec.js`, `.sol.js`), иконок             |

---

## Тест-раннер

Написан с нуля прямо внутри WebWorker (~80 строк). Совместим с синтаксисом Jest:

```
describe / it / test / expect
.toBe .toEqual .toMatch .toContain .toHaveLength
.toBeTruthy .toBeFalsy .toBeNull .toBeUndefined
.toBeGreaterThan .toBeLessThan .toThrow
.not.*
```

Никакого Jest, Mocha, Vitest — всё самописное.

---

## Итог

Внешних зависимостей ровно **5** (2 шрифта + Monaco + Prettier×2). Всё остальное — браузерные API и самописный код. После запуска `download.sh` приложение работает полностью офлайн.
