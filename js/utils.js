'use strict';

/** Небольшие утилиты, общие для разных модулей. */

/** Сегодняшняя дата в формате YYYY-MM-DD (по локальному времени пользователя). */
function todayISO() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/** Преобразует дату YYYY-MM-DD в читаемый вид ДД.ММ.ГГГГ. */
function formatDate(iso) {
  if (!iso) {
    return '';
  }
  const [year, month, day] = iso.split('-');
  return `${day}.${month}.${year}`;
}

/**
 * Прибавляет к дате (YYYY-MM-DD) заданное число дней и возвращает новую дату.
 * Считаем в UTC, чтобы результат не «съезжал» из-за часового пояса.
 */
function addDaysISO(iso, days) {
  const [year, month, day] = iso.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

/**
 * Возвращает число дней между двумя датами (toISO - fromISO).
 * Положительное — toISO позже, отрицательное — раньше.
 */
function daysBetweenISO(fromISO, toISO) {
  const MS_PER_DAY = 24 * 60 * 60 * 1000;
  const [fy, fm, fd] = fromISO.split('-').map(Number);
  const [ty, tm, td] = toISO.split('-').map(Number);
  const from = Date.UTC(fy, fm - 1, fd);
  const to = Date.UTC(ty, tm - 1, td);
  return Math.round((to - from) / MS_PER_DAY);
}

/** Генерирует уникальный id для записи личной коллекции. */
function generateId() {
  return 'mp_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}
