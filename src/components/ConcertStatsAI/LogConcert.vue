<template>
  <div class="log-concert">
    <h2>Log Concert for Stats</h2>
    <form @submit.prevent="handleLogConcert">
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

      <div class="form-group">
        <label for="artist">Artist:</label>
        <input
          id="artist"
          v-model="form.artist"
          type="text"
          required
          placeholder="Enter artist name"
        />
      </div>

      <div class="form-group">
        <label for="venue">Venue:</label>
        <input
          id="venue"
          v-model="form.venue"
          type="text"
          required
          placeholder="Enter venue name"
        />
      </div>

      <div class="form-group">
        <label for="date">Date:</label>
        <input id="date" v-model="form.date" type="datetime-local" required />
      </div>

      <button type="submit" :disabled="loading">
        {{ loading ? "Logging Concert..." : "Log Concert" }}
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

const emit = defineEmits(["concert-logged"]);

const loading = ref(false);
const message = ref("");
const messageType = ref("");

const form = reactive({
  user: "",
  artist: "",
  venue: "",
  date: "",
});

const handleLogConcert = async () => {
  loading.value = true;
  message.value = "";

  try {
    const response = await concertStatsAAPI.logConcert(
      form.user,
      form.artist,
      form.venue,
      form.date
    );

    if (response.error) {
      message.value = `Failed to log concert: ${response.error}`;
      messageType.value = "error";
    } else {
      message.value = "Concert logged successfully!";
      messageType.value = "success";
      emit("concert-logged", {
        user: form.user,
        artist: form.artist,
        venue: form.venue,
        date: form.date,
      });

      // Reset form
      form.user = "";
      form.artist = "";
      form.venue = "";
      form.date = "";
    }
  } catch (error) {
    message.value = `Failed to log concert: ${error.message}`;
    messageType.value = "error";
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.log-concert {
  max-width: 500px;
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
  background: #20c997;
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
