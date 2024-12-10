<template>
  <div class="d-flex vh-100">
    <!-- Main Content -->
    <main class="flex-grow-1 p-4 bg-light">
      <section>
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h4>Daftar Event</h4>
          <router-link class="btn btn-save" to="/event/create">
            Add Event
          </router-link>
        </div>
        <div class="row g-3">
          <div
            class="col-6 col-md-4 flex-shrink-0"
            v-for="event in events"
            :key="event.id"
          >
            <div class="bg-white p-3 border rounded d-flex flex-column gap-2">
              <h5>{{ event.name }}</h5>
              <img src="../assets/img/poster.jpg" alt="" class="w-100" />
              <p class="card-description">{{ event.description }}</p>
              <button class="btn btn-detail" @click="viewselectedEvent(event)">
                View
              </button>
            </div>
          </div>
        </div>
      </section>
      <div v-if="showModal" class="modal" tabindex="-1" style="display: block">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">{{ selectedEvent.name }}</h5>
              <button
                type="button"
                class="btn-close"
                @click="closeModal"
              ></button>
            </div>
            <div class="modal-body">
              <img src="../assets/img/poster.jpg" class="w-100" alt="" />

              <div class="d-flex flex-column g-0 mt-3">
                <p class="mb-1 fw-semibold">Perusahaan</p>
                <small>{{
                  selectedCompany ? selectedCompany.name : "-"
                }}</small>
              </div>

              <div class="d-flex flex-column g-0 mt-3">
                <p class="mb-1 fw-semibold">Tanggal</p>
                <small>{{ formatDate(selectedEvent.date) }}</small>
              </div>

              <div class="d-flex flex-column g-0 mt-3">
                <p class="mb-1 fw-semibold">Deskripsi</p>
                <small>{{ selectedEvent.description }}</small>
              </div>
              <div class="d-flex flex-column g-0 mt-3">
                <p class="mb-1 fw-semibold">Test</p>
                <div class="d-flex gap-2 flex-wrap">
                  <div v-for="test in selectedTests" :key="test">
                    <small class="badge test-item">{{ test.title }}</small>
                  </div>
                </div>
              </div>
              <div class="d-flex flex-column mt-3">
                <p class="mb-1 fw-semibold">Hasil Test</p>
                <div class="d-flex gap-2 flex-wrap">
                  <small
                    class="badge test-item"
                    v-if="selectedEvent.results.company"
                    >Company</small
                  >
                  <small
                    class="badge test-item"
                    v-if="selectedEvent.results.talent"
                    >Talent</small
                  >
                </div>
              </div>
              <div class="mt-3 d-flex gap-3">
                <div class="d-flex flex-column g-0">
                  <p class="mb-1 fw-semibold">Payment</p>
                  <small class="badge bg-success" v-if="selectedEvent.payment"
                    >Active</small
                  >
                  <small
                    class="badge bg-secondary"
                    v-if="!selectedEvent.payment"
                    >None</small
                  >
                </div>
                <div class="d-flex flex-column g-0">
                  <p class="mb-1 fw-semibold">Nominal</p>
                  <small>{{
                    formatRupiah(selectedEvent.amount) ?? "Rp. 0"
                  }}</small>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-edit-outline"
                @click="editEvent"
              >
                Edit
              </button>
              <button
                type="button"
                class="btn btn-save"
                @click="showModalQRCode = true"
              >
                Kode QR
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="showModalEdit"
        class="modal"
        tabindex="-1"
        style="display: block"
      >
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Edit Event</h5>
              <button
                type="button"
                class="btn-close"
                @click="showModalEdit = false"
              ></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="updateEvent">
                <div>
                  <div class="mb-3">
                    <label for="name" class="form-label">Name</label>
                    <input
                      type="text"
                      id="name"
                      v-model="selectedEvent.name"
                      class="form-control"
                      required
                    />
                  </div>
                  <div class="mb-3">
                    <label for="companyId" class="form-label">Perusahaan</label>
                    <select
                      type="text"
                      id="companyId"
                      v-model="selectedEvent.companyId"
                      class="form-select"
                      required
                    >
                      <option
                        v-for="company in companies"
                        :key="company.id"
                        :value="company.id"
                      >
                        {{ company.name }}
                      </option>
                    </select>
                  </div>
                  <div class="mb-3">
                    <label for="description" class="form-label"
                      >Deskripsi</label
                    >
                    <textarea
                      type="text"
                      id="description"
                      class="form-control"
                      v-model="selectedEvent.description"
                      required
                      rows="4"
                    ></textarea>
                  </div>
                  <div class="mb-3">
                    <label for="date" class="form-label">Tanggal</label>
                    <input
                      type="date"
                      id="date"
                      class="form-control"
                      v-model="selectedEvent.date"
                      required
                    />
                  </div>
                  <div class="mb-3">
              <label class="form-label">Pilih Test</label>
             <div class="row g-2">
         <div class="col-3" v-for="test in tests" :key="test.id">
      <div class="form-check">
        <input
          class="form-check-input"
          type="checkbox"
          :id="test.id"
          :value="test.id"
          v-model="selectedEvent.tests"
        />
        <label class="form-check-label" :for="test.id">{{ test.title }}</label>
                    </div>
                  </div>
               </div>
             </div>
                  <div class="mb-3">
                    <label class="form-label">Hasil Test</label>
                    <div class="mb-2">
                      <div class="form-check">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          v-model="selectedEvent.results.company"
                          disabled
                        />
                        <label class="form-check-label"> Company </label>
                      </div>
                    </div>
                    <div class="mb-2">
                      <div class="form-check">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          v-model="selectedEvent.results.talent"
                        />
                        <label class="form-check-label"> Talent </label>
                      </div>
                    </div>
                  </div>
                  <div class="mb-3 d-flex align-items-center">
                    <label class="form-label me-3">Payment</label>
                    <input type="checkbox" v-model="selectedEvent.payment" />
                    <input
                      type="number"
                      class="form-control ms-3"
                      v-model="selectedEvent.amount"
                      placeholder="Nominal"
                      :disabled="!selectedEvent.payment"
                    />
                  </div>
                </div>
                <div class="d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    class="btn btn-edit-outline"
                    @click="showModalEdit = false"
                  >
                    Cancel
                  </button>
                  <button type="submit" class="btn btn-save">Save</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="showModalQRCode"
        class="modal"
        tabindex="-1"
        style="display: block"
      >
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">QR Code</h5>
              <button
                type="button"
                class="btn-close"
                @click="showModalQRCode = false"
              ></button>
            </div>
            <div class="modal-body">
              <p class="text-center">
                Kode QR Berhasil dibuat, silahkan simpan kode QR
              </p>
              <img :src="selectedEvent.qrCode" class="w-100" alt="" />
              <button
                type="button"
                class="btn btn-save w-100"
                @click="downloadQRCode"
              >
                Download
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  where,
  documentId,
  updateDoc,
} from "firebase/firestore";
import axios from "axios";
import QRCode from "qrcode";
import Swal from "sweetalert2";

