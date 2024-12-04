<template>
  <div class="container">
    <form @submit.prevent="submitPayment" class="bg-light p-4 rounded border mx-auto">
      <h4 class="mb-3 border-bottom" style="padding-bottom: 8px;">Payment</h4>
      <div class="mb-3">
        <label for="nama" class="form-label">Nama</label>
        <input type="text" id="nama" class="form-control" placeholder="-" disabled>
      </div>
      <div class="mb-3">
        <label for="metodePembayaran" class="form-label">Metode Pembayaran</label>
        <select id="metodePembayaran" class="form-select" v-model="selectpay">
          <option value="transferBank">Transfer Bank</option>
          <option value="kartuKredit">Kartu Kredit</option>
          <option value="eWallet">E-Wallet</option>
        </select>
      </div>
      <div class="mb-3">
        <label for="noPembayaran" class="form-label">No. Pembayaran</label>
        <input type="text" id="noPembayaran" class="form-control" placeholder="-" disabled>
      </div>
      <div class="mb-3">
        <label for="testYangDiambil" class="form-label">Test Yang Diambil</label>
        <select id="testYangDiambil" class="form-select" v-model="selectedTest">
          <option value="5pftipologi">5pf tipologi</option>
          <option value="CFIT3">CFIT 3</option>
          <option value="NegotiatonSkillTest">Negotiaton Skill Test</option>
          <option value="AchievementMotivationProfile">Achievement Motivation Profile</option>
          <option value="GoalSettingTest">Goal Setting Test</option>
          <option value="ScholasticAptitudesQuestionnaire">Scholastic Aptitudes Questionnaire</option>
          <option value="Personality5.0">Personality 5.0</option>
          <option value="CreativeProblemSolving">Creative Problem Solving</option>
          <option value="EmotionalIntelligenceTest">Emotional Intelligence Test</option>
          <option value="TeachingStyleProfile">Teaching Style Profile</option>
        </select>
      </div>
      <div class="mb-3">
        <label for="jumlahTransaksi" class="form-label">Jumlah Transaksi</label>
        <input type="text" id="jumlahTransaksi" class="form-control" placeholder="-" disabled>
      </div>
      <div class="mb-3 text-muted small">
        <p>Note:</p>
        <ul>
          <li>Jika Anda mengalami kendala dalam proses pembayaran, Anda bisa menghubungi admin.</li>
          <li>Setelah Anda berhasil membayar, admin akan mengirimkan test ke email Anda.</li>
          <li>Pastikan email Anda betul dan aktif.</li>
        </ul>
      </div>
      <div class="d-flex justify-content-start gap-1">
        <button type="submit" class="btn btn-1">Bayar Sekarang</button>
        <button type="button" class="btn btn-cancel" @click="cancelPayment">Cancel</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();
const submitPayment = () => {
  console.log('Payment submitted');
  router.push('/success');
};

const cancelPayment = () => {
  console.log('Payment cancelled');
  router.push('/formdata');
};
</script>

<style scoped>
.btn-1 {
  background-color: #285480;
  color: white;
}

.btn-cancel {
  background-color: transparent;
  border: 2px solid #285480;
  color: #285480;
}
</style>
