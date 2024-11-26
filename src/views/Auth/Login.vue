<template>
  <div class="auth-container d-flex justify-content-center align-items-center vh-100 bg-light">
    <div class="auth-card card shadow p-4" style="width: 400px;">
      <h2 class="text-center mb-4">{{ isRegistering ? "Register" : "Login" }}</h2>

      <form @submit.prevent="isRegistering ? register() : login()">
        <div v-if="isRegistering">
          <div class="mb-3">
            <label for="name" class="form-label">Name</label>
            <input
              id="name"
              v-model="name"
              type="text"
              class="form-control"
              placeholder="Enter your name"
              required
            />
          </div>
          <div class="mb-3">
            <label for="phone" class="form-label">Phone Number</label>
            <input
              id="phone"
              v-model="phone"
              type="tel"
              class="form-control"
              placeholder="Enter your phone number"
              required
            />
          </div>
        </div>

        <div class="mb-3">
          <label for="email" class="form-label">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            class="form-control"
            placeholder="Enter your email"
            required
          />
        </div>

        <div class="mb-3">
          <label for="password" class="form-label">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            class="form-control"
            placeholder="Enter your password"
            required
          />
        </div>

        <div class="mb-3" v-if="isRegistering">
          <label for="confirmPassword" class="form-label">Confirm Password</label>
          <input
            id="confirmPassword"
            v-model="confirmPassword"
            type="password"
            class="form-control"
            placeholder="Confirm your password"
            required
          />
        </div>

        <button type="submit" class="btn btn-primary w-100">
          {{ isRegistering ? "Register" : "Login" }}
        </button>
      </form>

      <p v-if="error" class="text-danger mt-3 text-center">{{ error }}</p>

      <div class="text-center mt-3" v-if="!isRegistering" >
        <button class="btn btn-link" @click="openForgotPasswordModal">
          Forgot Password?
        </button>
      </div>

      <div class="text-center mt-4">
        <button class="btn btn-link" @click="toggleAuthMode">
          {{ isRegistering
            ? "Already have an account? Login"
            : "Don't have an account? Register" }}
        </button>
      </div>
    </div>
  </div>

  <!-- Modal Success -->
  <div class="modal fade" id="successModal" tabindex="-1" aria-labelledby="successModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="successModalLabel">Account Created</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          Your account has been successfully created! Please login to continue.
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary" @click="redirectToLogin" data-bs-dismiss="modal">Go to Login</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal Forgot Password -->
  <div class="modal fade" id="forgotPasswordModal" tabindex="-1" aria-labelledby="forgotPasswordModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="forgotPasswordModalLabel">Reset Password</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <p>Please enter your email to reset your password:</p>
          <div class="mb-3">
            <input
              v-model="resetEmail"
              type="email"
              class="form-control"
              placeholder="Enter your email"
              required
            />
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
          <button type="button" class="btn btn-primary" @click="sendPasswordReset">Send Reset Link</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

export default {
  data() {
    return {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      resetEmail: "", 
      error: null,
      isRegistering: false,
    };
  },
  methods: {
    async login() {
  const auth = getAuth();
  const db = getFirestore();

  try {
    const userCredential = await signInWithEmailAndPassword(auth, this.email, this.password);
    const user = userCredential.user;

    // Ambil data role pengguna dari Firestore
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (userDoc.exists()) {
      const userData = userDoc.data();

      // Simpan role di localStorage atau state management untuk akses global
      localStorage.setItem("userRole", userData.role);

      // Arahkan pengguna sesuai role
      if (userData.role === "admin") {
        this.$router.push("/"); // Admin Dashboard
      } else if (userData.role === "talent") {
        this.$router.push("/talent-dashboard"); // Talent-specific page
      } else {
        this.error = "Role not authorized!";
      }
    } else {
      throw new Error("User data not found");
    }
  } catch (error) {
    console.error("Login Error: ", error);
    this.error = "Invalid email or password";
    this.resetForm();
  }
},
    async register() {
      const auth = getAuth();
      const db = getFirestore();

      if (this.password !== this.confirmPassword) {
        this.error = "Passwords do not match!";
        return;
      }

      try {
        const userCredential = await createUserWithEmailAndPassword(auth, this.email, this.password);
        const user = userCredential.user;

        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          name: this.name,
          email: this.email,
          phone: this.phone,
          role: "talent", 
        });

        this.$nextTick(() => {
          const modal = new bootstrap.Modal(document.getElementById('successModal'));
          modal.show();
        });

        this.resetForm();
      } catch (error) {
        console.error("Firebase Error: ", error);
        this.error = error.message || "Failed to create account. Please try again.";
        this.resetForm();
      }
    },
    async sendPasswordReset() {
  const auth = getAuth();

  if (!this.resetEmail) {
    Swal.fire({
      icon: "warning",
      title: "Email Required",
      text: "Please enter a valid email address to reset your password.",
      confirmButtonText: "OK",
    });
    return;
  }

  try {
    await sendPasswordResetEmail(auth, this.resetEmail);

    // SweetAlert untuk notifikasi sukses
    Swal.fire({
      icon: "success",
      title: "Email Sent!",
      text: "A password reset link has been sent to your email address.",
      confirmButtonText: "OK",
      timer: 3000, // Opsional, otomatis hilang setelah 3 detik
    });

    this.resetEmail = ""; // Reset input email setelah sukses
    const modal = bootstrap.Modal.getInstance(document.getElementById("forgotPasswordModal"));
    modal.hide();
  } catch (error) {
    console.error("Error sending password reset email: ", error);

    // SweetAlert untuk notifikasi error
    Swal.fire({
      icon: "error",
      title: "Failed to Send Email",
      text: error.message || "An error occurred. Please try again later.",
      confirmButtonText: "OK",
    });
  }
},
    resetForm() {
      this.name = "";
      this.email = "";
      this.phone = "";
      this.password = "";
      this.confirmPassword = "";
    },
    toggleAuthMode() {
      this.isRegistering = !this.isRegistering;
      this.error = null; 
      this.resetForm();
    },
    redirectToLogin() {
      this.isRegistering = !this.isRegistering;
      this.error = null; 
      this.resetForm();
    },
    openForgotPasswordModal() {
      const modal = new bootstrap.Modal(document.getElementById("forgotPasswordModal"));
      modal.show();
    },
  },
};
</script>

<style scoped>
.auth-container {
  background-color: #f8f9fa;
}

.auth-card {
  background-color: #ffffff;
  border-radius: 8px;
}

.btn-link {
  text-decoration: none;
  color: #007bff;
}

.btn-link:hover {
  color: #0056b3;
  text-decoration: underline;
}

.text-danger {
  color: red;
}

.modal-content {
  border-radius: 8px;
}
</style>
