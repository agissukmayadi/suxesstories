<template>
  <main class="qrcode-page p-4">
    <h1>Daftar Company</h1>

    <!-- Fitur Search -->
    <div class="mb-3">
      <input
        type="text"
        class="form-control"
        v-model="searchQuery"
        placeholder="Cari perusahaan..."
      />
    </div>

    <!-- Tombol Tambah Perusahaan -->
    <button class="btn btn-primary mb-3" @click="showModal = true">
      Tambah Perusahaan
    </button>

    <!-- Tabel Perusahaan -->
    <table class="table table-striped table-hover">
      <thead>
        <tr>
          <th>Nama Perusahaan</th>
          <th>Email</th>
          <th>Telepon</th>
          <th>Alamat</th>
          <!-- <th>Website</th> -->
          <th>Aksi</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="company in filteredCompanies" :key="company.id">
          <td>{{ company.name }}</td>
          <td>{{ company.email }}</td>
          <td>{{ company.phone }}</td>
          <td>{{ company.address }}</td>
          <!-- <td>
            <a :href="company.website" target="_blank" v-if="company.website">
              {{ company.website }}
            </a>
            <span v-else>N/A</span>
          </td> -->
          <td>
            <button
              class="btn btn-primary me-2 btn-sm"
              @click="editCompany(company.id)"
            >
              Edit
            </button>
            <button
              class="btn btn-danger btn-sm"
              @click="deleteCompany(company.id)"
            >
              Hapus
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal Tambah Perusahaan -->
    <div v-if="showModal" class="modal" tabindex="-1" style="display: block">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Tambah Perusahaan</h5>
            <button
              type="button"
              class="btn-close"
              @click="closeModal"
            ></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="addCompany()">
              <div class="mb-3">
                <label for="name" class="form-label">Nama Perusahaan</label>
                <input
                  type="text"
                  id="name"
                  v-model="currentCompany.name"
                  class="form-control"
                  required
                />
              </div>
              <div class="row">
                <div class="col col-md-6">
                  <div class="mb-3">
                    <label for="email" class="form-label">Email</label>
                    <input
                      type="email"
                      id="email"
                      v-model="currentCompany.email"
                      class="form-control"
                      required
                    />
                  </div>
                </div>
                <div class="col col-md-6">
                  <div class="mb-3">
                    <label for="phone" class="form-label">Telepon</label>
                    <input
                      type="text"
                      id="phone"
                      v-model="currentCompany.phone"
                      class="form-control"
                      required
                    />
                  </div>
                </div>
              </div>

              <div class="mb-3">
                <label for="address" class="form-label">Alamat</label>
                <textarea
                  type="text"
                  id="address"
                  v-model="currentCompany.address"
                  class="form-control"
                  required
                ></textarea>
              </div>
              <div class="mb-3">
                <label for="website" class="form-label">Website</label>
                <input
                  type="url"
                  id="website"
                  v-model="currentCompany.website"
                  class="form-control"
                />
              </div>
              <!-- <div class="mb-3">
                <label for="logo" class="form-label">Logo</label>
                <input
                  type="file"
                  id="logo"
                  @change="onLogoSelected"
                  class="form-control"
                />
              </div> -->
              <p class="fw-semibold">Social Media</p>
              <div class="mb-3">
                <label for="instagram" class="form-label">Instagram</label>
                <input
                  type="url"
                  id="instagram"
                  v-model="currentCompany.socialMedia.instagram"
                  class="form-control"
                />
              </div>
              <div class="mb-3">
                <label for="linkedin" class="form-label">LinkedIn</label>
                <input
                  type="url"
                  id="linkedin"
                  v-model="currentCompany.socialMedia.linkedin"
                  class="form-control"
                />
              </div>
              <div class="mb-3">
                <label for="tiktok" class="form-label">TikTok</label>
                <input
                  type="url"
                  id="tiktok"
                  v-model="currentCompany.socialMedia.tiktok"
                  class="form-control"
                />
              </div>
              <button type="submit" class="btn btn-primary">Simpan</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
