// Описаний в документації
import flatpickr from "flatpickr";
// Додатковий імпорт стилів
import "flatpickr/dist/flatpickr.min.css";

// Импорт iziToast
import iziToast from "izitoast";
// Додатковий імпорт стилів
import "izitoast/dist/css/iziToast.min.css";

let userSelectedDate = null;

// Опции
const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    userSelectedDate = selectedDates[0];
    chekDate();  
  },
  onOpen(){clearInterval(reIn)},
};

//Проверка даты-----------------------------------
function chekDate() {
  if (userSelectedDate <= new Date()) {
    iziToast.error({
      title: 'Error',
      message: 'Please choose a date in the future',
      progressBar: false,
      transitionIn: 'fadeIn', 
      position: 'topRight', 
      animateInside: false,
    });
    userSelectedDate = null;
    btn.disabled = true;
    startTimeUpdate();
  } else {
    btn.disabled = false;
  }
}

// Функция для запуска обновления времени
function startTimeUpdate() {
  if (fp) {
    fp.destroy(); // Уничтожаем текущий экземпляр
  }
  options.defaultDate = new Date();
  fp = flatpickr("#datetime-picker", options);
  reIn = setInterval(() => {
    if (fp) fp.destroy();
    options.defaultDate = new Date();
    fp = flatpickr("#datetime-picker", options);
  }, 300);
}

// Инициализация с обновлением времени
let fp = null; 
let reIn = null; // Используем let для возможности очистки
startTimeUpdate(); // Вызываем функцию для начальной инициализации

// Добавление нуля
function addZero(value) {
  return String(value).padStart(2, '0');
}

// Подсчет------------------------------------
function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

//------------------------------------------------------   

const btn = document.querySelector("button[data-start]");

const daysV = document.querySelector('[data-days]');
const hoursV = document.querySelector('[data-hours]');
const minutesV = document.querySelector('[data-minutes]');
const secondsV = document.querySelector('[data-seconds]');
const datePicker = document.getElementById('datetime-picker');

// Обработчик нажатия
btn.addEventListener('click', () => {
  if (!userSelectedDate) return;

  btn.disabled = true;
  datePicker.disabled = true;

// Счетчик
  const interval = setInterval(() => {
    const deltaTime = userSelectedDate - new Date();

    if (deltaTime <= 0) {
      clearInterval(interval);
      daysV.textContent = "00";
      hoursV.textContent = "00";
      minutesV.textContent = "00";
      secondsV.textContent = "00";
      datePicker.disabled = false; // Активен после остановки
      // Перезапуск динамического обновления времени
      startTimeUpdate(); // Вызываем функцию для перезапуска
      return;
    }

    // Отображение
    const { days, hours, minutes, seconds } = convertMs(deltaTime);
    daysV.textContent = addZero(days);
    hoursV.textContent = addZero(hours);
    minutesV.textContent = addZero(minutes);
    secondsV.textContent = addZero(seconds);
  }, 1000);
});