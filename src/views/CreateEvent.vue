<template>
  <div class="content p-0">
    <h4 class="m-0 mb-3 border-bottom" style="padding-bottom: 8px">
      Tambahkan Event
    </h4>
    <form @submit.prevent="submitForm">
      <div class="mb-3">
        <label for="company" class="form-label">Perusahaan</label>
        <select
          id="company"
          class="form-select"
          v-model="form.companyId"
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
          <div class="col-3" v-for="test in tests" :key="test.id">
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

      <button type="submit" class="btn btn-primary">Add Event</button>
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
        companyId: "",
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
      },
      companies: [], // Data perusahaan
      tests: [], // Data test
    };
  },
  methods: {
    async fetchCompanies() {
      try {
        const db = getFirestore();
        const querySnapshot = await getDocs(collection(db, "companies"));
        this.companies = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    },
    async fetchTestsFromLimeSurvey() {
  try {
    const baseURL = "https://test.suxesstories.com";
    const username = "intern";
    const password = "Surabaya2024!?#";

    // Dapatkan session key dari LimeSurvey
    const sessionKeyResponse = await axios.post(`${baseURL}/admin/remotecontrol`, {
      method: "get_session_key",
      params: [username, password],
      id: 1,
    });

    const sessionKey = sessionKeyResponse.data.result;

    // Ambil daftar survei dari LimeSurvey
    const surveysResponse = await axios.post(`${baseURL}/admin/remotecontrol`, {
      method: "list_surveys",
      params: [sessionKey],
      id: 2,
    });

    const surveys = surveysResponse.data.result;

    // Filter survei aktif
    const activeSurveys = surveys.filter((survey) => survey.active === "Y");

    // Simpan survei ke Firestore
    const testsCollection = collection(db, "tests"); // Gunakan koleksi Firebase yang sesuai

    for (const survey of activeSurveys) {
      const newTestRef = doc(testsCollection, survey.sid); // Gunakan `sid` sebagai ID dokumen
      const testDoc = await getDoc(newTestRef);

      if (!testDoc.exists()) {
        await setDoc(newTestRef, {
          idSurvey: survey.sid,
          title: survey.surveyls_title,
          description: survey.surveyls_description || "",
          active: true, // Hanya tes aktif yang masuk
        });

        console.log(`Tes aktif disimpan: ${survey.surveyls_title}`);
      } else {
        console.log(`Tes sudah ada: ${survey.surveyls_title}`);
      }
    }

    // Update state dengan data tes aktif
    this.tests = activeSurveys.map((survey) => ({
      id: survey.sid, // Sesuaikan ID dengan checkbox di template
      title: survey.surveyls_title,
    }));

    console.log("Tes aktif disimpan ke state:", this.tests);

    // Lepaskan session key dari LimeSurvey
    await axios.post(`${baseURL}/admin/remotecontrol`, {
      method: "release_session_key",
      params: [sessionKey],
      id: 3,
    });

    console.log("Session key berhasil dilepaskan");
  } catch (error) {
    console.error("Error fetching tests from LimeSurvey:", error);
    Swal.fire("Error", "Gagal mengambil data tes dari LimeSurvey.", "error");
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
        companyId: "",
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
    this.fetchCompanies();
    this.fetchTestsFromLimeSurvey();

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
/* Tidak diperlukan styling tambahan */
</style>
