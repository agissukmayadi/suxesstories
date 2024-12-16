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
  width: 100%; 
}

.content {
  flex-grow: 1; 
  padding: 20px;
}

@media (max-width: 768px) {
  .content {
    padding: 8px;
  }
}

@media (max-width: 480px) {
  .content {
    padding: 5px; 
  }
}
</style>
