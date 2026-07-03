'use strict';

/**
 * PlantCare — точка входа приложения.
 *
 * Пока это каркас: приложение состоит из трёх вкладок (Справочник,
 * Мои растения, Избранное), между которыми переключается навигация.
 * Данные о растениях и логика ухода появятся в следующих коммитах.
 */

// Имена вкладок совпадают с data-tab у кнопок и id секций (tab-<name>).
const TABS = ['catalog', 'my-plants', 'favorites'];

/**
 * Показывает выбранную вкладку и подсвечивает её кнопку в навигации,
 * остальные — прячет.
 * @param {string} tabName
 */
function switchTab(tabName) {
  TABS.forEach((name) => {
    const section = document.getElementById(`tab-${name}`);
    const button = document.querySelector(`.nav__btn[data-tab="${name}"]`);
    const isActive = name === tabName;

    section.hidden = !isActive;
    button.classList.toggle('nav__btn--active', isActive);
  });
}

/** Навешивает обработчики на кнопки навигации и открывает стартовую вкладку. */
function initNavigation() {
  document.querySelectorAll('.nav__btn[data-tab]').forEach((button) => {
    button.addEventListener('click', () => switchTab(button.dataset.tab));
  });

  switchTab('catalog'); // при загрузке показываем справочник
}

/** Загружает справочник и отрисовывает карточки; при ошибке показывает текст. */
async function initCatalog() {
  const container = document.getElementById('catalog-list');
  try {
    const plants = await loadPlants();
    renderCatalog(plants);
  } catch (error) {
    container.innerHTML = `<p class="placeholder">${error.message}</p>`;
  }
}

/**
 * Настраивает открытие/закрытие детальной карточки растения:
 *  - клик по карточке справочника открывает модалку (через делегирование);
 *  - клик по крестику или по затемнённому фону, а также Escape — закрывают её.
 */
function initPlantDetails() {
  // Делегирование: один обработчик на весь список вместо обработчика на каждой карточке.
  document.getElementById('catalog-list').addEventListener('click', (event) => {
    const card = event.target.closest('.card');
    if (card) {
      openPlantDetails(card.dataset.plantId);
    }
  });

  // Закрытие по элементам с атрибутом data-close (крестик и фон).
  document.getElementById('plant-modal').addEventListener('click', (event) => {
    if (event.target.hasAttribute('data-close')) {
      closePlantDetails();
    }
  });

  // Закрытие по клавише Escape.
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closePlantDetails();
    }
  });
}

// Ждём построения DOM, затем запускаем приложение.
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initCatalog();
  initPlantDetails();
});
