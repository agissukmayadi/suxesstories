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
        <!-- Always render Cornerstone without hiding it -->
        <h5 class="mb-4 border-bottom border-white border-2 pb-4 text-center" :class="{'small-text': isCollapsed}">
          Cornerstone
        </h5>
        <ul class="nav flex-column text-start w-100">
          <li
            class="nav-item border border-white rounded-3 mb-3"
            v-for="item in menuItems"
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
import { ref, onMounted, onUnmounted } from 'vue';

const isCollapsed = ref(false);
const isMobile = ref(false);
const activeMenu = ref(null);

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value;
};

const handleResize = () => {
  isMobile.value = window.innerWidth <= 768;
  if (isMobile.value) {
    isCollapsed.value = true;
  } else {
    isCollapsed.value = false;
  }
};

const setActiveMenu = (menuName) => {
  activeMenu.value = menuName;
};

onMounted(() => {
  window.addEventListener('resize', handleResize);
  handleResize();
  const currentPath = window.location.pathname;
  const activeItem = menuItems.find((item) => item.route === currentPath);
  if (activeItem) {
    activeMenu.value = activeItem.name;
  }
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});

const menuItems = [
  { name: 'Dashboard', icon: 'bi bi-house', route: '/' },
  { name: 'Event', icon: 'bi bi-megaphone', route: '/event' },
  { name: 'Schedule', icon: 'bi bi-calendar', route: '/schedule' },
  { name: 'Company', icon: 'bi bi-upc-scan', route: '/company' },
];
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
}

#sidebar.mobile-sidebar {
  transform: translateX(-100%);
}

#sidebar.mobile-sidebar:not(.collapsed) {
  transform: translateX(0); 
}

.content {
  margin-left: 210px;
}

.collapsed-content {
  margin-left: 80px; 
}

.sidebar-link {
  display: flex;
  align-items: center;
  font-size: 1.25rem;
}

.sidebar-link i {
  font-size: 1.25rem; 
}

.sidebar-link:hover {
  background-color: #4a85c3;
  color: white;
  border-radius: 8px;
}

.nav-item.active {
  background-color: #4a85c3;
  color: white;
}

.nav-item.active .nav-link {
  color: white;
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

  #sidebar.collapsed .sidebar-link span {
    display: block;
  }
  
  .content {
    margin-left: 0;
  }
}

</style>
