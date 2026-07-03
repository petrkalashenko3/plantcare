'use strict';

/**
 * Напоминания о поливе.
 *
 * По дате последнего полива и интервалу считаем, когда растение нужно полить
 * снова. Показываем статус на карточке, сводку-баннер сверху и (по желанию)
 * браузерное уведомление. Кнопка «Полил» сбрасывает отсчёт на сегодня.
 */

/**
 * Считает статус полива для одной записи коллекции.
 * @param {object} item
 * @returns {{state: string, daysLeft: number, className: string, label: string}}
 */
function getWateringStatus(item) {
  const nextDate = addDaysISO(item.lastWateredDate, item.wateringIntervalDays);
  const daysLeft = daysBetweenISO(todayISO(), nextDate);

  if (daysLeft < 0) {
    return {
      state: 'overdue',
      daysLeft,
      className: 'status--overdue',
      label: `🔴 Просрочен полив на ${Math.abs(daysLeft)} дн.`,
    };
  }
  if (daysLeft === 0) {
    return {
      state: 'today',
      daysLeft,
      className: 'status--today',
      label: '💧 Полить сегодня',
    };
  }
  return {
    state: 'ok',
    daysLeft,
    className: 'status--ok',
    label: `✅ Полив через ${daysLeft} дн.`,
  };
}

/**
 * Возвращает записи коллекции, которым пора полив (сегодня или просрочен).
 * @returns {{item: object, status: object}[]}
 */
function getDuePlants() {
  return getMyPlants()
    .map((item) => ({ item, status: getWateringStatus(item) }))
    .filter((entry) => entry.status.daysLeft <= 0);
}

/** Рисует баннер-сводку «пора полить» в начале вкладки «Мои растения». */
function renderRemindersBanner() {
  const container = document.getElementById('reminders-banner');
  const due = getDuePlants();

  if (due.length === 0) {
    container.innerHTML = '';
    return;
  }

  const names = due.map((entry) => myPlantDisplayName(entry.item)).join(', ');
  container.innerHTML =
    `<div class="reminder-banner">🔔 Пора полить (${due.length}): ${names}</div>`;
}

/** Отмечает растение политым сегодня и обновляет вкладку. */
function waterPlant(itemId) {
  updateMyPlant(itemId, { lastWateredDate: todayISO() });
  renderMyPlants(); // перерисует и список, и баннер
}

// --------------------------------------------------------------------------- //
//  Браузерные уведомления (по желанию пользователя)
// --------------------------------------------------------------------------- //

/** @returns {boolean} поддерживает ли браузер уведомления */
function notificationsSupported() {
  return 'Notification' in window;
}

/** Показывает уведомление о растениях, которым нужен полив (если разрешено). */
function notifyDuePlants() {
  if (!notificationsSupported() || Notification.permission !== 'granted') {
    return;
  }
  const due = getDuePlants();
  if (due.length === 0) {
    return;
  }
  const names = due.map((entry) => myPlantDisplayName(entry.item)).join(', ');
  new Notification('Plantata — пора полить 🌱', {
    body: `${due.length} раст.: ${names}`,
  });
}

/** Запрашивает разрешение на уведомления и даёт видимый отклик. */
function enableNotifications() {
  if (!notificationsSupported()) {
    alert('Ваш браузер не поддерживает уведомления');
    return;
  }
  Notification.requestPermission().then((permission) => {
    if (permission !== 'granted') {
      alert('Уведомления запрещены. Разрешите их в настройках сайта (значок слева от адреса).');
      return;
    }
    // Разрешение получено. Если есть что полить — напоминаем про полив,
    // иначе показываем подтверждающее уведомление, чтобы было видно, что работает.
    if (getDuePlants().length > 0) {
      notifyDuePlants();
    } else {
      new Notification('Plantata', {
        body: 'Уведомления включены. Напомним, когда придёт пора полива 🌱',
      });
    }
  });
}
