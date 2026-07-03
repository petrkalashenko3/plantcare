'use strict';

/**
 * Детальная карточка растения.
 *
 * По клику на карточку справочника показываем модальное окно со всеми
 * рекомендациями по уходу: освещение, полив, пересадка, ядовитость и
 * дополнительные особенности. Растение находим по id через getPlantById().
 */

/**
 * Собирает HTML-содержимое модального окна для одного растения.
 * @param {object} plant
 * @returns {string}
 */
function renderPlantDetails(plant) {
  // Значок ядовитости зависит от флага toxic (быстрее, чем разбирать текст).
  const toxicityIcon = plant.toxic ? '⚠️' : '✅';

  // Блок «особенности» показываем только если он заполнен.
  const featuresRow = plant.features
    ? `<div class="details__row">
         <dt>📝 Особенности</dt>
         <dd>${plant.features}</dd>
       </div>`
    : '';

  return `
    <div class="details__header">
      <span class="details__emoji">${plant.emoji || '🪴'}</span>
      <h2 class="details__title">${plant.name}</h2>
    </div>
    <dl class="details__list">
      <div class="details__row">
        <dt>☀️ Освещение</dt>
        <dd>${plant.light}</dd>
      </div>
      <div class="details__row">
        <dt>💧 Полив</dt>
        <dd>${plant.watering}</dd>
      </div>
      <div class="details__row">
        <dt>🪴 Пересадка</dt>
        <dd>${plant.repotting}</dd>
      </div>
      <div class="details__row">
        <dt>${toxicityIcon} Ядовитость</dt>
        <dd>${plant.toxicity}</dd>
      </div>
      ${featuresRow}
    </dl>
  `;
}

/**
 * Открывает модальное окно с деталями растения по его id.
 * @param {string} plantId
 */
function openPlantDetails(plantId) {
  const plant = getPlantById(plantId);
  if (!plant) {
    return; // на всякий случай: неизвестный id — просто ничего не делаем
  }

  document.getElementById('plant-modal-body').innerHTML = renderPlantDetails(plant);
  document.getElementById('plant-modal').hidden = false;
}

/** Закрывает модальное окно с деталями. */
function closePlantDetails() {
  document.getElementById('plant-modal').hidden = true;
}
