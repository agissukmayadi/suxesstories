<template>
  <div class="container">
    <!-- Cek apakah event ditemukan -->
    <div v-if="eventNotFound">
      <h4 class="text-center text-danger">
        {{ eventNotFoundMessage }}
      </h4>
    </div>
    <div v-else>
      <form
        @submit.prevent="submitForm"
        class="bg-light p-4 rounded border mx-auto"
      >
        <h4 class="mb-3 border-bottom" style="padding-bottom: 8px">
          Form Data Diri Talents
        </h4>
        <div class="mb-3">
          <label for="name" class="form-label">Nama Lengkap</label>
          <input
            type="text"
            id="name"
            class="form-control"
            placeholder="Masukkan nama lengkap"
            v-model="form.name"
            required
          />
        </div>
        <div class="mb-3">
          <label for="email" class="form-label">Alamat Email</label>
          <input
            type="email"
            id="email"
            class="form-control"
            placeholder="Masukkan alamat email"
            v-model="form.email"
            required
          />
        </div>
        <div class="mb-3">
          <label for="birthDate" class="form-label">Tanggal Lahir</label>
          <input
            type="date"
            id="birthDate"
            class="form-control"
            v-model="form.birthDate"
            required
          />
        </div>
        <div class="mb-3">
          <label for="city" class="form-label">Kota Domisili</label>
          <input
            type="text"
            id="city"
            class="form-control"
            placeholder="Masukkan kota domisili"
            v-model="form.city"
            required
          />
        </div>
        <div class="mb-3">
          <label for="phone" class="form-label">Nomor Handphone</label>
          <input
            type="tel"
            id="phone"
            class="form-control"
            placeholder="Masukkan nomor handphone"
            v-model="form.phone"
            required
          />
        </div>
        <div class="mb-3">
          <label class="form-label">Jenis Kelamin</label>
          <div>
            <div class="form-check form-check-inline">
              <input
                type="radio"
                id="perempuan"
                name="gender"
                class="form-check-input"
                value="Perempuan"
                v-model="form.gender"
                required
              />
              <label for="perempuan" class="form-check-label">Perempuan</label>
            </div>
            <div class="form-check form-check-inline">
              <input
                type="radio"
                id="lakiLaki"
                name="gender"
                class="form-check-input"
                value="Laki-Laki"
                v-model="form.gender"
                required
              />
              <label for="lakiLaki" class="form-check-label">Laki-Laki</label>
            </div>
          </div>
        </div>
        <button type="submit" class="btn btn-primary btn-1">Submit</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import {
  getFirestore,
  doc,
  getDoc,
  collection,
  setDoc,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import axios from "axios";

const route = useRoute();
const router = useRouter();
const form = reactive({
  name: "",
  email: "",
  birthDate: "",
  city: "",
  phone: "",
  gender: "",
});

const selectedEvent = reactive({
  id: null,
  name: null,
  description: null,
  date: null,
  tests: [],
  payment: false,
  amount: null,
  createdAt: null,
  qrCode: null,
});

const selectedTests = reactive([]);

const eventNotFound = ref(false);
const eventNotFoundMessage = ref("");

const formatRupiah = (amount) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

onMounted(async () => {
  try {
    const auth = getAuth();
    const db = getFirestore();

    // Monitor autentikasi pengguna
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log("User is logged in:", user);

        // Ambil data user dari koleksi Firestore
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();

          // Isi form dengan data user
          form.name = userData.name || "";
          form.email = userData.email || "";
          form.phone = userData.phone || "";
        } else {
          console.warn("User document does not exist in Firestore.");
        }
      } else {
        console.warn("No user is logged in.");
      }
    });

    const eventId = route.params.id;
    const eventDocRef = doc(db, "events", eventId);
    const eventDoc = await getDoc(eventDocRef);

    if (eventDoc.exists()) {
      const eventData = eventDoc.data();
      selectedEvent.id = eventDoc.id;
      selectedEvent.name = eventData.name;
      selectedEvent.description = eventData.description;
      selectedEvent.date = eventData.date;
      selectedEvent.payment = eventData.payment;
      selectedEvent.amount = eventData.amount;
      selectedEvent.createdAt = eventData.createdAt;
      selectedEvent.qrCode = eventData.qrCode;
      selectedEvent.tests = eventData.tests;

      for (const testId of eventData.tests) {
        const testDocRef = doc(db, "tests", testId);
        const testDoc = await getDoc(testDocRef);
        if (testDoc.exists()) {
          selectedTests.push(testDoc.data());
        }
      }

      const currentDate = new Date().setHours(0, 0, 0, 0);
      const eventDate = new Date(eventData.date).setHours(0, 0, 0, 0);
      if (currentDate == eventDate) {
        eventNotFound.value = false;
      } else if (currentDate < eventDate) {
        eventNotFoundMessage.value = "Event belum dimulai.";
        eventNotFound.value = true;
      } else if (currentDate > eventDate) {
        eventNotFoundMessage.value = "Event sudah ditutup.";
        eventNotFound.value = true;
      }
    } else {
      eventNotFoundMessage.value = "Event tidak ditemukan.";
      eventNotFound.value = true;
    }
  } catch (error) {
    console.error("Error fetching event:", error);
    eventNotFound.value = true;
  }
});

