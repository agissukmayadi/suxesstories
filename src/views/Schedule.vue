<template>
  <div class="">
    <div
      class="d-flex flex-column flex-md-row justify-content-between align-items-center"
    >
      <h1>Schedule</h1>
      <button class="btn btn-primary btn-save color-primary">Add Event</button>
    </div>
    <div class="d-flex justify-content-between align-items-center mb-3 mt-3">
      <h3>{{ currentMonth }} {{ currentYear }}</h3>
      <div>
        <button class="btn btn-outline-secondary me-2" @click="prevMonth">
          «
        </button>
        <button class="btn btn-outline-secondary" @click="nextMonth">»</button>
      </div>
    </div>
    <div class="table-responsive">
      <table class="table table-bordered text-center">
        <thead>
          <tr>
            <th>Sun</th>
            <th>Mon</th>
            <th>Tue</th>
            <th>Wed</th>
            <th>Thu</th>
            <th>Fri</th>
            <th>Sat</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(week, index) in weeks" :key="index">
            <td
              v-for="day in week"
              :key="day"
              class="position-relative"
              :class="{
                'table-active': isToday(day),
              }"
              @click="
                day && (isToday(day) || isFuture(day)) && goToCreateEvent(day)
              "
              :style="{
                cursor: day && (isToday(day) || isFuture(day)) ? 'pointer' : '',
              }"
            >
              <span v-if="day">{{ day }}</span>
              <ul class="list-unstyled mt-2">
                <li
                  v-for="event in eventsByDate(day)"
                  :key="event.id"
                  class="badge d-block mb-1"
                  :class="{
                    'bg-danger': isPastEvent(event.date),
                    'bg-success': isTodayEvent(event.date),
                    'color-primary': isFutureEvent(event.date),
                  }"
                >
                  {{ event.name }}
                </li>
              </ul>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import {
  collection,
  query,
  where,
  getDocs,
  getFirestore,
} from "firebase/firestore";
const db = getFirestore();

export default {
  data() {
    return {
      currentYear: new Date().getFullYear(),
      currentMonth: new Date().toLocaleString("default", { month: "long" }),
      currentMonthIndex: new Date().getMonth(),
      daysInMonth: [],
      weeks: [],
      today: new Date().getDate(),
      events: [],
    };
  },
  methods: {
    async fetchEvents() {
      const daysInMonth = new Date(
        this.currentYear,
        this.currentMonthIndex + 1,
        0
      ).getDate(); // Hitung jumlah hari
      const startOfMonth = `${this.currentYear}-${String(
        this.currentMonthIndex + 1
      ).padStart(2, "0")}-01`;
      const endOfMonth = `${this.currentYear}-${String(
        this.currentMonthIndex + 1
      ).padStart(2, "0")}-${daysInMonth}`;

      console.log("Fetching events between:", startOfMonth, "and", endOfMonth);

      const q = query(
        collection(db, "events"),
        where("date", ">=", startOfMonth),
        where("date", "<=", endOfMonth)
      );

      const querySnapshot = await getDocs(q);
      this.events = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      console.log("Fetched events:", this.events);
    },
    updateDaysInMonth() {
      const days = new Date(
        this.currentYear,
        this.currentMonthIndex + 1,
        0
      ).getDate();
      const firstDay = new Date(
        this.currentYear,
        this.currentMonthIndex,
        1
      ).getDay();

      // Buat array untuk mengatur hari berdasarkan minggu
      const daysArray = Array.from({ length: days }, (_, i) => i + 1);
      this.weeks = [];
      let week = Array(firstDay).fill(null); // Isi dengan null untuk hari kosong di awal

      for (let day of daysArray) {
        week.push(day);
        if (week.length === 7) {
          this.weeks.push(week);
          week = [];
        }
      }

      if (week.length) {
        while (week.length < 7) week.push(null); // Tambahkan null untuk hari kosong di akhir
        this.weeks.push(week);
      }
    },
    prevMonth() {
      if (this.currentMonthIndex === 0) {
        this.currentMonthIndex = 11;
        this.currentYear -= 1;
      } else {
        this.currentMonthIndex -= 1;
      }
      this.updateCalendar();
    },
    nextMonth() {
      if (this.currentMonthIndex === 11) {
        this.currentMonthIndex = 0;
        this.currentYear += 1;
      } else {
        this.currentMonthIndex += 1;
      }
      this.updateCalendar();
    },
    updateCalendar() {
      this.currentMonth = new Date(
        this.currentYear,
        this.currentMonthIndex
      ).toLocaleString("default", {
        month: "long",
      });
      this.updateDaysInMonth();
      this.fetchEvents();
    },
    eventsByDate(day) {
      if (!day) return [];
      const date = `${this.currentYear}-${String(
        this.currentMonthIndex + 1
      ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      return this.events.filter((event) => event.date === date);
    },

    goToCreateEvent(day) {
      if (!day) return;
      const date = `${this.currentYear}-${String(
        this.currentMonthIndex + 1
      ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      this.$router.push({ path: "/event/create", query: { date } });
    },

    isToday(day) {
      if (!day) return false;
      const today = new Date();
      const currentDate = new Date(
        this.currentYear,
        this.currentMonthIndex,
        day
      );
      return (
        currentDate.getDate() === today.getDate() &&
        currentDate.getMonth() === today.getMonth() &&
        currentDate.getFullYear() === today.getFullYear()
      );
    },
    isPastEvent(eventDate) {
      const today = new Date().toISOString().split("T")[0];
      return eventDate < today;
    },
    isTodayEvent(eventDate) {
      const today = new Date().toISOString().split("T")[0];
      return eventDate === today;
    },
    isFutureEvent(eventDate) {
      const today = new Date().toISOString().split("T")[0];
      return eventDate > today;
    },
    isToday(day) {
      const today = new Date();
      const currentDate = `${today.getFullYear()}-${String(
        today.getMonth() + 1
      ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
      const selectedDate = `${this.currentYear}-${String(
        this.currentMonthIndex + 1
      ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      return currentDate === selectedDate;
    },
    isFuture(day) {
      const today = new Date();
      const selectedDate = new Date(
        this.currentYear,
        this.currentMonthIndex,
        day
      );
      return selectedDate > today;
    },
  },

  mounted() {
    this.updateCalendar();
  },
};
</script>

<style scoped>
.table-active {
  background-color: #f0f8ff !important;
}

table {
  table-layout: fixed; /* Pastikan tabel menggunakan lebar tetap */
  width: 100%; /* Sesuaikan agar tabel memanfaatkan lebar penuh */
}

td {
  width: 14.28%; /* 100% dibagi 7 (jumlah hari dalam seminggu) */
  word-wrap: break-word; /* Pecah kata jika terlalu panjang */
  vertical-align: top; /* Atur agar konten berada di atas */
}

.color-primary {
  background-color: #285480;
}
</style>
