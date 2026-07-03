'use strict';

/**
 * Plantata — точка входа приложения.
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
  // Делегирование: один обработчик на общий контейнер ловит клики по карточкам
  // в любом разделе (Справочник, Избранное, Мои растения).
  document.querySelector('.container').addEventListener('click', (event) => {
    const card = event.target.closest('.card');
    if (card) {
      openPlantDetails(card.dataset.plantId);
    }
  });

  // Клики внутри модального окна.
  document.getElementById('plant-modal').addEventListener('click', (event) => {
    if (event.target.closest('[data-add-myplant]')) {
      const plantId = document.getElementById('plant-modal').dataset.plantId;
      closePlantDetails();
      openAddMyPlantForm(plantId);   // «В мои растения» — открываем форму
    } else if (event.target.closest('[data-fav-toggle]')) {
      toggleCurrentFavorite();       // нажали ⭐
    } else if (event.target.hasAttribute('data-close')) {
      closePlantDetails();           // нажали крестик или фон
    }
  });

  // Закрытие по клавише Escape.
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closePlantDetails();
    }
  });
}

/** Настраивает вкладку «Мои растения»: форму и действия над списком. */
function initMyPlants() {
  // Отправка формы добавления/редактирования.
  document.getElementById('myplant-form').addEventListener('submit', submitMyPlantForm);

  // Закрытие формы (крестик, фон, кнопка «Отмена») — элементы с data-close-form.
  document.getElementById('myplant-modal').addEventListener('click', (event) => {
    if (event.target.hasAttribute('data-close-form')) {
      closeMyPlantForm();
    }
  });

  // Кнопки «редактировать» / «удалить» в списке (делегирование).
  document.getElementById('my-plants-list').addEventListener('click', (event) => {
    const editBtn = event.target.closest('[data-edit]');
    const deleteBtn = event.target.closest('[data-delete]');
    if (editBtn) {
      openEditMyPlantForm(editBtn.dataset.edit);
    } else if (deleteBtn && confirm('Удалить растение из коллекции?')) {
      removeMyPlant(deleteBtn.dataset.delete);
      renderMyPlants();
    }
  });
}

// Ждём построения DOM, затем запускаем приложение.
document.addEventListener('DOMContentLoaded', async () => {
  initNavigation();
  initPlantDetails();
  initMyPlants();
  // Справочник грузится через fetch — дожидаемся, потом рисуем разделы,
  // которым нужны данные растений (Избранное и Мои растения).
  await initCatalog();
  renderFavorites();
  renderMyPlants();
});