const addRegistration = async () => {
  try {
    const response = await axios.post(
      "http://localhost:5000/api/assign-survey",
      {
        eventName: selectedEvent.name,
        participant: {
          name: form.name,
          email: form.email,
        },
        surveys: selectedTests,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 200) {
      const { tokens } = response.data;
      console.log("Tokens:", tokens);

      const auth = getAuth();
      const db = getFirestore();

      // Ambil user login saat ini
      const user = auth.currentUser;
      if (!user) {
        alert("Anda harus login untuk mendaftar.");
        return;
      }

      // Ambil ID event dari route
      const eventId = selectedEvent.id;

      // Siapkan data yang akan disimpan
      const registrationData = {
        uid: user.uid, // Referensi pengguna
        event: {
          id: eventId, // Referensi event
          name: selectedEvent.name,
        }, // Referensi event
        tests: selectedTests.map((test, index) => ({
          idSurvey: test.idSurvey,
          title: test.title,
          token: tokens[test.idSurvey], // Tambahkan token untuk setiap survei
        })),
        name: form.name,
        email: form.email,
        birthDate: form.birthDate,
        city: form.city,
        phone: form.phone,
        gender: form.gender,
        createdAt: new Date().toISOString(), // Waktu pendaftaran
      };

      console.log(registrationData);

      // Simpan ke koleksi baru di Firestore
      const registrationsRef = collection(db, "registrations");
      await setDoc(doc(registrationsRef), registrationData);

      // Redirect ke halaman success
      router.push("/success");
    }

    // Object.keys(form).forEach((key) => (form[key] = ""));
  } catch (error) {
    console.error("Error saat menyimpan data pendaftaran:", error);
    alert("Terjadi kesalahan saat mendaftar. Silakan coba lagi.");
  }
};

const submitForm = async () => {
  try {
    const response = await axios.post(
      "http://localhost:5000/api/assign-event",
      {
        event: selectedEvent,
        tests: selectedTests,
        form: form,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log(response.data);
    if (response.data.paymentToken) {
      window.snap.pay(response.data.paymentToken, {
        onSuccess: function (result) {
          console.log(result);
          addRegistration();
        },
        onPending: function (result) {
          console.log(result);
        },
        onError: function (result) {
          console.log(result);
        },
      });
    } else {
      addRegistration();
    }
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred. Please try again later.");
  }
};
</script>

<style scoped>
.btn-1 {
  background-color: #285480;
  color: white;
}
</style>
