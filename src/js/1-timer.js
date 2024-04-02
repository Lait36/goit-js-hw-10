// Описаний у документації
import flatpickr from 'flatpickr';
import iziToast from 'izitoast';
// Додатковий імпорт стилів
import 'flatpickr/dist/flatpickr.min.css';
import 'izitoast/dist/css/iziToast.min.css';

// Оголошення змінних
const startBtn = document.querySelector('[data-start]');
const input = document.querySelector('#datetime-picker');
let intervalId;

// Налаштування Flatpickr
const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    userSelectedDate = selectedDates[0];
    checkSelectedDate();
  },
};

// Ініціалізація Flatpickr
flatpickr('#datetime-picker', options);

// Оголошення змінних для роботи з часом
let userSelectedDate;
let selectedTimestamp;

// Функція перевірки вибраної дати
function checkSelectedDate() {
  selectedTimestamp = userSelectedDate.getTime();
  const currentTimestamp = Date.now();
  
  if (selectedTimestamp < currentTimestamp) {
    iziToast.warning({
      title: 'Warning',
      message: 'Please choose a date in the future',
      position: 'topCenter',
    });
    startBtn.disabled = true;
  } else {
    startBtn.disabled = false;
    const timeDifference = selectedTimestamp - currentTimestamp;
    const convertedTime = convertMs(timeDifference);
    addLeadingZero(convertedTime);
    console.log(convertedTime);
  }
}

// Функція додавання ведучого нуля
function addLeadingZero(time) {
  const daysElement = document.querySelector('[data-days]');
  const hoursElement = document.querySelector('[data-hours]');
  const minutesElement = document.querySelector('[data-minutes]');
  const secondsElement = document.querySelector('[data-seconds]');

  daysElement.textContent = time.days.toString().padStart(2, '0');
  hoursElement.textContent = time.hours.toString().padStart(2, '0');
  minutesElement.textContent = time.minutes.toString().padStart(2, '0');
  secondsElement.textContent = time.seconds.toString().padStart(2, '0');
}

// Функція конвертації мілісекунд в дні, години, хвилини та секунди
function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

// Функція оновлення таймера
function updateTimer() {
  if (!selectedTimestamp) {
    return; // Вихід з функції, якщо значення selectedTimestamp не встановлено
  }

  const currentTimestamp = Date.now();
  const timeDifference = selectedTimestamp - currentTimestamp;

  if (timeDifference <= 0) {
    clearInterval(intervalId);
    iziToast.success({
      // title: 'Ok',
      message: 'Please choose a date in the future',
      position: 'topCenter',
    });
    startBtn.disabled = false;
    input.disabled = false;
    return;
  }

  const convertedTime = convertMs(timeDifference);
  addLeadingZero(convertedTime);
}

// Обробник кліку на кнопку "Start"
startBtn.addEventListener('click', () => {
  startBtn.disabled = true;
  input.disabled = true;
  intervalId = setInterval(updateTimer, 1000);
});