<script setup>
import { ref, onMounted } from "vue";
import UserRegister from "./components/UserAccount/UserRegister.vue";
import UserLogin from "./components/UserAccount/UserLogin.vue";
import Dashboard from "./components/Dashboard.vue";

const isLoggedIn = ref(false);
const currentUserId = ref("");
const currentUserName = ref("");

// Load session from localStorage on mount
onMounted(() => {
  const savedUserId = localStorage.getItem("venu_userId");
  const savedUserName = localStorage.getItem("venu_userName");

  if (savedUserId && savedUserName) {
    currentUserId.value = savedUserId;
    currentUserName.value = savedUserName;
    isLoggedIn.value = true;
  }
});

const handleUserRegistered = (userId) => {
  currentUserId.value = userId;
  currentUserName.value = "User"; // Default name since we don't get it from registration
  isLoggedIn.value = true;

  // Save to localStorage
  localStorage.setItem("venu_userId", userId);
  localStorage.setItem("venu_userName", "User");
};

const handleUserLoggedIn = (userId) => {
  currentUserId.value = userId;
  currentUserName.value = "User"; // Default name since we don't get it from login
  isLoggedIn.value = true;

  // Save to localStorage
  localStorage.setItem("venu_userId", userId);
  localStorage.setItem("venu_userName", "User");
};

const handleLogout = () => {
  isLoggedIn.value = false;
  currentUserId.value = "";
  currentUserName.value = "";

  // Clear localStorage
  localStorage.removeItem("venu_userId");
  localStorage.removeItem("venu_userName");
};
</script>

<template>
  <div class="app">
    <!-- Login/Register Page -->
    <div v-if="!isLoggedIn" class="auth-page">
      <header class="auth-header">
        <h1>🎵 Welcome to Venu</h1>
        <p>Your Concert Management System</p>
      </header>

      <main class="auth-main">
        <div class="auth-container">
          <div class="auth-section">
            <h2>👤 Get Started</h2>
            <div class="auth-components">
              <UserRegister @user-registered="handleUserRegistered" />
              <UserLogin @user-logged-in="handleUserLoggedIn" />
            </div>
          </div>
        </div>
      </main>

      <footer class="auth-footer">
        <p>Built with Vue.js 3 + Vite | Backend API: http://localhost:8000</p>
      </footer>
    </div>

    <!-- Dashboard for Logged-in Users -->
    <Dashboard
      v-else
      :user-id="currentUserId"
      :user-name="currentUserName"
      @logout="handleLogout"
    />
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
}

.auth-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
}

.auth-header {
  background: rgba(255, 255, 255, 0.95);
  padding: 40px 20px;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.auth-header h1 {
  margin: 0 0 10px 0;
  color: #2c3e50;
  font-size: 3rem;
  font-weight: bold;
}

.auth-header p {
  margin: 0;
  color: #6c757d;
  font-size: 1.2rem;
}

.auth-main {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
}

.auth-container {
  max-width: 800px;
  width: 100%;
}

.auth-section {
  background: rgba(255, 255, 255, 0.95);
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.auth-section h2 {
  margin: 0 0 30px 0;
  color: #2c3e50;
  font-size: 1.8rem;
  text-align: center;
  border-bottom: 3px solid #3498db;
  padding-bottom: 10px;
}

.auth-components {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px;
  align-items: start;
}

.auth-footer {
  background: rgba(0, 0, 0, 0.8);
  color: white;
  text-align: center;
  padding: 20px;
}

.auth-footer p {
  margin: 0;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .auth-header h1 {
    font-size: 2.5rem;
  }

  .auth-section h2 {
    font-size: 1.5rem;
  }

  .auth-components {
    grid-template-columns: 1fr;
  }

  .auth-section {
    padding: 30px 20px;
  }
}
</style>
