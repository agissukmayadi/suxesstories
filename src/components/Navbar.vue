<template>
  <!-- Header with Search and Icons -->
  <div class="Navbar d-flex justify-content-end align-items-center p-3 m-2 text-white">
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

    // Logout function
    const logout = async () => {
      const auth = getAuth();
      try {
        await signOut(auth);
        router.push("/login"); // Redirect to login page after logout
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
  background: linear-gradient(90deg, rgba(255, 255, 255, 1) 0%, rgba(38, 92, 127, 1) 65%);
  margin-top : 5px;
  border-radius: 8px; 
  margin-left: 50px;
}
</style>
