<template>
  <div class="content p-0">
    <h4 class="m-0 mb-3 border-bottom" style="padding-bottom: 8px">
      Tambahkan Event
    </h4>
    <form @submit.prevent="submitForm">
      <div class="mb-3">
        <label for="name" class="form-label">Nama Event</label>
        <input
          type="text"
          id="name"
          class="form-control"
          v-model="form.name"
          required
        />
      </div>

      <div class="mb-3">
        <label for="description" class="form-label">Deskripsi</label>
        <textarea
          type="text"
          id="description"
          class="form-control"
          v-model="form.description"
          required
        ></textarea>
      </div>

      <div class="mb-3">
        <label for="image" class="form-label">Gambar</label>
        <input type="file" id="image" class="form-control" required disabled />
      </div>

      <div class="mb-3">
        <label for="date" class="form-label">Tanggal</label>
        <input
          type="date"
          id="date"
          class="form-control"
          v-model="form.date"
          :min="today"
          required
        />
      </div>

      <div class="mb-3">
        <label class="form-label">Pilih Test</label>
        <div class="row g-2">
          <p v-if="isLoadingTest">Loading ...</p>
          <div class="col-3" v-for="test in tests" :key="test.id" v-else>
            <div class="form-check">
              <input
                class="form-check-input"
                type="checkbox"
                :id="test.id"
                :value="test.id"
                v-model="form.tests"
              />
              <label class="form-check-label" :for="test.id">
                {{ test.title }}
              </label>
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
              v-model="form.results.company"
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
              v-model="form.results.talent"
            />
            <label class="form-check-label"> Talent </label>
          </div>
        </div>
      </div>

      <div class="mb-3 d-flex align-items-center">
        <label class="form-label me-3">Payment</label>
        <input type="checkbox" v-model="form.payment" />
        <input
          type="number"
          class="form-control ms-3"
          v-model="form.amount"
          placeholder="Nominal"
          :disabled="!form.payment"
        />
      </div>

      <button type="submit" class="btn btn-1">Add Event</button>
    </form>
  </div>
</template>

<script>
import {
  collection,
  addDoc,
  getDocs,
  getFirestore,
  setDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import Swal from "sweetalert2";
import QRCode from "qrcode";
import axios from "axios";

const db = getFirestore();

export default {
  data() {
    return {
      form: {
        name: "",
        description: "",
        image: null,
        date: "",
        tests: [],
        payment: true,
        amount: null,
        results: {
          company: true,
          talent: false,
        },
      },
      isLoadingTest: false,
      tests: [], // Data test
    };
  },
  methods: {
    async fetchTestsAndSurveys() {
      this.isLoadingTest = true;
      try {
        const [testsSnapshot, surveysResponse] = await Promise.all([
          getDocs(collection(db, "tests")), // Ambil data tes dari Firestore
          axios.post("http://localhost:5000/api/fetch-surveys"), // Ambil survei dari backend
        ]);

        // Proses hasil tests
        this.tests = testsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        if (surveysResponse.data && surveysResponse.data.savedSurveys) {
          this.tests = this.tests.concat(
            surveysResponse.data.savedSurveys.map((survey) => ({
              id: survey.idSurvey,
              title: survey.title,
            }))
          );
        }

        this.isLoadingTest = false;
        console.log("Tests and Surveys fetched successfully:", this.tests);
      } catch (error) {
        this.isLoadingTest = false;
        console.error("Error fetching tests and surveys:", error);
      }
    },
    async submitForm() {
      try {
        const db = getFirestore();
        const docRef = doc(collection(db, "events"));
        const eventData = {
          ...this.form,
          id: docRef.id,
          createdAt: new Date(),
        };

        // Simpan event ke database
        await setDoc(docRef, eventData);

        // Generate QR Code untuk URL assign event
        const eventUrl = `${window.location.origin}/assign-event/${docRef.id}`;
        const qrCodeDataUrl = await QRCode.toDataURL(eventUrl);

        // Update event dengan data QR Code
        await setDoc(docRef, { ...eventData, qrCode: qrCodeDataUrl });

        // Tampilkan notifikasi sukses
        Swal.fire(
          "Sukses",
          "Event berhasil ditambahkan dan QR Code dibuat",
          "success"
        ).then(() => {
          this.resetForm();
          this.$router.push("/event");
        });
      } catch (error) {
        console.error("Error adding event:", error);
        Swal.fire("Error", "Terjadi kesalahan saat menambahkan event", "error");
      }
    },
    resetForm() {
      this.form = {
        name: "",
        description: "",
        image: null,
        date: "",
        tests: [],
        payment: false,
        amount: null,
        results: {
          company: true,
          talent: false,
        },
      };
    },
  },
  mounted() {
    this.fetchTestsAndSurveys();

    const urlDate = this.$route.query.date;
    if (urlDate) {
      this.form.date = urlDate; // Setel nilai form.date dengan parameter date
    }
  },
  computed: {
    today() {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const day = String(today.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    },
  },
};
</script>

<style scoped>
.btn-1 {
  background-color: #285480;
  color: white;
}
</style>
