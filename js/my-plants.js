'use strict';

/**
 * Вкладка «Мои растения» — личная коллекция пользователя.
 *
 * Здесь и отрисовка списка, и форма добавления/редактирования. Данные храним
 * в LocalStorage через функции getMyPlants/addMyPlant/updateMyPlant/removeMyPlant
 * из storage.js. Каждая запись ссылается на растение справочника через plantId.
 */

/** Возвращает отображаемое имя: своё название либо название из справочника. */
function myPlantDisplayName(item) {
  const plant = getPlantById(item.plantId);
  return item.customName || (plant ? plant.name : 'Растение');
}

/** Строит карточку одного растения из личной коллекции. */
function createMyPlantCard(item) {
  const plant = getPlantById(item.plantId);
  const emoji = plant ? plant.emoji : '🪴';
  const notesRow = item.notes
    ? `<p class="myplant__notes">📝 ${item.notes}</p>`
    : '';
  const status = getWateringStatus(item);

  const card = document.createElement('article');
  card.className = 'myplant';
  card.innerHTML = `
    <div class="myplant__emoji">${emoji}</div>
    <div class="myplant__info">
      <h3 class="myplant__name">${myPlantDisplayName(item)}</h3>
      <p class="myplant__meta">
        💧 полив каждые ${item.wateringIntervalDays} дн. ·
        добавлено ${formatDate(item.addedDate)}
      </p>
      <p class="myplant__status ${status.className}">${status.label}</p>
      <button class="btn btn--water" data-water="${item.id}">💧 Полил</button>
      ${notesRow}
    </div>
    <div class="myplant__actions">
      <button class="icon-btn" data-edit="${item.id}" title="Редактировать">✏️</button>
      <button class="icon-btn" data-delete="${item.id}" title="Удалить">🗑️</button>
    </div>
  `;
  return card;
}

/** Перерисовывает вкладку «Мои растения» (список + баннер напоминаний). */
function renderMyPlants() {
  renderRemindersBanner();
  updateCareBadge();

  const container = document.getElementById('my-plants-list');
  const items = getMyPlants();

  if (items.length === 0) {
    container.innerHTML =
      '<p class="placeholder">В вашей коллекции пока пусто.<br>' +
      'Откройте карточку растения и нажмите «В мои растения».</p>';
    return;
  }

  const list = document.createElement('div');
  list.className = 'myplant-list';
  items.forEach((item) => list.appendChild(createMyPlantCard(item)));

  container.innerHTML = '';
  container.appendChild(list);
}

// --------------------------------------------------------------------------- //
//  Форма добавления / редактирования
// --------------------------------------------------------------------------- //

/** Заполняет «шапку» формы названием привязанного растения из справочника. */
function setFormLinkedPlant(plantId) {
  const plant = getPlantById(plantId);
  document.getElementById('myplant-form-linked').textContent =
    plant ? `${plant.emoji} ${plant.name}` : '';
}

/** Открывает форму ДОБАВЛЕНИЯ нового растения (привязанного к plantId). */
function openAddMyPlantForm(plantId) {
  const plant = getPlantById(plantId);
  if (!plant) {
    return;
  }
  const form = document.getElementById('myplant-form');
  form.reset();
  form.dataset.plantId = plantId;
  delete form.dataset.editId; // режим добавления

  document.getElementById('myplant-form-title').textContent = 'В мои растения';
  setFormLinkedPlant(plantId);
  // Значения по умолчанию.
  form.elements.addedDate.value = todayISO();
  form.elements.lastWateredDate.value = todayISO();
  form.elements.wateringIntervalDays.value = 7;

  document.getElementById('myplant-modal').hidden = false;
}

/** Открывает форму РЕДАКТИРОВАНИЯ записи коллекции по её id. */
function openEditMyPlantForm(itemId) {
  const item = getMyPlant(itemId);
  if (!item) {
    return;
  }
  const form = document.getElementById('myplant-form');
  form.reset();
  form.dataset.plantId = item.plantId;
  form.dataset.editId = item.id; // режим редактирования

  document.getElementById('myplant-form-title').textContent = 'Редактировать растение';
  setFormLinkedPlant(item.plantId);
  form.elements.customName.value = item.customName || '';
  form.elements.addedDate.value = item.addedDate;
  form.elements.lastWateredDate.value = item.lastWateredDate;
  form.elements.wateringIntervalDays.value = item.wateringIntervalDays;
  form.elements.notes.value = item.notes || '';

  document.getElementById('myplant-modal').hidden = false;
}

/** Закрывает форму. */
function closeMyPlantForm() {
  document.getElementById('myplant-modal').hidden = true;
}

/** Собирает данные формы и сохраняет (создаёт новую запись или обновляет). */
function submitMyPlantForm(event) {
  event.preventDefault();
  const form = event.target;

  const data = {
    plantId: form.dataset.plantId,
    customName: form.elements.customName.value.trim(),
    addedDate: form.elements.addedDate.value,
    lastWateredDate: form.elements.lastWateredDate.value,
    wateringIntervalDays: Number(form.elements.wateringIntervalDays.value),
    notes: form.elements.notes.value.trim(),
  };

  if (form.dataset.editId) {
    updateMyPlant(form.dataset.editId, data); // редактируем
  } else {
    addMyPlant(data); // добавляем
  }

  closeMyPlantForm();
  renderMyPlants();
}
