<template>
  <div class="dashboard container">
    <!-- Statistik -->
    <div class="row my-4 mt-1">
      <!-- Event Card -->
      <div class="col-md-6">
        <div class="card shadow-sm bg-body-tertiary rounde border-0 mb-4" @click="handleCardClick">
          <div class="card-body d-flex align-items-center justify-content-between">
            <div>
              <h5 class="card-title">Event</h5>
              <h3 class="text-primary">189</h3>
              <p class="text-muted">dari 50 perusahaan</p>
            </div>
            <div class="d-flex me-3">
              <div class="progress-circle text-primary">
                <span>100+</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Talent Card -->
      <div class="col-md-6">
        <router-link to="/user" style="text-decoration: none;">
          <div class="card shadow-sm bg-body-tertiary rounded border-0">
            <div class="card-body d-flex align-items-center justify-content-center text-center">
              <div>
                <h5 class="card-title">Talent</h5>
                <h3 class="text-success">50</h3>
                <p class="text-muted">Peserta</p>
              </div>
            </div>
          </div>
        </router-link>
      </div>
    </div>

    <!-- Modal -->
    <div class="modal fade" tabindex="-1" :class="{ show: showModal }"
      :style="{ display: showModal ? 'block' : 'none', background: 'rgba(0, 0, 0, 0.5)' }">
      <div class="modal-dialog modal-lg">
        <div class="modal-content p-4">
          <div class="modal-header">
            <h5 class="modal-title">Event Status</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>

          <!-- Event Status Cards -->
          <div class="row mb-4 mt-4">
            <!-- Not Started -->
            <div class="col-md-4">
              <div class="card shadow-sm bg-body-tertiary rounded mb-3" style="border: none;">
                <div class="card-body d-flex align-items-center">
                  <div class="circle bg-danger d-flex justify-content-center align-items-center">
                    <i class="bi bi-person-dash-fill text-white fs-3"></i>
                  </div>
                  <div class="ms-3">
                    <h4>15</h4>
                    <p>Not Started</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- On Going -->
            <div class="col-md-4">
              <div class="card shadow-sm bg-body-tertiary rounded mb-3" style="border: none;">
                <div class="card-body d-flex align-items-center">
                  <div class="circle bg-success d-flex justify-content-center align-items-center">
                    <i class="bi bi-person-gear text-white fs-3"></i>
                  </div>
                  <div class="ms-3">
                    <h4>15</h4>
                    <p>On Going</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Done -->
            <div class="col-md-4">
              <div class="card shadow-sm bg-body-tertiary rounded" style="border: none;">
                <div class="card-body d-flex align-items-center">
                  <div class="circle bg-warning d-flex justify-content-center align-items-center">
                    <i class="bi bi-person-check-fill text-white fs-3"></i>
                  </div>
                  <div class="ms-3">
                    <h4>15</h4>
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
                <input type="text" class="form-control" v-model="search" placeholder="Search" />
                <!-- Icon Search di sebelah kanan -->
                <span class="input-group-text" style="background-color: #265c7f;">
                  <i class="bi bi-search text-white"></i>
                </span>
              </div>
            </div>
            <div class="col-md-2 d-flex">
              <button class="btn btn-secondary" style="background-color: #265c7f;" @click="toggleFilter">
                <i class="bi bi-funnel"></i> Filter
              </button>
            </div>
          </div>

          <!-- Filter Section -->
          <div v-if="showFilter" class="row mb-4">
            <div class="col-md-4">
              <select class="form-select" id="selectEvent" v-model="selectedEvent">
                <option value="" disabled selected>Select Event</option>
                <option value="Physics Happy Day">Physics Happy Day</option>
                <option value="Women Strong">Women Strong</option>
                <option value="Insights Quest">Insights Quest</option>
              </select>
            </div>
            <div class="col-md-4">
              <select class="form-select" v-model="selectedTest">
                <option value="" disabled selected>Select Test</option>
                <option value="Test 1">Negotiation Skill Test</option>
                <option value="Test 2">CFIT 3</option>
                <option value="Test 3">5pf Tipologi</option>
                <option value="Test 3">Personality 5.0</option>
              </select>
            </div>
            <div class="col-md-4">
              <select class="form-select" id="selectCompany" v-model="selectedCompany">
                <option value="" disabled selected>Select Company</option>
                <option value="PT. Cipta Semesta">PT. Cipta Semesta</option>
                <option value="PT. Cipta Angkasa">PT. Cipta Angkasa</option>
                <option value="Yayasan Peduli Lansia">Yayasan Peduli Lansia</option>
              </select>
            </div>
          </div>

          <!-- Table Section -->
          <table class="table table-bordered table-striped">
            <thead class="text-white text-center">
              <tr>
                <th>Event</th>
                <th>Company</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="event in filteredEvents" :key="event.id">
                <td>{{ event.name }}</td>
                <td>{{ event.company }}</td>
                <td>
                  <!-- Lingkaran warna dan teks status -->
                  <div class="d-flex align-items-center">
                    <div class="circle" :style="{
                      backgroundColor: getStatusColor(event.status),
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      marginRight: '10px',
                    }"></div>
                    <span class="text-black">{{ event.status }}</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

        </div>
      </div>
    </div>

    <div class="row">
      <!-- Grafik -->
      <div class="col-md-8 mt-2 shadow-sm bg-body-tertiary rounded">
        <h3 class="mt-4 text-center">Jumlah Event</h3>
        <div class="chart-container">
          <canvas ref="chartCanvas"></canvas>
        </div>
      </div>

      <!-- Top 5 Event -->
      <div class="col-md-4 mt-2">
        <div class="card shadow-sm bg-body-tertiary rounded border-0">
          <div class="card-body">
            <h5 class="card-title mt-4">Top 5 Event</h5>
            <ul class="list-group list-group-flush">
              <li class="list-group-item d-flex align-items-center bg-body-tertiary" v-for="event in topEvents"
                :key="event.id">
                <!-- Gambar kecil -->
                <img src="../assets/img/poster.jpg" alt="Event Image" class="img-thumbnail me-3"
                  style="width: 50px; height: 50px; object-fit: cover" />
                <!-- Detail Event -->
                <div>
                  <strong>{{ event.title }}</strong>
                  <p class="text-muted">{{ event.description }}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Daftar Event -->
    <div class="row">
      <div class="col-12 mt-4 card shadow-sm bg-body-tertiary rounded border-0">
        <div class="d-flex justify-content-between align-items-center mb-3 mt-3">
          <h5 class="mb-0">Daftar Event</h5>
          <router-link to="/event">
            <button class="btn" style="background-color: #265c7f; color: white; border: none">
              Add Event
            </button>
          </router-link>
        </div>
        <div class="row">
          <div class="col-md-4 mb-4" v-for="event in daftarEvent" :key="event.id">
            <div class="card shadow-sm h-100">
              <img :src="event.image" class="card-img-top" :alt="event.title" />
              <div class="card-body">
                <h5 class="card-title">{{ event.title }}</h5>
                <p class="card-text">{{ event.description }}</p>
                <button class="btn btn-primary btn-sm" @click="viewEvent(event.id)">
                  View
                </button>
              </div>
            </div>
          </div>
        </div>
        <router-link to="/event" style="text-decoration: none;">
          <div class="d-flex justify-content-center align-items-center text-black mb-3">
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
      chartInstance: null,
      showModal: false,
      search: '',
      showFilter: false, // To toggle the visibility of the filter
      selectedEvent: '',
      selectedTest: '',
      selectedCompany: '',
      events: [
        { id: 1, name: "Physics Happy Day", company: "PT. Cipta Semesta", status: "Not Started" },
        { id: 2, name: "Women Strong", company: "PT. Cipta Angkasa", status: "On Going" },
        { id: 3, name: "Insights Quest", company: "Yayasan Peduli Lansia", status: "Done" },
        { id: 4, name: "No Money", company: "Citra Abadi Resources", status: "On Going" },
        { id: 5, name: "Happy Puppy", company: "PT. Cipta Semesta", status: "Not Started" },
      ],
      topEvents: [
        { id: 1, title: "Physics Happy Day", description: "An event about Physics", image: "../assets/img/poster.jpg" },
        { id: 2, title: "Women Strong", description: "Empowering women", image: "../assets/img/poster.jpg" },
        { id: 3, title: "Insights Quest", description: "A quest for insights", image: "../assets/img/poster.jpg" },
        { id: 4, title: "No Money", description: "Event about financial literacy", image: "../assets/img/poster.jpg" },
        { id: 5, title: "Happy Puppy", description: "A fun event for animal lovers", image: "../assets/img/poster.jpg" }
      ],
      daftarEvent: [
        { id: 1, title: "Physics Happy Day", description: "Learn about the latest in Physics", image: "../assets/img/poster.jpg" },
        { id: 2, title: "Women Strong", description: "Celebrate strong women", image: "../assets/img/poster.jpg" },
        { id: 3, title: "Insights Quest", description: "A journey to gain valuable insights", image: "../assets/img/poster.jpg" }
      ]
    };
  },
  computed: {
    filteredEvents() {
      return this.events.filter(event => {
        return (
          (!this.selectedEvent || event.name === this.selectedEvent) &&
          (!this.selectedTest || event.name.includes(this.selectedTest)) &&
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
    renderChart() {
      if (this.chartInstance) {
        this.chartInstance.destroy();
      }
      this.chartInstance = new Chart(this.$refs.chartCanvas, {
        type: "bar",
        data: {
          labels: [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
          ],
          datasets: [
            {
              label: "Jumlah Event",
              data: [60, 40, 50, 40, 35, 30, 55, 50, 40, 50, 40, 60],
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
  },
  mounted() {
    this.renderChart();
  },
  beforeDestroy() {
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }
  },
};

</script>

<style>
.progress-circle {
  width: 80px;
  height: 80px;
  border: 8px solid #e0e0e0;
  border-top-color: currentColor;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
}

.circle {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}
</style>
