'use strict';

/**
 * Вкладка «Избранное».
 *
 * Показывает карточки растений, отмеченных ⭐. Список id берём из хранилища
 * (getFavorites), сами данные растений — из справочника (getPlantById), а
 * карточку строим тем же createPlantCard, что и в справочнике (переиспользуем
 * код, не дублируем).
 */

/** Перерисовывает вкладку «Избранное» по сохранённым id. */
function renderFavorites() {
  const container = document.getElementById('favorites-list');
  const favoriteIds = getFavorites();

  // Пустое состояние — подсказываем, как добавить.
  if (favoriteIds.length === 0) {
    container.innerHTML =
      '<p class="placeholder">Пока нет избранных растений.<br>' +
      'Откройте карточку растения и нажмите ⭐</p>';
    return;
  }

  const grid = document.createElement('div');
  grid.className = 'cards';

  favoriteIds.forEach((id) => {
    const plant = getPlantById(id);
    if (plant) {
      grid.appendChild(createPlantCard(plant));
    }
  });

  container.innerHTML = '';
  container.appendChild(grid);
}
