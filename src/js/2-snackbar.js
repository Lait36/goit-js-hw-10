// Підключення бібліотеки iziToast
import iziToast from 'izitoast';
// Імпорт CSS для бібліотеки iziToast
import 'izitoast/dist/css/iziToast.min.css';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.form');

  form.addEventListener('submit', event => {
    event.preventDefault(); // Зупинка стандартної події форми

    const delayInput = form.querySelector('input[name="delay"]');
    const delay = parseInt(delayInput.value); // Отримання значення затримки

    const stateInput = form.querySelector('input[name="state"]:checked');
    const state = stateInput.value; // Отримання обраного стану
    console.log(state)

    // Створення нового промісу
    const snackbarPromise = new Promise((resolve, reject) => {
      if (state === 'fulfilled') {
        setTimeout(() => {
          resolve(delay);
        }, delay);
      } else {
        setTimeout(() => {
          reject(delay);
        }, delay);
      }
    });

    // Обробка результату промісу
    snackbarPromise
      .then(delay => {
        iziToast.success({
          title: 'Success',
          message: `✅ Fulfilled promise in ${delay}ms`,
          position: 'topCenter',
        });
      })
      .catch(delay => {
        iziToast.error({
          title: 'Error',
          message: `❌ Rejected promise in ${delay}ms`,
          position: 'topCenter',
        });
      });

    form.reset();
  });
});
