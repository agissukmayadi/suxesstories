<template>
  <div class="app">
    <Sidebar v-if="$route.path !== '/login'" />
    <div class="w-100">
      <Navbar v-if="$route.path !== '/login'" />
      <div class="content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup>
import Sidebar from "./components/Sidebar.vue";
import Navbar from "./components/Navbar.vue";
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Poppins", sans-serif;
}

.app {
  display: flex;
  width: 100%; /* Pastikan .app mengambil seluruh lebar */
}

.content {
  flex-grow: 1; /* Pastikan konten mengambil sisa ruang yang tersedia */
  padding: 20px;
  /* Sesuaikan padding jika diperlukan */
}
</style>
