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

  // Текущее состояние избранного — чтобы показать правильную подпись кнопки ⭐.
  const fav = isFavorite(plant.id);

  // Картинка растения, если задана; иначе — эмодзи.
  const media = plant.image
    ? `<img class="details__img" src="${plant.image}" alt="${plant.name}">`
    : `<span class="details__emoji">${plant.emoji || '🪴'}</span>`;

  return `
    <div class="details__header">
      ${media}
      <h2 class="details__title">${plant.name}</h2>
    </div>
    <button class="fav-btn" data-fav-toggle aria-pressed="${fav}">
      ${fav ? '⭐ В избранном' : '☆ В избранное'}
    </button>
    <button class="fav-btn" data-add-myplant>➕ В мои растения</button>
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

  const modal = document.getElementById('plant-modal');
  modal.dataset.plantId = plantId; // запомним, какое растение открыто (для ⭐)
  document.getElementById('plant-modal-body').innerHTML = renderPlantDetails(plant);
  modal.hidden = false;
}

/** Закрывает модальное окно с деталями. */
function closePlantDetails() {
  document.getElementById('plant-modal').hidden = true;
}

/**
 * Переключает избранное для сейчас открытого растения и обновляет интерфейс:
 * подпись кнопки в модалке и содержимое вкладки «Избранное».
 */
function toggleCurrentFavorite() {
  const plantId = document.getElementById('plant-modal').dataset.plantId;
  if (!plantId) {
    return;
  }
  toggleFavorite(plantId);
  openPlantDetails(plantId); // перерисуем модалку — обновится подпись кнопки
  renderFavorites();         // обновим вкладку «Избранное»
  renderCatalog();           // обновим значок ⭐ на карточках справочника
}
