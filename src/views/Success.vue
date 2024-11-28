<template>
  <div class="text-center p-5">
    <i
      class="bi bi-envelope-check mb-3"
      style="font-size: 50px; color: #285480"
    ></i>
    <h4>Perhatian!</h4>
    <p>
      Link test sudah dikirimkan ke email Anda. Silakan cek secara berkala email
      Anda.
    </p>
    <button @click="redirectHome" class="btn btn-1 mt-3">Oke</button>
  </div>
</template>
<script setup>
import { useRouter } from "vue-router";
const router = useRouter();
const redirectHome = () => {
  router.push("/talent-dashboard"); // Navigasi ke halaman utama
};
</script>
<style scoped>
.btn-1 {
  background-color: #285480;
  color: white;
}
</style>
