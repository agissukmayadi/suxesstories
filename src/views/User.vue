<template>
  <main class="qrcode-page p-4">
    <h1>Talent</h1>

    <!-- Search and Filter Section -->
    <div class="row mb-3">
      <div class="col-md-10">
        <div class="input-group">
          <!-- Input Field -->
          <input type="text" class="form-control" v-model="searchQuery" placeholder="Search" />
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
        <select class="form-select" v-model="selectedEvent">
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
        <select class="form-select" v-model="selectedCompany">
          <option value="" disabled selected>Select Company</option>
          <option value="PT. Cipta Semesta">PT. Cipta Semesta</option>
          <option value="PT. Cipta Angkasa">PT. Cipta Angkasa</option>
          <option value="Yayasan Peduli Lansia">Yayasan Peduli Lansia</option>
        </select>
      </div>
    </div>

    <!-- Tabel Users -->
    <table class="table table-striped table-hover">
      <thead>
        <tr>
          <th>Nama</th>
          <th>Email</th>
          <th>Telepon</th>
          <th>Role</th>
          <th>Aksi</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in filteredUsers" :key="user.uid">
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.phone }}</td>
          <td>{{ user.role }}</td>
          <td>
            <button class="btn btn-primary me-2 btn-sm" @click="editUser(user)">
              Edit
            </button>
            <button class="btn btn-danger btn-sm" @click="deleteUser(user.uid)">
              Hapus
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal Tambah User -->
    <div v-if="showModal" class="modal" tabindex="-1" style="display: block">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              {{ currentUser.uid ? "Edit User" : "Tambah User" }}
            </h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="addUser">
              <div class="mb-3">
                <label for="name" class="form-label">Nama</label>
                <input type="text" id="name" v-model="currentUser.name" class="form-control" required />
              </div>
              <div class="row">
                <div class="col col-md-6">
                  <div class="mb-3">
                    <label for="email" class="form-label">Email</label>
                    <input type="email" id="email" v-model="currentUser.email" class="form-control" required />
                  </div>
                </div>
                <div class="col col-md-6">
                  <div class="mb-3">
                    <label for="phone" class="form-label">Telepon</label>
                    <input type="text" id="phone" v-model="currentUser.phone" class="form-control" required />
                  </div>
                </div>
              </div>
              <div class="mb-3">
                <label for="role" class="form-label">Role</label>
                <select id="role" v-model="currentUser.role" class="form-control" required>
                  <option value="" disabled>Pilih Role</option>
                  <option value="admin">Admin</option>
                  <option value="talent">Talent</option>
                </select>
              </div>
              <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input type="password" id="password" v-model="currentUser.password" class="form-control" required />
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
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc, updateDoc, setDoc } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import Swal from "sweetalert2";

export default {
  setup() {
    const db = getFirestore();
    const auth = getAuth();
    const users = ref([]);
    const showModal = ref(false);
    const currentUser = ref({
      uid: null,
      name: "",
      email: "",
      phone: "",
      role: "",
      password: "",
    });
    const searchQuery = ref("");
    const showFilter = ref(false);
    const selectedEvent = ref("");
    const selectedTest = ref("");
    const selectedCompany = ref("");

    // Fetch Users from Firestore
    const fetchUsers = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      users.value = querySnapshot.docs.map((doc) => doc.data());
    };

    // Close modal and reset currentUser
    const closeModal = () => {
      showModal.value = false;
      currentUser.value = { uid: null, name: "", email: "", phone: "", role: "", password: "" };
    };

    // Add or update user
    const addUser = async () => {
      try {
        if (currentUser.value.uid) {
          // Update user
          const userDoc = doc(db, "users", currentUser.value.uid);
          await updateDoc(userDoc, { ...currentUser.value });
          Swal.fire("Berhasil!", "User berhasil diperbarui", "success");
        } else {
          // Add new user
          const userCredential = await createUserWithEmailAndPassword(auth, currentUser.value.email, currentUser.value.password);
          const uid = userCredential.user.uid;
          await setDoc(doc(db, "users", uid), { ...currentUser.value, uid });
          Swal.fire("Berhasil!", "User berhasil ditambahkan", "success");
        }

        fetchUsers();
        closeModal();
      } catch (error) {
        Swal.fire("Gagal!", error.message, "error");
      }
    };

    // Delete user
    const deleteUser = async (uid) => {
      try {
        const userDoc = doc(db, "users", uid);
        await deleteDoc(userDoc);
        Swal.fire("Berhasil!", "User berhasil dihapus", "success");
        fetchUsers();
      } catch (error) {
        Swal.fire("Gagal!", error.message, "error");
      }
    };

    // Edit user
    const editUser = (user) => {
      currentUser.value = { ...user };
      showModal.value = true;
    };

    // Computed for filtered users
    const filteredUsers = computed(() => {
      if (!searchQuery.value) {
        return users.value;
      }
      return users.value.filter(user =>
        Object.values(user)
          .join(" ")
          .toLowerCase()
          .includes(searchQuery.value.toLowerCase())
      );
    });

    // Toggle filter visibility
    const toggleFilter = () => {
      showFilter.value = !showFilter.value;
    };

    // Fetch users on mount
    onMounted(() => {
      fetchUsers();
    });

    return {
      users,
      showModal,
      currentUser,
      searchQuery,
      showFilter,
      selectedEvent,
      selectedTest,
      selectedCompany,
      fetchUsers,
      closeModal,
      addUser,
      deleteUser,
      editUser,
      filteredUsers,
      toggleFilter,
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
