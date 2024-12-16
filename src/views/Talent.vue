<template>
  <div class="talent vh-100">
    <h3>Talent</h3>

    <!-- Search and Filter Section -->
    <div class="row mb-4">
      <div class="col-md-10">
        <div class="input-group">
          <input
            type="text"
            class="form-control"
            v-model="search"
            placeholder="Search by name or email"
          />
          <span class="input-group-text">
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
          <option v-for="event in events" :key="event.id" :value="event.name">
            {{ event.name }}
          </option>
        </select>
      </div>
      <div class="col-sm-6">
        <p class="mb-1">Selected Test</p>
        <select class="form-select" v-model="selectedTest">
          <!-- Looping this.tests -->
          <option v-for="test in tests" :key="test.id" :value="test.title">
            {{ test.title }}
          </option>
        </select>
      </div>
    </div>

    <!-- Table Section -->
    <div class="table-responsive">
      <table class="table table-striped table-hover text-center">
        <thead>
          <tr>
            <th>Download</th>
            <th>Nama</th>
            <th>Event</th>
            <th>Test</th>
            <th>Email</th>
            <th>No Handphone</th>
            <th>Tanggal Lahir</th>
            <th>Kota Domisili</th>
            <th>Jenis Kelamin</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="talent in filteredTalents" :key="talent.email">
            <td>
              <button
                class="btn btn-link"
                style="background-color: #265c7f; color: white"
                @click="downloadPDF(talent)"
              >
                <i class="bi bi-download"></i>
              </button>
            </td>
            <td>{{ talent.name }}</td>
            <td>{{ talent.eventName }}</td>
            <td>{{ talent.testName }}</td>
            <td>{{ talent.email }}</td>
            <td>{{ talent.phone }}</td>
            <td>{{ talent.birthDate }}</td>
            <td>{{ talent.city }}</td>
            <td>{{ talent.gender }}</td>
          </tr>
          <tr v-if="filteredTalents.length === 0">
            <td colspan="9" class="text-center">No data found</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { getDocs, collection, getFirestore } from "firebase/firestore";

const db = getFirestore();
export default {
  data() {
    return {
      search: "",
      showFilter: false,
      events: [],
      selectedEvent: "",
      tests: [],
      selectedTest: "",
      talents: [],
    };
  },
  computed: {
    filteredTalents() {
      return this.talents.filter((talent) => {
        const matchesSearch =
          !this.search ||
          talent.name.toLowerCase().includes(this.search.toLowerCase()) ||
          talent.email.toLowerCase().includes(this.search.toLowerCase());
        const matchesEvent =
          !this.selectedEvent || talent.eventName === this.selectedEvent;
        const matchesTest =
          !this.selectedTest || talent.testName === this.selectedTest;

        return matchesSearch && matchesEvent && matchesTest;
      });
    },
  },
  methods: {
    async fetchTalents() {
      try {
        // Fetch data from Firestore
        const querySnapshot = await getDocs(collection(db, "registrations"));
        const rawData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Process data for the table
        this.talents = rawData.flatMap((item) =>
          item.tests.map((test) => ({
            name: item.name,
            eventName: item.event.name,
            testName: test.title,
            testToken: test.token,
            testId: test.idSurvey,
            email: item.email,
            phone: item.phone,
            birthDate: item.birthDate,
            city: item.city,
            gender: item.gender,
          }))
        );

        console.log(this.talents);
      } catch (error) {
        console.error("Error fetching talents: ", error);
      }
    },
    async fetchEvents() {
      try {
        const querySnapshot = await getDocs(collection(db, "events"));
        const rawData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        this.events = rawData;
        console.log(this.events);
      } catch {
        console.error("Error fetching events: ", error);
      }
    },

    async fetchTests() {
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
    toggleFilter() {
      this.showFilter = !this.showFilter;
    },
    async downloadPDF(talent) {
      try {
        const response = await fetch(
          "http://localhost:5000/api/download-survey",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              surveyId: talent.testId,
              token: talent.testToken,
            }),
          }
        );

        if (!response.ok) {
          const error = await response.json();
          console.error("Failed to download survey:", error.error);
          alert("Failed to download survey: " + error.error);
          return;
        }

        // Ambil data file
        const blob = await response.blob();

        // Buat elemen untuk memulai download
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = `${talent.name}_survey_${talent.testId}.json`;
        link.click();
      } catch (error) {
        console.error("Error downloading survey:", error);
        alert("An error occurred while downloading the survey.");
      }
    },
  },
  created() {
    // Fetch talents when the component is created
    this.fetchTalents();

    // Fetch Events when the component is created
    this.fetchEvents();

    // Fetch Tests when the component is created
    this.fetchTests();
  },
};
</script>

<style scoped>
.btn-link {
  background-color: #265c7f;
  color: white;
}

.input-group-text {
  background-color: #265c7f;
}

.btn-primary {
  background-color: #265c7f;
  border: none;
}
</style>
