document.addEventListener('DOMContentLoaded', function() {
    const calendarContainer = document.querySelector('.grid');
    const prevMonthButton = document.getElementById('prev-month');
    const nextMonthButton = document.getElementById('next-month');
    const monthYearDisplay = document.getElementById('month-year');
    const eventModal = document.getElementById('event-modal');
    const closeButton = document.querySelector('.close-button');
    const saveEventButton = document.getElementById('save-event');
    const clearEventsButton = document.getElementById('clear-events');
    const eventInput = document.getElementById('event-input');

    let currentYear = new Date().getFullYear();
    let currentMonth = new Date().getMonth();
    let events = JSON.parse(localStorage.getItem('calendarEvents')) || {}; // Load events from Local Storage

    function initCalendar(year, month) {
        calendarContainer.innerHTML = '<div class="font-bold text-center text-2xl">Mon</div><div class="font-bold text-center text-2xl">Tue</div><div class="font-bold text-center text-2xl">Wed</div><div class="font-bold text-center text-2xl">Thu</div><div class="font-bold text-center text-2xl">Fri</div><div class="font-bold text-center text-2xl">Sat</div><div class="font-bold text-center text-2xl">Sun</div>';
        monthYearDisplay.innerText = `${new Date(year, month).toLocaleString('en', { month: 'long' })} ${year}`;

        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        let dayCellCount = firstDayOfMonth === 0 ? 7 : firstDayOfMonth;

        for (let i = 1; i < dayCellCount; i++) {
            calendarContainer.appendChild(document.createElement('div'));
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dayCell = document.createElement('div');
            dayCell.className = 'day text-center border border-gray-300 rounded py-2 cursor-pointer font-bold text-5xl hover:bg-gray-150 hover:shadow-md';
            dayCell.innerText = day;
            dayCell.dataset.date = `${year}-${month + 1}-${day}`;

            // Highlight the current day
            const today = new Date();
            if (year === today.getFullYear() && month === today.getMonth() && day === today.getDate()) {
                dayCell.classList.add('ring', 'ring-blue-500', 'ring-offset-.5', 'ring-offset-blue-200');
            }

            if (events[dayCell.dataset.date]) {
                const eventTitle = document.createElement('div');
                eventTitle.className = 'text-black text-lg mt-1 text-lg'; // Black text and larger size
                eventTitle.innerText = events[dayCell.dataset.date];
                dayCell.appendChild(eventTitle);
            }

            dayCell.addEventListener('click', function() {
                eventModal.classList.remove('hidden');
                eventInput.dataset.date = this.dataset.date;
            });

            calendarContainer.appendChild(dayCell);
        }
    }

    function changeMonth(offset) {
        currentMonth += offset;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        } else if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        initCalendar(currentYear, currentMonth);
    }

    prevMonthButton.addEventListener('click', () => changeMonth(-1));
    nextMonthButton.addEventListener('click', () => changeMonth(1));

    function saveEvent() {
        const eventDate = eventInput.dataset.date;
        const eventDetails = eventInput.value.trim();
        if (eventDetails) {
            if (!events[eventDate]) {
                events[eventDate] = eventDetails;
            } else {
                events[eventDate] += `, ${eventDetails}`;
            }
            localStorage.setItem('calendarEvents', JSON.stringify(events)); // Save to Local Storage
            initCalendar(currentYear, currentMonth);
            eventModal.classList.add('hidden');
            eventInput.value = '';
        }
    }

    function clearEvents() {
        const eventDate = eventInput.dataset.date;
        if (events[eventDate]) {
            delete events[eventDate];
            localStorage.setItem('calendarEvents', JSON.stringify(events)); // Update Local Storage
            initCalendar(currentYear, currentMonth);
            eventModal.classList.add('hidden');
        }
    }

    // Close modal on Escape key press
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            eventModal.classList.add('hidden');
        }
    });

    closeButton.addEventListener('click', () => eventModal.classList.add('hidden'));
    saveEventButton.addEventListener('click', saveEvent);
    clearEventsButton.addEventListener('click', clearEvents);

    initCalendar(currentYear, currentMonth);
});
