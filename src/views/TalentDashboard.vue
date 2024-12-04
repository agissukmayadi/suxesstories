<template>
  <div class="flex-grow-1">
    <!-- QR Scanner Section -->
    <div
      class="bg-light text-center py-5 rounded border mb-4 d-flex flex-column align-items-center"
    >
      <div class="wrapper-reader mx-4">
        <div id="reader"></div>
      </div>
      <p v-if="qrCodeError" class="text-danger">{{ qrCodeError }}</p>
      <h5>Scan QR code</h5>
      <p class="text-muted">Scan untuk mengisi data diri Talent</p>
    </div>
    <!-- Instructions -->
    <h5 class="mb-3">
      Cara Melakukan Scan QR Code untuk Masuk ke Formulir Data:
    </h5>
    <ol>
      <li>
        Arahkan Kamera ke QR Code
        <p>
          Gunakan kamera ponsel Anda atau perangkat lain yang mendukung
          pemindaian QR code.
        </p>
      </li>
      <li>
        Pindai QR Code
        <p>Pastikan QR code terfokus dengan jelas pada layar perangkat Anda.</p>
      </li>
      <li>
        Klik Tautan untuk Masuk ke Formulir
        <p>
          Setelah QR code berhasil dipindai, Anda akan diarahkan secara
          otomatis.
        </p>
      </li>
    </ol>
  </div>
</template>

<script>
import { Html5Qrcode } from "html5-qrcode";

export default {
  name: "TalentDashboard",
  data() {
    return {
      qrCodeError: "",
    };
  },
  methods: {
    initializeQrScanner() {
      const html5QrCode = new Html5Qrcode("reader");

      html5QrCode
        .start(
          { facingMode: "environment" }, 
          {
            fps: 10, 
          },
          (decodedText, decodedResult) => {
            window.location.href = decodedText; 
          },
          (errorMessage) => {
            this.qrCodeError = "Gagal mendeteksi QR Code, coba lagi!";
          }
        )
        .catch((err) => {
          console.error("Camera initialization failed", err);
          this.qrCodeError =
            "Kamera tidak dapat diakses. Periksa izin kamera Anda.";
        });
    },
  },
  mounted() {
    this.initializeQrScanner();
  },
};
</script>

<style scoped>
.wrapper-reader {
  border: 1px solid #ccc;
  padding: 10px;
  padding-right: 20px;
  border-radius: 10px;
  width: 50%;
  margin: 0 auto;
}
</style>
