'use strict';

/**
 * Модуль справочника растений.
 *
 * Отвечает за загрузку данных из data/plants.json и отрисовку сетки карточек
 * в разделе «Справочник». Загруженный список кэшируется, чтобы не запрашивать
 * файл повторно и чтобы другие части приложения (личный список, детали) могли
 * находить растение по id.
 */

// Кэш загруженного справочника.
let plantsCache = [];

/**
 * Загружает список растений из JSON-файла. Повторные вызовы отдают кэш.
 * @returns {Promise<Array>} массив растений
 */
async function loadPlants() {
  if (plantsCache.length > 0) {
    return plantsCache;
  }
  const response = await fetch('data/plants.json');
  if (!response.ok) {
    throw new Error(`Не удалось загрузить справочник (код ${response.status})`);
  }
  plantsCache = await response.json();
  return plantsCache;
}

/**
 * Ищет растение в справочнике по его id.
 * Пригодится для деталей карточки и для личного списка.
 * @param {string} id
 * @returns {object|null}
 */
function getPlantById(id) {
  return plantsCache.find((plant) => plant.id === id) || null;
}

/**
 * Создаёт DOM-элемент карточки одного растения для сетки справочника.
 * @param {object} plant
 * @returns {HTMLElement}
 */
function createPlantCard(plant) {
  const card = document.createElement('article');
  card.className = 'card';
  card.dataset.plantId = plant.id; // чтобы потом по клику знать, какое растение

  card.innerHTML = `
    <div class="card__emoji">${plant.emoji || '🪴'}</div>
    <h3 class="card__title">${plant.name}</h3>
    <p class="card__hint">☀️ ${plant.light}</p>
  `;
  return card;
}

/**
 * Отрисовывает весь справочник в контейнер вкладки «Справочник».
 * @param {Array} plants
 */
function renderCatalog(plants) {
  const container = document.getElementById('catalog-list');
  container.innerHTML = '';

  const grid = document.createElement('div');
  grid.className = 'cards';
  plants.forEach((plant) => grid.appendChild(createPlantCard(plant)));

  container.appendChild(grid);
}
