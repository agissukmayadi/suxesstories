<template>
  <!-- Main Content -->
    <div class="flex-grow-1">
      <!-- QR Code Section -->
      <div class="bg-light text-center py-5 rounded border mb-4">
        <img src="https://via.placeholder.com/150" alt="QR Code" class="mb-3">
        <h5>Scan QR code</h5>
        <p class="text-muted">Scan untuk mengisi data diri Talent</p>
      </div>
      <!-- Instructions -->
      <h5 class="mb-3">Cara Melakukan Scan QR Code untuk Masuk ke Formulir Data:</h5>
      <ol>
        <li>
          Arahkan Kamera ke QR Code
          <p>Gunakan kamera ponsel Anda atau perangkat lain yang mendukung pemindaian QR code.</p>
        </li>
        <li>
          Pindai QR Code
          <p>Pastikan QR code terfokus dengan jelas pada layar perangkat Anda.</p>
        </li>
        <li>
          Klik Tautan untuk Masuk ke Formulir
          <p>Setelah QR code berhasil dipindai, klik "Oke" yang muncul untuk masuk ke halaman formulir data diri.</p>
        </li>
      </ol>
    </div>
</template>
  
  <script>
  export default {
    name: "TalentDashboard",
  };
  </script>
  
  <style scoped>
  .talent-dashboard {
    text-align: center;
    padding: 20px;
  }
  </style>
  