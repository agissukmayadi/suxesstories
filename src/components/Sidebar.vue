<template>
  <div class="d-flex">
    <!-- Sidebar -->
    <div
      :class="['sidebar', isCollapsed ? 'collapsed' : '', isMobile ? 'mobile-sidebar' : '']"
      id="sidebar"
      class="text-white"
    >
      <div class="bg-white mb-3 d-flex justify-content-center">
        <img
          src="../assets/img/Logo-Success-Story.png"
          alt="Logo"
          class="logo w-75"
          style="max-width: 200px; height: auto"
        />
      </div>

      <div class="p-3">
        <h5 class="mb-4 border-bottom border-white border-2 pb-4 text-center" :class="{'small-text': isCollapsed}">
          Cornerstone
        </h5>
        <ul class="nav flex-column text-start w-100">
          <li
            class="nav-item border border-white rounded-3 mb-3"
            v-for="item in filteredMenuItems"
            :key="item.name"
            @click="setActiveMenu(item.name)"
            :class="{ active: activeMenu === item.name }"
          >
            <router-link :to="item.route" class="nav-link text-white py-1 sidebar-link">
              <i :class="item.icon"></i>
              <span class="ms-2">{{ item.name }}</span>
            </router-link>
          </li>
        </ul>
      </div>
    </div>

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
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { getAuth } from 'firebase/auth'; // Firebase Authentication
import { getFirestore, doc, getDoc } from 'firebase/firestore'; // Firestore untuk mendapatkan data pengguna

const isCollapsed = ref(false);
const isMobile = ref(false);
const activeMenu = ref(null);
const userRole = ref(null); // Peran pengguna

// Menu Admin
const adminMenuItems = [
  { name: 'Dashboard', icon: 'bi bi-house', route: '/' },
  { name: 'Event', icon: 'bi bi-megaphone', route: '/event' },
  { name: 'Schedule', icon: 'bi bi-calendar', route: '/schedule' },
  { name: 'Company', icon: 'bi bi-upc-scan', route: '/company' },
];

// Menu Talent
const talentMenuItems = [
  { name: 'Talent Dashboard', icon: 'bi bi-person', route: '/talent-dashboard' },
  { name: 'QR Code', icon: 'bi bi-qr-code', route: '/qrcode' },
  { name: 'Form Data', icon: 'bi bi-file-earmark', route: '/formdata' },
  { name: 'Payment', icon: 'bi bi-credit-card', route: '/payment' },
];

// Filter menu sesuai dengan peran pengguna
const filteredMenuItems = computed(() => {
  if (userRole.value === 'admin') {
    return adminMenuItems;
  } else if (userRole.value === 'talent') {
    return talentMenuItems;
  }
  return [];
});

// Toggle sidebar
const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value;
};

// Cek ukuran layar untuk mobile view
const handleResize = () => {
  isMobile.value = window.innerWidth <= 768;
  if (isMobile.value) {
    isCollapsed.value = true;
  } else {
    isCollapsed.value = false;
  }
};

// Set menu aktif
const setActiveMenu = (menuName) => {
  activeMenu.value = menuName;
};

// Ambil data pengguna dan peran dari Firestore
onMounted(async () => {
  window.addEventListener('resize', handleResize);
  handleResize();

  const auth = getAuth();
  const db = getFirestore();
  const user = auth.currentUser;

  if (user) {
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      userRole.value = userData.role; // Set peran pengguna (admin/talent)
    }
  }

  const currentPath = window.location.pathname;
  const activeItem = [...adminMenuItems, ...talentMenuItems].find((item) => item.route === currentPath);
  if (activeItem) {
    activeMenu.value = activeItem.name;
  }
});

onMounted(async () => {
  window.addEventListener('resize', handleResize);
  handleResize();

  const auth = getAuth();
  const db = getFirestore();
  const user = auth.currentUser;

  if (user) {
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      userRole.value = userData.role; // Set peran pengguna (admin/talent)
      console.log('User Role:', userRole.value); 
    } else {
      console.log('User data not found!');
    }
  }

  const currentPath = window.location.pathname;
  const activeItem = [...adminMenuItems, ...talentMenuItems].find((item) => item.route === currentPath);
  if (activeItem) {
    activeMenu.value = activeItem.name;
  }

  console.log('Filtered Menu Items:', filteredMenuItems.value); // Debug log
});
</script>

<style scoped>
#sidebar {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: 250px;
  height: 100vh;
  background-color: #285480;
  z-index: 1000;
  transition: 0.3s;
  overflow-y: auto;
}

#sidebar.collapsed {
  width: 80px;
  display: block; 
}

#sidebar.mobile-sidebar {
  transform: translateX(-100%);
}

#sidebar.mobile-sidebar:not(.collapsed) {
  transform: translateX(0);
}

.content {
  margin-left: 250px;
}

.collapsed-content {
  margin-left: 80px;
}
</style>
