<template>
  <div class="container">
    <form @submit.prevent="submitForm" class="p-4 rounded border mx-auto">
      <h4 class="mb-3 border-bottom" style="padding-bottom: 8px">
        Form Data Diri Talent
      </h4>
      <div class="mb-3">
        <label for="namaLengkap" class="form-label">Nama Lengkap</label>
        <input
          type="text"
          id="namaLengkap"
          class="form-control"
          placeholder="Masukkan nama lengkap"
          v-model="namaLengkap"
        />
      </div>
      <div class="mb-3">
        <label for="email" class="form-label">Alamat Email</label>
        <input
          type="email"
          id="email"
          class="form-control"
          placeholder="Masukkan alamat email"
          v-model="email"
        />
      </div>
      <div class="mb-3">
        <label for="tanggalLahir" class="form-label">Tanggal Lahir</label>
        <input
          type="date"
          id="tanggalLahir"
          class="form-control"
          v-model="tanggalLahir"
        />
      </div>
      <div class="mb-3">
        <label for="kotaDomisili" class="form-label">Kota Domisili</label>
        <input
          type="text"
          id="kotaDomisili"
          class="form-control"
          placeholder="Masukkan kota domisili"
          v-model="kotaDomisili"
        />
      </div>
      <div class="mb-3">
        <label for="nomorHandphone" class="form-label">Nomor Handphone</label>
        <input
          type="text"
          id="nomorHandphone"
          class="form-control"
          placeholder="Masukkan nomor handphone"
          v-model="nomorHandphone"
        />
      </div>
      <div class="mb-3">
        <label class="form-label">Jenis Kelamin</label>
        <div>
          <div class="form-check form-check-inline">
            <input
              type="radio"
              id="perempuan"
              name="jenisKelamin"
              class="form-check-input"
              value="Perempuan"
              v-model="jenisKelamin"
            />
            <label for="perempuan" class="form-check-label">Perempuan</label>
          </div>
          <div class="form-check form-check-inline">
            <input
              type="radio"
              id="lakiLaki"
              name="jenisKelamin"
              class="form-check-input"
              value="Laki-Laki"
              v-model="jenisKelamin"
            />
            <label for="lakiLaki" class="form-check-label">Laki-Laki</label>
          </div>
        </div>
      </div>
      <button type="submit" class="btn btn-1">Submit</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      namaLengkap: '',
      email: '',
      tanggalLahir: '',
      kotaDomisili: '',
      nomorHandphone: '',
      jenisKelamin: '',
    };
  },
  methods: {
    async submitForm() {
      // Validasi input
      if (
        this.namaLengkap &&
        this.email &&
        this.tanggalLahir &&
        this.kotaDomisili &&
        this.nomorHandphone &&
        this.jenisKelamin
      ) {
        // Jika semua data sudah diisi, arahkan ke halaman lain
        this.$router.push('/payment');
      } else {
        alert('Tolong lengkapi semua data!');
      }
    },
  },
};
</script>

<style scoped>
.btn-1 {
  background-color: #285480;
  color: white;
}
</style>
