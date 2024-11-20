<template>
  <div class="login">
    <h2>Login</h2>
    <form @submit.prevent="login">
      <input v-model="email" type="email" placeholder="Email" required />
      <input
        v-model="password"
        type="password"
        placeholder="Password"
        required
      />
      <button type="submit">Login</button>
    </form>
    <p v-if="error" class="text-danger">{{ error }}</p>
  </div>
</template>

<script>
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

export default {
  data() {
    return {
      email: "",
      password: "",
      error: null,
    };
  },
  methods: {
    async login() {
      const auth = getAuth();
      try {
        await signInWithEmailAndPassword(auth, this.email, this.password);
        this.$router.push("/");
      } catch (error) {
        this.error = "Invalid email or password";
        this.resetForm(); // Panggil metode resetForm saat error
      }
    },
    resetForm() {
      this.email = "";
      this.password = "";
    },
  },
};
</script>

<style scoped>
/* Tambahkan styling sesuai kebutuhan */
</style>
