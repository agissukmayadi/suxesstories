<template>
  <main class="qrcode-page p-4">
    <h3 class="mb-4">Daftar Users</h3>

    <!-- Fitur Search dan Tombol Tambah User -->
    <div class="d-flex flex-wrap justify-content-between align-items-center mb-3">
      <input
        type="text"
        class="form-control me-2 mb-2 mb-md-0"
        v-model="searchQuery"
        placeholder="Cari user..."
        style="flex: 1;"
      />
      <button class="btn btn-1 ms-2" @click="showModal = true">
        Tambah User
      </button>
    </div>

    <!-- Tabel Users -->
    <div class="table-responsive">
      <table class="table table-striped table-hover">
        <thead class="table-light">
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
              <button class="btn btn-1 me-2 btn-sm" @click="editUser(user)">
                <i class="bi bi-pencil"></i>
              </button>
              <button class="btn btn-danger btn-sm" @click="deleteUser(user.uid)">
                <i class="bi bi-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal Tambah User -->
    <div v-if="showModal" class="modal" tabindex="-1" style="display: block;">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              {{ currentUser.uid ? "Edit User" : "Tambah User" }}
            </h5>
            <button
              type="button"
              class="btn-close"
              @click="closeModal"
            ></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="addUser">
              <div class="mb-3">
                <label for="name" class="form-label">Nama</label>
                <input
                  type="text"
                  id="name"
                  v-model="currentUser.name"
                  class="form-control"
                  required
                />
              </div>
              <div class="row">
                <div class="col-12 col-md-6">
                  <div class="mb-3">
                    <label for="email" class="form-label">Email</label>
                    <input
                      type="email"
                      id="email"
                      v-model="currentUser.email"
                      class="form-control"
                      required
                    />
                  </div>
                </div>
                <div class="col-12 col-md-6">
                  <div class="mb-3">
                    <label for="phone" class="form-label">Telepon</label>
                    <input
                      type="text"
                      id="phone"
                      v-model="currentUser.phone"
                      class="form-control"
                      required
                    />
                  </div>
                </div>
              </div>
              <div class="mb-3">
                <label for="role" class="form-label">Role</label>
                <select
                  id="role"
                  v-model="currentUser.role"
                  class="form-control"
                  required
                >
                  <option value="" disabled>Pilih Role</option>
                  <option value="admin">Admin</option>
                  <option value="talent">Talent</option>
                </select>
              </div>
              <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input
                  type="password"
                  id="password"
                  v-model="currentUser.password"
                  class="form-control"
                  required
                />
              </div>
              <button type="submit" class="btn btn-1 w-100">Simpan</button>
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
  deleteDoc,
  doc,
  updateDoc,
  setDoc,
} from "firebase/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateCurrentUser,
} from "firebase/auth";
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

    const fetchUsers = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      users.value = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
      }));
    };

    const closeModal = () => {
      showModal.value = false;
      currentUser.value = {
        uid: null,
        name: "",
        email: "",
        phone: "",
        role: "",
        password: "",
      };
    };

    const addUser = async () => {
      try {
        const adminUser = auth.currentUser;

        if (currentUser.value.uid) {
          // Update user if UID exists
          const userDoc = doc(db, "users", currentUser.value.uid);
          await updateDoc(userDoc, {
            name: currentUser.value.name,
            email: currentUser.value.email,
            phone: currentUser.value.phone,
            role: currentUser.value.role,
          });
          Swal.fire("Berhasil!", "User berhasil diperbarui", "success");
        } else {
          // Add new user
          const userCredential = await createUserWithEmailAndPassword(
            auth,
            currentUser.value.email,
            currentUser.value.password
          );
          const uid = userCredential.user.uid;

          await setDoc(doc(db, "users", uid), {
            uid: uid,
            name: currentUser.value.name,
            email: currentUser.value.email,
            phone: currentUser.value.phone,
            role: currentUser.value.role,
          });
          Swal.fire("Berhasil!", "User berhasil ditambahkan", "success");
        }

        // Kembalikan sesi admin tanpa perlu login ulang
        await updateCurrentUser(auth, adminUser);

        fetchUsers();
        closeModal();
      } catch (error) {
        Swal.fire("Gagal!", error.message, "error");
      }
    };

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

    const editUser = (user) => {
      currentUser.value = { ...user };
      showModal.value = true;
    };

    const filteredUsers = computed(() => {
      if (!searchQuery.value) {
        return users.value;
      }
      return users.value.filter((user) =>
        Object.values(user)
          .join(" ")
          .toLowerCase()
          .includes(searchQuery.value.toLowerCase())
      );
    });

    onMounted(() => {
      fetchUsers();
    });

    return {
      users,
      showModal,
      currentUser,
      fetchUsers,
      closeModal,
      addUser,
      deleteUser,
      editUser,
      searchQuery,
      filteredUsers,
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

.btn-1{
  background-color: #265c7f;
  color: white;
}
</style>
