<template>
  <div class="d-flex">
    <!-- Sidebar -->
    <div :class="['sidebar', isCollapsed ? 'collapsed' : '', isMobile ? 'mobile-sidebar' : '']" id="sidebar" class="text-white">
      <div class="bg-white mb-3 d-flex justify-content-center">
        <img src="../assets/img/Logo-Success-Story.png" alt="Logo" class="w-75" style="max-width: 200px; height: auto;">
      </div>

      <div class="p-3">
        <h5 v-if="!isCollapsed" class="mb-4 border-bottom border-white border-2 pb-4">Cornerstone</h5>
        <ul class="nav flex-column text-start w-100">
          <li class="nav-item border border-white rounded-3 mb-3" v-for="item in menuItems" :key="item.name">
            <router-link :to="item.route" class="nav-link text-white py-1 sidebar-link">
              <i :class="item.icon"></i>
              <span v-if="!isCollapsed" class="ms-2">{{ item.name }}</span>
            </router-link>
          </li>
        </ul>
      </div>
    </div>
    
    <!-- Hamburger Menu Button -->
   <button v-if="isMobile" @click="toggleSidebar" class="hamburger-btn mt-3">
      <i class="bi" :class="isCollapsed ? 'bi-list' : 'bi-x'"></i>
    </button>


    <!-- Main content area -->
    <main :class="['content', isCollapsed ? 'collapsed-content' : '']">
      <slot></slot>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const isCollapsed = ref(false);
const isMobile = ref(false);

// Fungsi untuk toggle sidebar
const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value;
};

// Menambahkan event listener resize untuk mengatur responsivitas
const handleResize = () => {
  isMobile.value = window.innerWidth <= 768;
  if (isMobile.value) {
    isCollapsed.value = true; // Sidebar otomatis collapsed di layar kecil
  } else {
    isCollapsed.value = false; // Sidebar otomatis expanded di layar besar
  }
};


onMounted(() => {
  window.addEventListener('resize', handleResize);
  handleResize(); // Cek ukuran layar saat komponen pertama kali dimuat
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});

// Definisikan menu items dengan properti route
const menuItems = [
  { name: 'Dashboard', icon: 'bi bi-house', route: '/' },
  { name: 'Event', icon: 'bi bi-megaphone', route: '/event' },
  { name: 'Schedule', icon: 'bi bi-calendar', route: '/schedule' },
  { name: 'Company', icon: 'bi bi-upc-scan', route: '/company' },
];
</script>

<style scoped>
body {
  font-family: 'Poppins', sans-serif;
}

#sidebar {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: 250px;
  height: 100vh;
  background-color: #285480;
  z-index: 1000;
  transition: width 0.3s, transform 0.3s;
}

#sidebar.collapsed {
  width: 80px;
}

#sidebar.mobile-sidebar {
  transform: translateX(-100%);
}

#sidebar.mobile-sidebar:not(.collapsed) {
  transform: translateX(0);
}

.sidebar-link {
  display: flex;
  align-items: center;
}

.sidebar-link i {
  font-size: 1.25rem;
}

.collapsed .sidebar-link span {
  display: none;
}

.content {
  margin-left: 210px;
  transition: margin-left 0.3s;
}

.collapsed-content {
  margin-left: 80px;
}

.sidebar-link:hover {
  background-color: #4a85c3;
  color: white;
  border-radius: 8px;
}

.hamburger-btn {
  position: fixed;
  top: 10px;
  left: 10px;
  z-index: 1100;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #285480;
  cursor: pointer;
}

@media (max-width: 768px) {
  #sidebar {
    width: 250px;
    transform: translateX(-100%);
  }

  .content {
    margin-left: 0;
  }

  #sidebar:not(.collapsed) {
    transform: translateX(0);
  }
}
</style>
