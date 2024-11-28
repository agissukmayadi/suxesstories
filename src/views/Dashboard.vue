<template>
  <div class="dashboard container">
    <!-- Statistik -->
    <div class="row my-4">
      <div class="col-md-4">
        <div class="card shadow-sm bg-body-tertiary rounded">
          <div
            class="card-body d-flex align-items-center justify-content-between"
          >
            <div>
              <h5 class="card-title">Event</h5>
              <h3 class="text-primary">189</h3>
              <p class="text-muted">dari 50 perusahaan</p>
            </div>
            <!-- Progress Circle -->
            <div class="d-flex me-3">
              <div class="progress-circle text-primary">
                <span>100+</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card shadow-sm bg-body-tertiary rounded">
          <div
            class="card-body d-flex align-items-center justify-content-between"
          >
            <div>
              <h5 class="card-title">Talent</h5>
              <h3 class="text-success">220</h3>
              <p class="text-muted">Peserta</p>
            </div>
            <!-- Progress Circle -->
            <div class="d-flex me-3">
              <div class="progress-circle text-success">
                <span>200+</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card shadow-sm bg-body-tertiary rounded">
          <div
            class="card-body d-flex align-items-center justify-content-between"
          >
            <div>
              <h5 class="card-title">Schedule</h5>
              <h3 class="text-info">105</h3>
              <p class="text-muted">Januari - Desember</p>
            </div>
            <!-- Progress Circle -->
            <div class="d-flex me-3">
              <div class="progress-circle text-info">
                <span>80+</span>
              </div>
            </div>
          </div>
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
              <li
                class="list-group-item d-flex align-items-center bg-body-tertiary"
                v-for="event in topEvents"
                :key="event.id"
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
      <div class="col-12 mt-4">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h5 class="mb-0">Daftar Event</h5>
          <button
            class="btn"
            style="background-color: #265c7f; color: white; border: none"
          >
            Add Event
          </button>
        </div>
        <div class="row">
          <div
            class="col-md-4 mb-4"
            v-for="event in daftarEvent"
            :key="event.id"
          >
            <div class="card shadow-sm h-100">
              <img :src="event.image" class="card-img-top" :alt="event.title" />
              <div class="card-body">
                <h5 class="card-title">{{ event.title }}</h5>
                <p class="card-text">{{ event.description }}</p>
                <button
                  class="btn btn-primary btn-sm"
                  @click="viewEvent(event.id)"
                >
                  View
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="text-center mt-3">
          <button class="btn btn-outline-primary me-2">
            Lihat selengkapnya
          </button>
        </div>
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
      topEvents: [
        {
          id: 1,
          title: "Event A",
          description: "Deskripsi Event A",
          image: "../assets/img/profile.jpg",
        },
        {
          id: 2,
          title: "Event B",
          description: "Deskripsi Event B",
          image: "https://via.placeholder.com/50",
        },
        {
          id: 3,
          title: "Event C",
          description: "Deskripsi Event C",
          image: "https://via.placeholder.com/50",
        },
        {
          id: 4,
          title: "Event D",
          description: "Deskripsi Event D",
          image: "https://via.placeholder.com/50",
        },
        {
          id: 5,
          title: "Event E",
          description: "Deskripsi Event E",
          image: "https://via.placeholder.com/50",
        },
      ],
      daftarEvent: [
        {
          id: 1,
          title: "Event 1",
          description: "Deskripsi untuk event pertama",
          image: "https://via.placeholder.com/150",
        },
        {
          id: 2,
          title: "Event 2",
          description: "Deskripsi untuk event kedua",
          image: "https://via.placeholder.com/150",
        },
      ],
    };
  },
  methods: {
    renderChart() {
      if (this.chartInstance) {
        this.chartInstance.destroy();
      }
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
    viewEvent(id) {},
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
</style>
