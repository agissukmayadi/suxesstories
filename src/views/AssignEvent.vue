<template>
  <div class="container">
    <!-- Cek apakah event ditemukan -->
    <div v-if="eventNotFound">
      <h4 class="text-center text-danger">
        Event Not Found or Event Date is Over
      </h4>
    </div>
    <div v-else>
      <div>
        <h4>{{ selectedEvent.name }}</h4>
        <p>{{ selectedEvent.description }}</p>
        <p><strong>Event Date:</strong> {{ selectedEvent.date }}</p>

        <div v-if="selectedCompany.name">
          <h5>Company Information:</h5>
          <p><strong>Name:</strong> {{ selectedCompany.name }}</p>
          <p><strong>Email:</strong> {{ selectedCompany.email }}</p>
          <!-- Display other company info -->
        </div>

        <div v-if="selectedTests.length">
          <h5>Tests for the Event:</h5>
          <ul>
            <li v-for="(test, index) in selectedTests" :key="index">
              {{ test.name }} - {{ test.description }}
            </li>
          </ul>
        </div>

        <p>
          Payment :
          {{
            selectedEvent.payment ? formatRupiah(selectedEvent.amount) : "Rp. 0"
          }}
        </p>
      </div>
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
        <button type="submit" class="btn btn-primary">Submit</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { getFirestore, doc, getDoc, collection } from "firebase/firestore";

const route = useRoute();
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
  companyId: null,
  name: null,
  description: null,
  date: null,
  tests: [],
  payment: false,
  amount: null,
  createdAt: null,
  qrCode: null,
});

const selectedCompany = reactive({
  id: null,
  name: null,
  email: null,
  phone: null,
  address: null,
  website: null,
  socialMedia: {
    tiktok: null,
    instagram: null,
    linkedin: null,
  },
});

const selectedTests = reactive([]);

const eventNotFound = ref(false);

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
  const db = getFirestore();
  try {
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

      const companyDocRef = doc(db, "companies", eventData.companyId);
      const companyDoc = await getDoc(companyDocRef);
      if (companyDoc.exists()) {
        const companyData = companyDoc.data();
        selectedCompany.id = companyDoc.id;
        selectedCompany.name = companyData.name;
        selectedCompany.email = companyData.email;
        selectedCompany.phone = companyData.phone;
        selectedCompany.address = companyData.address;
        selectedCompany.website = companyData.website;
        selectedCompany.socialMedia = companyData.socialMedia;
      }

      for (const testId of eventData.tests) {
        const testDocRef = doc(db, "tests", testId);
        const testDoc = await getDoc(testDocRef);
        if (testDoc.exists()) {
          selectedTests.push(testDoc.data());
        }
      }

      const eventDate = new Date(eventData.date);
      const currentDate = new Date();
      if (eventDate < currentDate) {
        eventNotFound.value = true;
      }
    } else {
      eventNotFound.value = true;
    }
  } catch (error) {
    console.error("Error fetching event:", error);
    eventNotFound.value = true;
  }
});

const submitForm = async () => {
  // try {
  //   const response = await fetch("http://localhost:3000/assign-event", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       event: selectedEvent,
  //       company: selectedCompany,
  //       tests: selectedTests,
  //       form: form,
  //     }),
  //   });
  //   if (response.data.token) {
  //     window.snap.pay(response.data.token, {
  //       onSuccess: function (result) {
  //         alert("Payment success!");
  //         console.log(result);
  //       },
  //       onPending: function (result) {
  //         alert("Payment pending!");
  //         console.log(result);
  //       },
  //       onError: function (result) {
  //         alert("Payment failed!");
  //         console.log(result);
  //       },
  //     });
  //   } else {
  //     alert(response.data.message);
  //   }
  // } catch (error) {
  //   console.error("Error:", error);
  //   alert("An error occurred. Please try again later.");
  // }
};
</script>

<style scoped>
/* Styling tambahan jika diperlukan */
</style>
