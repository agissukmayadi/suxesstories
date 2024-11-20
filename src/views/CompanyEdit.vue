<template>
  <main class="qrcode-page p-4">
    <div
      class="d-flex flex-column flex-md-row justify-content-between align-items-baseline"
    >
      <div>
        <h1>Company Profile</h1>
        <p>Update Company Profile Details Here!</p>
      </div>
      <div>
        <button class="btn btn-outline-secondary me-2" @click="goBack">
          Cancel
        </button>
        <button class="btn btn-primary btn-save" @click="updateCompany">
          Save
        </button>
      </div>
    </div>
    <div class="row mt-3">
      <h4>Public Profile</h4>
      <div class="col-10">
        <div class="row mt-3">
          <div class="col-12 col-md-3">
            <label for="name" class="form-label">Company Name</label>
          </div>
          <div class="col-12 col-md-9">
            <input
              type="text"
              id="name"
              class="form-control"
              required
              v-model="company.name"
            />
          </div>
        </div>
        <div class="row mt-3">
          <div class="col-12 col-md-3">
            <label for="email" class="form-label">Email</label>
          </div>
          <div class="col-12 col-md-9">
            <input
              type="email"
              id="email"
              class="form-control"
              v-model="company.email"
              required
            />
          </div>
        </div>
        <div class="row mt-3">
          <div class="col-12 col-md-3">
            <label for="phone" class="form-label">Phone</label>
          </div>
          <div class="col-12 col-md-9">
            <input
              type="text"
              id="phone"
              class="form-control"
              v-model="company.phone"
              required
            />
          </div>
        </div>
        <div class="row mt-3">
          <div class="col-12 col-md-3">
            <label for="address" class="form-label">Address</label>
          </div>
          <div class="col-12 col-md-9">
            <textarea
              type="text"
              id="address"
              class="form-control"
              v-model="company.address"
              required
            ></textarea>
          </div>
        </div>
        <div class="row mt-3">
          <div class="col-12 col-md-3">
            <label for="website" class="form-label">Website</label>
          </div>
          <div class="col-12 col-md-9">
            <input
              type="text"
              id="website"
              class="form-control"
              v-model="company.website"
              required
            />
          </div>
        </div>
      </div>
    </div>
    <div class="row mt-3">
      <h4>Social Media</h4>
      <div class="col-10">
        <div class="row mt-3">
          <div class="col-12 col-md-3">
            <label for="instagram" class="form-label">Instagram</label>
          </div>
          <div class="col-12 col-md-9">
            <input
              type="text"
              id="instagram"
              class="form-control"
              v-model="company.socialMedia.instagram"
              required
            />
          </div>
        </div>
        <div class="row mt-3">
          <div class="col-12 col-md-3">
            <label for="linkedin" class="form-label">Linkedin</label>
          </div>
          <div class="col-12 col-md-9">
            <input
              type="text"
              id="linkedin"
              class="form-control"
              v-model="company.socialMedia.linkedin"
              required
            />
          </div>
        </div>
        <div class="row mt-3">
          <div class="col-12 col-md-3">
            <label for="tiktok" class="form-label">Tiktok</label>
          </div>
          <div class="col-12 col-md-9">
            <input
              type="text"
              id="tiktok"
              class="form-control"
              v-model="company.socialMedia.tiktok"
              required
            />
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import { reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { getDoc, doc, updateDoc, getFirestore } from "firebase/firestore";
import Swal from "sweetalert2";

export default {
  setup() {
    const company = reactive({
      name: "",
      email: "",
      phone: "",
      address: "",
      website: "",
      socialMedia: {
        instagram: "",
        linkedin: "",
        tiktok: "",
      },
    });

    const router = useRouter();
    const companyId = router.currentRoute.value.params.id;
    const db = getFirestore();

    // Fetch data perusahaan saat komponen dimuat
    const fetchCompanyData = async () => {
      try {
        const docRef = doc(db, "companies", companyId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          company.name = data.name || "";
          company.email = data.email || "";
          company.phone = data.phone || "";
          company.address = data.address || "";
          company.website = data.website || "";
          company.socialMedia = {
            instagram: data.socialMedia?.instagram || "",
            linkedin: data.socialMedia?.linkedin || "",
            tiktok: data.socialMedia?.tiktok || "",
          };
        }
      } catch (error) {
        console.error("Error fetching company data:", error);
      }
    };

    const goBack = () => {
      router.go(-1);
    };
    // Simpan perubahan data perusahaan
    const updateCompany = async () => {
      try {
        const docRef = doc(db, "companies", companyId);
        await updateDoc(docRef, {
          name: company.name,
          email: company.email,
          phone: company.phone,
          address: company.address,
          website: company.website,
          socialMedia: {
            instagram: company.socialMedia.instagram,
            linkedin: company.socialMedia.linkedin,
            tiktok: company.socialMedia.tiktok,
          },
        });
        Swal.fire("Sukses", "Perubahan data perusahaan berhasil", "success");
      } catch (error) {
        console.error("Error updating company data:", error);
        Swal.fire(
          "Error",
          "Terjadi kesalahan saat memperbarui data Perusahaan",
          "error"
        );
      }
    };

    onMounted(fetchCompanyData);

    return {
      company,
      updateCompany,
      goBack,
    };
  },
};
</script>

<style scoped>
.btn-save {
  background-color: #285480;
}
</style>