// import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import Swal from "sweetalert2";
import { useRouter } from "vue-router";

export default {
  setup() {
    const db = getFirestore();
    const companies = ref([]);
    const showModal = ref(false);
    const router = useRouter();
    const currentCompany = ref({
      id: null,
      name: "",
      email: "",
      phone: "",
      address: "",
      website: "",
      // logo: null, // Untuk menyimpan file logo
      socialMedia: {
        instagram: "",
        linkedin: "",
        tiktok: "",
      },
    });
    const searchQuery = ref("");

    // const storage = getStorage();
    // const onLogoSelected = (event) => {
    //   const file = event.target.files[0];
    //   if (file) {
    //     currentCompany.value.logo = file; // Simpan file di state
    //   }
    // };

    // Fetch companies from Firestore
    const fetchCompanies = async () => {
      const querySnapshot = await getDocs(collection(db, "companies"));
      companies.value = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          ...data,
        };
      });
    };

    // Add a new company
    const addCompany = async () => {
      try {
        const companyData = { ...currentCompany.value, createdAt: new Date() };

        // Upload logo ke Firebase Storage jika ada file
        // if (companyData.logo) {
        //   const logoRef = storageRef(
        //     storage,
        //     `logos/${Date.now()}_${companyData.logo.name}`
        //   );
        //   await uploadBytes(logoRef, companyData.logo);
        //   const logoUrl = await getDownloadURL(logoRef);
        //   companyData.logo = logoUrl; // Simpan URL logo
        // } else {
        //   companyData.logo = null; // Jika tidak ada logo
        // }

        // Simpan data perusahaan ke Firestore
        const docRef = await addDoc(collection(db, "companies"), {
          ...companyData,
        });

        // Update ID dokumen
        await updateDoc(docRef, { id: docRef.id });

        Swal.fire("Sukses", "Perusahaan berhasil ditambahkan", "success");
        closeModal();
        fetchCompanies();
      } catch (error) {
        Swal.fire(
          "Error",
          "Terjadi kesalahan saat menambahkan perusahaan",
          "error"
        );
      }
    };

    // Edit a company
    const editCompany = (companyId) => {
      router.push("/company/edit/" + companyId);
    };

    // Delete a company
    const deleteCompany = async (companyId) => {
      Swal.fire({
        title: "Apakah Anda yakin?",
        text: "Data perusahaan ini akan dihapus!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Hapus",
        cancelButtonText: "Batal",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const companyRef = doc(db, "companies", companyId);
            await deleteDoc(companyRef);
            Swal.fire("Sukses", "Perusahaan berhasil dihapus", "success");
            fetchCompanies();
          } catch (error) {
            Swal.fire(
              "Error",
              "Terjadi kesalahan saat menghapus perusahaan",
              "error"
            );
          }
        }
      });
    };

    // Close modal and reset form
    const closeModal = () => {
      showModal.value = false;
      currentCompany.value = {
        id: null,
        name: "",
        email: "",
        phone: "",
        address: "",
        website: "",
        // logo: null,
        socialMedia: {
          instagram: "",
          linkedin: "",
          tiktok: "",
        },
      };
    };

    // Filter companies based on search query
    const filteredCompanies = computed(() => {
      if (!searchQuery.value) {
        return companies.value;
      }
      return companies.value.filter(
        (company) =>
          company.name
            .toLowerCase()
            .includes(searchQuery.value.toLowerCase()) ||
          company.email
            .toLowerCase()
            .includes(searchQuery.value.toLowerCase()) ||
          company.phone
            .toLowerCase()
            .includes(searchQuery.value.toLowerCase()) ||
          company.address
            .toLowerCase()
            .includes(searchQuery.value.toLowerCase())
      );
    });

    onMounted(() => {
      fetchCompanies();
    });

    return {
      companies,
      showModal,
      currentCompany,
      fetchCompanies,
      addCompany,
      deleteCompany,
      closeModal,
      searchQuery,
      filteredCompanies,
      editCompany,
    };
  },
};
</script>

<style scoped>
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