const db = getFirestore();

export default {
  data() {
    return {
      events: [],
      tests: [],
      companies: [],
      showModal: false,
      showModalEdit: false,
      showModalQRCode: false,
      selectedEvent: {},
      selectedCompany: {},
      selectedTests: [],
    };
  },
  methods: {
    async fetchEvents() {
      try {
        const querySnapshot = await getDocs(collection(db, "events"));
        this.events = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    },

    async fetchTestsFromLimeSurvey() {
      try {
        // Konfigurasi LimeSurvey API
        const baseURL = "https://test.suxesstories.com";
        const username = "intern";
        const password = "Surabaya2024!?#";

        // Mendapatkan session key
        const sessionKeyResponse = await axios.post(`${baseURL}/admin/remotecontrol`, {
          method: "get_session_key",
          params: [username, password],
          id: 1,
        });

        const sessionKey = sessionKeyResponse.data.result;

        // Mendapatkan daftar survei
        const surveysResponse = await axios.post(`${baseURL}/admin/remotecontrol`, {
          method: "list_surveys",
          params: [sessionKey],
          id: 2,
        });

        const surveys = surveysResponse.data.result;

        // Filter hanya survei aktif
        const activeSurveys = surveys.filter((survey) => survey.active === "Y");

        // Simpan survei aktif sebagai daftar tes
        this.tests = activeSurveys.map((survey) => ({
          id: survey.sid, // ID survei
          title: survey.surveyls_title, // Judul survei
        }));

        // Hapus session key setelah selesai
        await axios.post(`${baseURL}/admin/remotecontrol`, {
          method: "release_session_key",
          params: [sessionKey],
          id: 3,
        });
      } catch (error) {
        console.error("Error fetching tests from LimeSurvey:", error);
        Swal.fire("Error", "Gagal mengambil data tes dari LimeSurvey.", "error");
      }
    },

    async fetchCompanies() {
      try {
        const querySnapshot = await getDocs(collection(db, "companies"));
        this.companies = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    },

    // Menampilkan detail event dan mengambil data company serta test terkait
    async viewselectedEvent(event) {
      this.selectedEvent = event; // Menyalin data event ke dalam selectedEvent
      this.showModal = true; // Menampilkan modal

      const eventRef = doc(db, "events", event.id);
      const eventDoc = await getDoc(eventRef);
      if (eventDoc.exists()) {
        this.selectedEvent = eventDoc.data();
      }

      const companyRef = doc(db, "companies", event.companyId);
      const companyDoc = await getDoc(companyRef);
      if (companyDoc.exists()) {
        this.selectedCompany = companyDoc.data();
      }

      if (this.selectedEvent.tests && this.selectedEvent.tests.length > 0) {
        const testsCollection = collection(db, "tests");
        const q = query(
          testsCollection,
          where(documentId(), "in", this.selectedEvent.tests)
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          this.selectedTests = querySnapshot.docs.map((doc) => doc.data());
        } else {
          this.selectedTests = [];
        }
      }
    },

    async updateEvent() {
      try {
        const eventRef = doc(db, "events", this.selectedEvent.id);
        await updateDoc(eventRef, {
          name: this.selectedEvent.name,
          description: this.selectedEvent.description,
          companyId: this.selectedEvent.companyId,
          // image: this.selectedEvent.image,
          date: this.selectedEvent.date,
          tests: this.selectedEvent.tests,
          payment: this.selectedEvent.payment,
          amount: this.selectedEvent.amount,
          results: this.selectedEvent.results,
        });

        Swal.fire("Sukses", "Event berhasil diperbarui", "success").then(() => {
          this.showModalEdit = false;

          // Reset form
          this.selectedEvent = {};
          this.selectedCompany = {};
          this.selectedTests = [];

          // Refresh data
          this.fetchEvents();
        });
      } catch (error) {
        console.error("Error updating event:", error);
        Swal.fire("Gagal", "Terjadi kesalahan saat memperbarui event", "error");
      }
    },
    downloadQRCode() {
      const link = document.createElement("a");
      link.href = this.selectedEvent.qrCode;
      link.download = "qr-code.png";
      link.click();
    },
    // Format tanggal ke format "30 Desember 2024"
    formatDate(dateString) {
      const months = [
        "Januari",
        "Februari",
        "Maret",
        "April",
        "Mei",
        "Juni",
        "Juli",
        "Agustus",
        "September",
        "Oktober",
        "November",
        "Desember",
      ];

      const date = new Date(dateString);
      const day = date.getDate();
      const month = months[date.getMonth()];
      const year = date.getFullYear();

      return `${day} ${month} ${year}`;
    },

    // Format nominal sebagai Rupiah (contoh: Rp. 1.000.000)
    formatRupiah(amount) {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        currency: "IDR",
        minimumFractionDigits: 0, // Menghilangkan angka desimal
        maximumFractionDigits: 0, // Menghilangkan angka desimal
      }).format(amount);
    },
    editEvent() {
      this.showModalEdit = true;
      this.showModal = false;
    },
    closeModal() {
      this.showModal = false;
    },
  },
  mounted() {
    this.fetchEvents();
    this.fetchTestsFromLimeSurvey(); // Ambil data tes dari LimeSurvey
    this.fetchCompanies();
  },
};
</script>

<style scoped>
.test-item {
  background-color: #285480;
  color: white;
}

.btn-edit-outline {
  border: 1px solid #285480;
  color: #285480;
}

.btn-save {
  background-color: #285480;
  color: white;
}

.btn-detail {
  background-color: #285480;
  color: white;
  border: none;
}

.card-description {
  display: -webkit-box;               /* Untuk WebKit browser seperti Safari */
  -webkit-box-orient: vertical;       /* Mengatur orientasi box menjadi vertikal untuk WebKit */
  -webkit-line-clamp: 2;              /* Membatasi teks menjadi 2 baris untuk WebKit */
  overflow: hidden;                   /* Menyembunyikan teks yang lebih panjang dari 2 baris */
  text-overflow: ellipsis;            /* Menambahkan elipsis di akhir teks terpotong */
  
  display: box;                       /* Standar untuk browser non-WebKit */
  box-orient: vertical;               /* Mengatur orientasi box menjadi vertikal untuk browser lainnya */
  line-clamp: 2;                      /* Membatasi teks menjadi 2 baris untuk browser lain */
}



.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
