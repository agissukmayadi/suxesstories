<template>
  <!-- Header with Search and Icons -->
  <div
    class="Navbar d-flex justify-content-end align-items-center mb-4 p-3 text-white"
  >
    <!-- Icons Section -->
    <div class="d-flex gap-3">
      <i class="bi bi-person fs-4"></i>
      <i
        class="bi bi-box-arrow-right fs-4"
        style="cursor: pointer"
        @click="logout"
      ></i>
    </div>
  </div>
</template>

<script>
import { getAuth, signOut } from "firebase/auth";
import { useRouter } from "vue-router";

export default {
  setup() {
    const router = useRouter();

    // Fungsi logout
    const logout = async () => {
      const auth = getAuth();
      try {
        await signOut(auth);
        router.push("/login"); // Redirect ke halaman login setelah logout
      } catch (error) {
        console.error("Logout error:", error.message);
      }
    };

    return {
      logout,
    };
  },
};
</script>

<style scoped>
.Navbar {
  background: rgb(255, 255, 255);
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 1) 0%,
    rgba(38, 92, 127, 1) 65%
  );
}
</style>
