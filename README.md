# Gym Tracker — APOLLON

Персональний журнал тренувань у браузері: план на 4 дні (груди, спина, плечі, руки), запис підходів, прогрес і таймер відпочинку. Встановлюється на телефон як застосунок і працює без інтернету.

**Відкрити:** https://ionblak.github.io/gym-tracker/

## Можливості

- План A / B / C / D з технікою, замінами та фото «початкове → кінцеве положення» для кожної вправи.
- Запис ваги та повторень, виправлення й видалення підходів, додаткові підходи.
- Підказка «минулого разу» і порада, коли додавати вагу.
- Графіки прогресу: максимальна вага, розрахунковий 1ПМ, об’єм.
- Таймер відпочинку зі звуковим сигналом.
- Експорт та імпорт резервної копії (JSON).

Усі дані зберігаються лише в браузері на пристрої — на сервер нічого не відправляється.

## Встановлення на iPhone

1. Відкрий посилання вище в **Safari**.
2. «Поділитися» → «На початковий екран».
3. Запускай з іконки: так застосунок працює офлайн, а iOS не видаляє його дані автоматично.

> На iPhone дані Safari і застосунку з початкового екрана зберігаються **окремо**. Щоб перенести історію, зроби «Експортувати JSON» там, де вона є, і «Імпортувати» в застосунку.

## Структура

| Файл | Що це |
|---|---|
| `index.html` | Увесь застосунок: розмітка, стилі, логіка |
| `sw.js` | Service worker — офлайн-кеш |
| `manifest.json` | Опис PWA: назва, іконки, кольори |
| `icons/` | Іконки; `icon.svg` — джерело для PNG |
| `photos/` | Фото вправ: `<id вправи>-1.jpg` — початкове положення, `-2.jpg` — кінцеве |

## Оновлення

- **Зміни в `index.html`** телефон підхоплює сам при наступному відкритті з інтернетом.
- **Додав чи змінив фото або іконки** — збільш `STATIC_CACHE_VERSION` у `sw.js`; нові фото також додай у `EXERCISE_IDS`.
- **Нова вправа:** додай її в `plan` в `index.html` з новим `id` і поклади фото `photos/<id>-1.jpg`, `photos/<id>-2.jpg`. Не змінюй `id` існуючих вправ — за ним зберігається історія.

### Іконки

```bash
cd icons
rsvg-convert -w 512 -h 512 icon.svg -o icon-512.png
rsvg-convert -w 192 -h 192 icon.svg -o icon-192.png
rsvg-convert -w 180 -h 180 icon.svg -o apple-touch-icon.png
cp icon-512.png icon-maskable-512.png
```

## Локальний запуск

Service worker працює лише через `https://` або `localhost`, тому відкривай не файл, а локальний сервер:

```bash
npx serve .
```

## Фото

Фото вправ — з [Free Exercise DB](https://github.com/yuhonas/free-exercise-db) (Unlicense, суспільне надбання).

| Вправа (`id`) | Фото з бази |
|---|---|
| `chest-press` | Leverage_Chest_Press |
| `lat-pulldown` | Wide-Grip_Lat_Pulldown |
| `seated-cable-row` | Seated_Cable_Rows |
| `pec-deck` | Butterfly |
| `machine-curl` | Machine_Preacher_Curls |
| `triceps-pushdown` | Triceps_Pushdown |
| `neutral-lat-pulldown` | V-Bar_Pulldown |
| `chest-supported-row` | Lying_T-Bar_Row |
| `shoulder-press` | Machine_Shoulder_Military_Press |
| `lateral-raise` | Standing_Low-Pulley_Deltoid_Raise |
| `reverse-pec-deck` | Reverse_Machine_Flyes |
| `cable-curl` | Standing_Biceps_Cable_Curl |
| `incline-chest-press` | Leverage_Incline_Chest_Press |
| `preacher-curl` | Machine_Preacher_Curls |
| `triceps-extension` | Cable_Rope_Overhead_Triceps_Extension |
| `face-pull` | Face_Pull |
| `rope-pushdown` | Triceps_Pushdown_-_Rope_Attachment |
| `hammer-curl` | Cable_Hammer_Curls_-_Rope_Attachment |
