<template>
  <div class="user-register">
    <h2>Register New User</h2>
    <form @submit.prevent="handleRegister">
      <div class="form-group">
        <label for="name">Name:</label>
        <input
          id="name"
          v-model="form.name"
          type="text"
          required
          placeholder="Enter your name"
        />
      </div>

      <div class="form-group">
        <label for="email">Email:</label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          required
          placeholder="Enter your email"
        />
      </div>

      <div class="form-group">
        <label for="password">Password:</label>
        <input
          id="password"
          v-model="form.password"
          type="password"
          required
          placeholder="Enter your password"
        />
      </div>

      <button type="submit" :disabled="loading">
        {{ loading ? "Registering..." : "Register" }}
      </button>
    </form>

    <div v-if="message" :class="['message', messageType]">
      {{ message }}
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { userAccountAPI } from "../../services/api.js";

const emit = defineEmits(["user-registered"]);

const loading = ref(false);
const message = ref("");
const messageType = ref("");

const form = reactive({
  name: "",
  email: "",
  password: "",
});

const handleRegister = async () => {
  loading.value = true;
  message.value = "";

  try {
    const response = await userAccountAPI.register(
      form.name,
      form.email,
      form.password
    );

    if (response.user) {
      message.value = `Registration successful! Welcome, ${form.name}!`;
      messageType.value = "success";
      emit("user-registered", { userId: response.user, userName: form.name });

      // Reset form
      form.name = "";
      form.email = "";
      form.password = "";
    } else if (response.error) {
      message.value = `Registration failed: ${response.error}`;
      messageType.value = "error";
    }
  } catch (error) {
    message.value = `Registration failed: ${error.message}`;
    messageType.value = "error";
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.user-register {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #f4eeff;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

button {
  width: 100%;
  padding: 10px;
  background: #a6b1e1;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.message {
  margin-top: 15px;
  padding: 10px;
  border-radius: 4px;
}

.message.success {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.message.error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}
</style>
