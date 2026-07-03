'use strict';

/** Небольшие утилиты, общие для разных модулей. */

/** Сегодняшняя дата в формате YYYY-MM-DD (для полей <input type="date">). */
function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

/** Преобразует дату YYYY-MM-DD в читаемый вид ДД.ММ.ГГГГ. */
function formatDate(iso) {
  if (!iso) {
    return '';
  }
  const [year, month, day] = iso.split('-');
  return `${day}.${month}.${year}`;
}

/** Генерирует уникальный id для записи личной коллекции. */
function generateId() {
  return 'mp_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}
