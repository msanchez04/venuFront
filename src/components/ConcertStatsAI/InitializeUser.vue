<template>
  <div class="initialize-user">
    <h2>Initialize User for Stats Tracking</h2>
    <form @submit.prevent="handleInitializeUser">
      <div class="form-group">
        <label for="user">User ID:</label>
        <input
          id="user"
          v-model="form.user"
          type="text"
          required
          placeholder="Enter user ID"
        />
      </div>

      <button type="submit" :disabled="loading">
        {{ loading ? "Initializing..." : "Initialize User" }}
      </button>
    </form>

    <div v-if="message" :class="['message', messageType]">
      {{ message }}
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { concertStatsAAPI } from "../../services/api.js";

const emit = defineEmits(["user-initialized"]);

const loading = ref(false);
const message = ref("");
const messageType = ref("");

const form = reactive({
  user: "",
});

const handleInitializeUser = async () => {
  loading.value = true;
  message.value = "";

  try {
    const response = await concertStatsAAPI.initializeUser(form.user);

    if (response.error) {
      message.value = `Failed to initialize user: ${response.error}`;
      messageType.value = "error";
    } else {
      message.value = "User initialized successfully for stats tracking!";
      messageType.value = "success";
      emit("user-initialized", form.user);

      // Reset form
      form.user = "";
    }
  } catch (error) {
    message.value = `Failed to initialize user: ${error.message}`;
    messageType.value = "error";
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.initialize-user {
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
  background: #fd7e14;
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
