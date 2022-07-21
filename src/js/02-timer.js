import flatpickr from 'flatpickr';
import Notiflix from 'notiflix';

const refs = {
  inputRef: document.querySelector('#datetime-picker'),
  startBtn: document.querySelector('button[data-start]'),
  spanRefDays: document.querySelector('span[data-days]'),
  spanRefHours: document.querySelector('span[data-hours]'),
  spanRefMinutes: document.querySelector('span[data-minutes]'),
  spanRefSeconds: document.querySelector('span[data-seconds]'),
};

refs.startBtn.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  timeId: null,
  isActive: false,
  onClose(selectedDates) {
    const selectedTime = selectedDates[0].getTime();
    if (selectedTime < Date.now()) {
        Notiflix.Notify.warning('Please choose a date in the future')
      return;
    }
    refs.startBtn.disabled = false;
    refs.startBtn.addEventListener('click', () => {
      if (this.isActive) {
        return;
      }
      this.isActive = true;
      this.timeId = setInterval(() => {
        let deltaTime = selectedTime - Date.now();
        if(deltaTime <= 0){
          clearInterval(this.timeId)
        return;
        }
        const time = convertMs(deltaTime);
        getNewValueOfTime(time)
      }, 1000);
    });
  },
  
};

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function getNewValueOfTime({days, hours, minutes, seconds}) {
  refs.spanRefDays.textContent = `${days}`;
  refs.spanRefHours.textContent = `${hours}`;
  refs.spanRefMinutes.textContent = `${minutes}`;
  refs.spanRefSeconds.textContent = `${seconds}`;
}

flatpickr(refs.inputRef, options);

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = addLeadingZero(Math.floor(ms / day));
  // Remaining hours
  const hours = addLeadingZero(Math.floor((ms % day) / hour));
  // Remaining minutes
  const minutes = addLeadingZero(Math.floor(((ms % day) % hour) / minute));
  // Remaining seconds
  const seconds = addLeadingZero(
    Math.floor((((ms % day) % hour) % minute) / second)
  );

  return { days, hours, minutes, seconds };
}
