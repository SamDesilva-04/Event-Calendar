let currentDate = new Date();
let events = JSON.parse(localStorage.getItem('events')) || [];

const monthNames = ["January", "February", "March", "April", "May", "June",
                    "July", "August", "September", "October", "November", "December"];

const calendarTable = document.getElementById('calendarTable');
const monthYear = document.getElementById('monthYear');
const prevMonth = document.getElementById('prevMonth');
const nextMonth = document.getElementById('nextMonth');
const eventForm = document.getElementById('eventForm');
const eventDateInput = document.getElementById('eventDate');
const eventTitleInput = document.getElementById('eventTitle');
const eventTimeInput = document.getElementById('eventTime');
const eventDescInput = document.getElementById('eventDesc');

function renderCalendar(date) {
  calendarTable.innerHTML = '';
  const year = date.getFullYear();
  const month = date.getMonth();
  monthYear.textContent = `${monthNames[month]} ${year}`;

  // Table header
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  let thead = document.createElement('thead');
  let tr = document.createElement('tr');
  daysOfWeek.forEach(day => {
    let th = document.createElement('th');
    th.textContent = day;
    tr.appendChild(th);
  });
  thead.appendChild(tr);
  calendarTable.appendChild(thead);

  // Dates
  let firstDay = new Date(year, month, 1).getDay();
  let lastDate = new Date(year, month + 1, 0).getDate();
  let tbody = document.createElement('tbody');
  let row = document.createElement('tr');

  // Empty cells before first day
  for (let i = 0; i < firstDay; i++) {
    row.appendChild(document.createElement('td'));
  }

  for (let day = 1; day <= lastDate; day++) {
    let cell = document.createElement('td');
    cell.textContent = day;
    const fullDate = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
    const dayEvents = events.filter(e => e.date === fullDate);
    dayEvents.forEach(ev => {
      const div = document.createElement('div');
      div.classList.add('event');
      div.textContent = `${ev.time} ${ev.title}`;
      cell.appendChild(div);
    });

    cell.addEventListener('click', () => {
      eventDateInput.value = fullDate;
      $('#eventModal').modal('show');
    });

    row.appendChild(cell);
    if ((firstDay + day) % 7 === 0 || day === lastDate) {
      tbody.appendChild(row);
      row = document.createElement('tr');
    }
  }

  calendarTable.appendChild(tbody);
}

// Navigation
prevMonth.addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar(currentDate);
});

nextMonth.addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar(currentDate);
});

// Event Form Submission
eventForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const newEvent = {
    date: eventDateInput.value,
    title: eventTitleInput.value,
    time: eventTimeInput.value,
    description: eventDescInput.value
  };
  events.push(newEvent);
  localStorage.setItem('events', JSON.stringify(events));
  $('#eventModal').modal('hide');
  eventForm.reset();
  renderCalendar(currentDate);
});

// Initial render
renderCalendar(currentDate);
