<template>
  <div class="dashboard vh-100">
    <!-- Statistik -->
    <div class="row">
      <!-- Event Card -->
      <div class="col-md-6">
        <div
          class="card shadow-sm rounde border-0 mb-4"
          @click="handleCardClick"
          style="background-color: #e9eff2"
        >
          <div
            class="card-body d-flex align-items-center justify-content-center text-center"
          >
            <div>
              <h5 class="card-title">Event</h5>
              <h3 class="text-primary">{{ eventTotal }}</h3>
              <p class="text-muted">Acara Jobfair</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Talent Card -->
      <div class="col-md-6">
        <router-link to="/talent" style="text-decoration: none">
          <div
            class="card shadow-sm rounded border-0"
            style="background-color: #e9eff2"
          >
            <div
              class="card-body d-flex align-items-center justify-content-center text-center"
            >
              <div>
                <h5 class="card-title">Talent</h5>
                <h3 class="text-success">{{ talentTotal }}</h3>
                <p class="text-muted">Peserta</p>
              </div>
            </div>
          </div>
        </router-link>
      </div>
    </div>

    <!-- Modal -->
    <div
      class="modal fade"
      tabindex="-1"
      :class="{ show: showModal }"
      :style="{
        display: showModal ? 'block' : 'none',
        background: 'rgba(0, 0, 0, 0.5)',
      }"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content p-4">
          <div class="modal-header">
            <h5 class="modal-title">Event Status</h5>
            <button
              type="button"
              class="btn-close"
              @click="closeModal"
            ></button>
          </div>

          <!-- Event Status Cards -->
          <div class="row mb-4 mt-4">
            <!-- Not Started -->
            <div class="col-md-4">
              <div class="card shadow-sm rounded mb-3" style="border: none">
                <div class="card-body d-flex align-items-center">
                  <div
                    class="circle bg-danger d-flex justify-content-center align-items-center"
                  >
                    <i class="bi bi-person-dash-fill text-white fs-3"></i>
                  </div>
                  <div class="ms-3">
                    <h4>{{ notStartedEventCount }}</h4>
                    <p>Not Started</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- On Going -->
            <div class="col-md-4">
              <div
                class="card shadow-sm bg-body-tertiary rounded mb-3"
                style="border: none"
              >
                <div class="card-body d-flex align-items-center">
                  <div
                    class="circle bg-success d-flex justify-content-center align-items-center"
                  >
                    <i class="bi bi-person-gear text-white fs-3"></i>
                  </div>
                  <div class="ms-3">
                    <h4>{{ onGoingEventCount }}</h4>
                    <p>On Going</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Done -->
            <div class="col-md-4">
              <div
                class="card shadow-sm bg-body-tertiary rounded"
                style="border: none"
              >
                <div class="card-body d-flex align-items-center">
                  <div
                    class="circle bg-warning d-flex justify-content-center align-items-center"
                  >
                    <i class="bi bi-person-check-fill text-white fs-3"></i>
                  </div>
                  <div class="ms-3">
                    <h4>{{ doneEventCount }}</h4>
                    <p>Done</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Search and Filter Section -->
          <div class="row mb-3">
            <div class="col-md-10">
              <div class="input-group">
                <!-- Input Field -->
                <input
                  type="text"
                  class="form-control"
                  v-model="search"
                  placeholder="Search"
                />
                <!-- Icon Search di sebelah kanan -->
                <span
                  class="input-group-text"
                  style="background-color: #265c7f"
                >
                  <i class="bi bi-search text-white"></i>
                </span>
              </div>
            </div>
            <div class="col-md-2 d-flex">
              <button
                class="btn btn-secondary"
                style="background-color: #265c7f"
                @click="toggleFilter"
              >
                <i class="bi bi-funnel"></i> Filter
              </button>
            </div>
          </div>

          <!-- Filter Section -->
          <div v-if="showFilter" class="row mb-4">
            <div class="col-sm-6">
              <p class="mb-1">Selected Event</p>
              <select class="form-select" v-model="selectedEvent">
                <!-- Looping this.events -->
                <option
                  v-for="event in events"
                  :key="event.id"
                  :value="event.name"
                >
                  {{ event.name }}
                </option>
              </select>
            </div>
            <div class="col-sm-6">
              <p class="mb-1">Selected Test</p>
              <select class="form-select" v-model="selectedTest">
                <!-- Looping this.tests -->
                <option
                  v-for="test in tests"
                  :key="test.id"
                  :value="test.title"
                >
                  {{ test.title }}
                </option>
              </select>
            </div>
          </div>

          <!-- Table Section -->
          <table class="table table-bordered table-striped">
            <thead class="text-white text-center">
              <tr>
                <th>Event</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="event in filteredEvents" :key="event.id">
                <td>{{ event.name }}</td>
                <td>
                  <!-- Lingkaran warna dan teks status -->
                  <div class="d-flex align-items-center">
                    <div
                      class="circle"
                      :style="{
                        backgroundColor: getStatusColor(event.status),
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        marginRight: '10px',
                      }"
                    ></div>
                    <span class="text-black">{{ event.status }}</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="row p-3">
      <!-- Grafik -->
      <div
        class="col-md-8 shadow-sm rounded p-3"
        style="background-color: #e9eff2"
      >
        <h3 class="mt-4 text-center">Jumlah Event</h3>
        <div class="chart-container">
          <canvas ref="chartCanvas"></canvas>
        </div>
      </div>

      <!-- Top 5 Event -->
      <div class="col-md-4">
        <div
          class="card shadow-sm rounded border-0"
          style="background-color: #e9eff2"
        >
          <div class="card-body">
            <h5 class="card-title mt-4">Top 5 Event</h5>
            <ul class="list-group list-group-flush">
              <li
                class="list-group-item d-flex align-items-center"
                v-for="event in topEvents"
                :key="event.id"
                style="background-color: #e9eff2"
              >
                <!-- Gambar kecil -->
                <img
                  src="../assets/img/poster.jpg"
                  alt="Event Image"
                  class="img-thumbnail me-3"
                  style="width: 50px; height: 50px; object-fit: cover"
                />
                <!-- Detail Event -->
                <div>
                  <strong>{{ event.name }}</strong>
                  <p class="text-muted card-description">
                    {{ event.description }}
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Daftar Event -->
    <div class="row p-3">
      <div
        class="col-12 mt-4 card shadow-sm rounded border-0 p-3"
        style="background-color: #e9eff2"
      >
        <div
          class="d-flex justify-content-between align-items-center mb-3 mt-3"
        >
          <h5 class="mb-0">Daftar Event</h5>
          <router-link to="/event/create">
            <button
              class="btn"
              style="background-color: #265c7f; color: white; border: none"
            >
              Add Event
            </button>
          </router-link>
        </div>
        <div class="row g-3">
          <div
            class="col-6 col-md-4 flex-shrink-0"
            v-for="event in daftarEvent"
            :key="event.id"
          >
            <div
              class="bg-white p-3 border border-2 rounded rounded rounded-3 d-flex flex-column gap-2"
            >
              <h5>{{ event.name }}</h5>
              <img src="../assets/img/poster.jpg" alt="" class="w-100" />
              <p class="card-description">{{ event.description }}</p>
              <button class="btn btn-detail">View</button>
            </div>
          </div>
        </div>
        <router-link to="/event" style="text-decoration: none">
          <div
            class="d-flex justify-content-center align-items-center text-black mb-3 mt-3"
          >
            Lihat Selengkapnya
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import {
  Chart,
  BarController,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import {
  getDocs,
  collection,
  getFirestore,
  where,
  query,
  orderBy,
  onSnapshot,
  limit,
} from "firebase/firestore";

Chart.register(
  BarController,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

export default {
  data() {
    return {
      eventTotal: 0,
      companyTotal: 0,
      talentTotal: 0,
      onGoingEventCount: 0,
      doneEventCount: 0,
      notStartedEventCount: 0,
      chartInstance: null,
      showModal: false,
      search: "",
      showFilter: false, // To toggle the visibility of the filter
      selectedEvent: "",
      selectedTest: "",
      selectedCompany: "",
      events: [],
      tests: [],
      topEvents: [],
      daftarEvent: [],
    };
  },
  computed: {
    filteredEvents() {
      return this.events.filter((event) => {
        return (
          (!this.selectedEvent || event.name === this.selectedEvent) &&
          (!this.selectedTest || event.tests.includes(this.selectedTest)) &&
          (!this.selectedCompany || event.company === this.selectedCompany) &&
          (!this.search || event.name.includes(this.search))
        );
      });
    },
  },
  methods: {
    handleCardClick() {
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    toggleFilter() {
      this.showFilter = !this.showFilter;
    },
    getStatusClass(status) {
      return status === "Not Started"
        ? "text-danger"
        : status === "On Going"
        ? "text-success"
        : "text-warning";
    },
    getStatusColor(status) {
      if (status === "Not Started") return "red";
      if (status === "On Going") return "green";
      if (status === "Done") return "yellow";
      return "gray"; // Warna default
    },
    async renderChart() {
      const db = getFirestore();
      if (this.chartInstance) {
        this.chartInstance.destroy();
      }

      const eventsQuery = query(
        collection(db, "events"),
        orderBy("date", "asc") // Urutkan berdasarkan tanggal
      );
      const querySnapshot = await getDocs(eventsQuery);

      const eventData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      // Olah data untuk Chart.js
      const labels = eventData.map((event) =>
        new Date(event.date).toLocaleString("en-US", {
          month: "short",
        })
      );

      // Hitung jumlah event per bulan
      const eventCounts = Array(12).fill(0); // Array untuk menyimpan jumlah event per bulan
      eventData.forEach((event) => {
        // Mengonversi string tanggal ke objek Date
        const eventDate = new Date(event.date);
        const month = eventDate.getMonth(); // Ambil bulan dari tanggal event
        eventCounts[month] += 1; // Tambahkan 1 ke bulan terkait
      });

      this.chartInstance = new Chart(this.$refs.chartCanvas, {
        type: "bar",
        data: {
          labels: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ],
          datasets: [
            {
              label: "Jumlah Event",
              data: eventCounts,
              backgroundColor: "#265C7F",
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: true,
              position: "top",
            },
            tooltip: {
              enabled: true,
            },
          },
        },
      });
    },
    viewEvent(id) {
      console.log("View event with ID: ", id); // Just for testing
    },
    async fetchEvents() {
      const db = getFirestore();
      try {
        // Query untuk mengambil 3 data terakhir berdasarkan timestamp atau field tertentu
        const eventsQuery = query(
          collection(db, "events"),
          orderBy("createdAt", "desc"), // Urutkan berdasarkan field createdAt secara descending
          limit(3) // Ambil hanya 3 dokumen
        );

        const querySnapshot = await getDocs(eventsQuery);

        // Map data ke daftarEvent
        this.daftarEvent = querySnapshot.docs.map((doc) => ({
          id: doc.id, // Menyertakan ID dokumen jika diperlukan
          ...doc.data(),
        }));

        console.log(this.daftarEvent); // Debugging untuk memastikan data benar
      } catch (error) {
        console.error("Error fetching events:", error);
      }

      try {
        const querySnapshot = await getDocs(collection(db, "events"));
        const currentDate = new Date(); // Tanggal dan waktu saat ini
        const currentDateString = currentDate.toISOString().split("T")[0]; // Formatkan ke YYYY-MM-DD

        const rawData = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          const eventDate = data.date; // Asumsi `date` adalah string dalam format "YYYY-MM-DD"

          // Tentukan status berdasarkan perbandingan tanggal
          let status;
          if (eventDate > currentDateString) {
            status = "Not Started";
          } else if (eventDate === currentDateString) {
            status = "On Going";
          } else {
            status = "Done";
          }

          return {
            id: doc.id,
            ...data,
            status,
          };
        });

        this.events = rawData;
        this.notStartedEventCount = rawData.filter(
          (event) => event.status === "Not Started"
        ).length;
        this.onGoingEventCount = rawData.filter(
          (event) => event.status === "On Going"
        ).length;
        this.doneEventCount = rawData.filter(
          (event) => event.status === "Done"
        ).length;
        console.log(this.events);
      } catch (error) {
        console.error("Error fetching events: ", error);
      }
    },

    async fetchTests() {
      const db = getFirestore();
      try {
        const querySnapshot = await getDocs(collection(db, "tests"));
        const rawData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        this.tests = rawData;

        console.log(this.tests);
      } catch {
        console.error("Error fetching tests: ", error);
      }
    },

    async fetchTopEvents() {
      const db = getFirestore();

      const registrationsRef = collection(db, "registrations");
      const registrationsSnapshot = await getDocs(registrationsRef);

      // Membuat objek untuk menghitung jumlah registrasi per event_id
      const eventCount = {};

      registrationsSnapshot.forEach((doc) => {
        const eventId = doc.data().event.id;
        if (eventCount[eventId]) {
          eventCount[eventId] += 1;
        } else {
          eventCount[eventId] = 1;
        }
      });

      // Ambil 5 event teratas berdasarkan jumlah pendaftaran
      const topEventIds = Object.entries(eventCount)
        .sort((a, b) => b[1] - a[1]) // Urutkan berdasarkan jumlah registrasi terbanyak
        .slice(0, 5) // Ambil 5 event teratas
        .map((entry) => entry[0]); // Ambil hanya event_id

      // Ambil data untuk setiap event yang teratas
      const eventsRef = collection(db, "events");
      const topEvents = [];

      for (const eventId of topEventIds) {
        const eventQuery = query(eventsRef, where("id", "==", eventId));
        const eventSnapshot = await getDocs(eventQuery);

        eventSnapshot.forEach((doc) => {
          topEvents.push({
            id: doc.data().id,
            ...doc.data(),
            registrationsCount: eventCount[eventId],
          });
        });
      }

      this.topEvents = topEvents;
    },
  },
  async mounted() {
    const db = getFirestore();

    const querySnapshotEvent = await getDocs(collection(db, "events"));
    this.eventTotal = querySnapshotEvent.size;

    const querySnapshotCompany = await getDocs(collection(db, "companies"));
    this.companyTotal = querySnapshotCompany.size;

    const talentQuery = query(
      collection(db, "users"),
      where("role", "==", "talent")
    );
    const querySnapshotTalent = await getDocs(talentQuery);
    this.talentTotal = querySnapshotTalent.size;

    this.fetchEvents();
    this.fetchTests();
    this.fetchTopEvents();

    this.renderChart();
  },
  beforeDestroy() {
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }
  },
};
</script>

<style scoped>
.btn-detail {
  background-color: #285480;
  color: white;
  border: none;
}
.circle {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}
.card-description {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2; /* Membatasi teks menjadi 2 baris */
  overflow: hidden; /* Menyembunyikan teks yang lebih panjang dari 2 baris */
  text-overflow: ellipsis; /* Menambahkan elipsis di akhir teks yang terpotong */
}
</style>
