'use strict';

/**
 * Модуль хранения данных в браузере (LocalStorage).
 *
 * LocalStorage хранит только строки, поэтому массивы/объекты мы сохраняем
 * через JSON.stringify, а читаем через JSON.parse. Здесь собраны общие
 * помощники чтения/записи и функции для работы с избранным.
 *
 * Ключи храним с префиксом "plantcare:", чтобы не пересечься с чужими данными
 * в том же домене.
 */

const STORAGE_KEYS = {
  favorites: 'plantcare:favorites',
  myPlants: 'plantcare:my-plants',
};

/**
 * Читает значение по ключу и разбирает его из JSON.
 * @param {string} key
 * @param {*} fallback значение по умолчанию, если ключа нет или данные битые
 * @returns {*}
 */
function readJson(key, fallback) {
  const raw = localStorage.getItem(key);
  if (raw === null) {
    return fallback;
  }
  try {
    return JSON.parse(raw);
  } catch (error) {
    // Данные повреждены — не роняем приложение, возвращаем значение по умолчанию.
    return fallback;
  }
}

/**
 * Записывает значение по ключу в формате JSON.
 * @param {string} key
 * @param {*} value
 */
function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// --------------------------------------------------------------------------- //
//  Избранное — просто массив id растений
// --------------------------------------------------------------------------- //

/** @returns {string[]} массив id избранных растений */
function getFavorites() {
  return readJson(STORAGE_KEYS.favorites, []);
}

/**
 * @param {string} plantId
 * @returns {boolean} находится ли растение в избранном
 */
function isFavorite(plantId) {
  return getFavorites().includes(plantId);
}

/**
 * Переключает избранное для растения.
 * @param {string} plantId
 * @returns {boolean} новое состояние (true — теперь в избранном)
 */
function toggleFavorite(plantId) {
  const favorites = getFavorites();
  const index = favorites.indexOf(plantId);

  if (index === -1) {
    favorites.push(plantId);       // не было — добавляем
  } else {
    favorites.splice(index, 1);    // было — убираем
  }

  writeJson(STORAGE_KEYS.favorites, favorites);
  return index === -1;
}

// --------------------------------------------------------------------------- //
//  Личная коллекция «Мои растения»
// --------------------------------------------------------------------------- //
//
//  Одна запись коллекции — это объект:
//    id                    — уникальный код записи
//    plantId               — ссылка на растение из справочника
//    customName            — своё название (необязательно)
//    addedDate             — дата добавления (YYYY-MM-DD)
//    lastWateredDate       — дата последнего полива (YYYY-MM-DD)
//    wateringIntervalDays  — как часто поливать, в днях
//    notes                 — заметки

/** @returns {object[]} записи личной коллекции */
function getMyPlants() {
  return readJson(STORAGE_KEYS.myPlants, []);
}

/**
 * @param {string} id
 * @returns {object|null}
 */
function getMyPlant(id) {
  return getMyPlants().find((item) => item.id === id) || null;
}

/**
 * Добавляет растение в коллекцию.
 * @param {object} data поля записи (plantId, customName, addedDate, ...)
 * @returns {object} созданная запись с присвоенным id
 */
function addMyPlant(data) {
  const items = getMyPlants();
  const item = { id: generateId(), ...data };
  items.push(item);
  writeJson(STORAGE_KEYS.myPlants, items);
  return item;
}

/**
 * Обновляет запись коллекции по id.
 * @param {string} id
 * @param {object} data новые значения полей
 * @returns {object|null} обновлённая запись или null, если не нашли
 */
function updateMyPlant(id, data) {
  const items = getMyPlants();
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) {
    return null;
  }
  // Раскладываем старые поля, поверх — новые; id перезаписать не даём.
  items[index] = { ...items[index], ...data, id };
  writeJson(STORAGE_KEYS.myPlants, items);
  return items[index];
}

/** Удаляет запись коллекции по id. */
function removeMyPlant(id) {
  const items = getMyPlants().filter((item) => item.id !== id);
  writeJson(STORAGE_KEYS.myPlants, items);
}
