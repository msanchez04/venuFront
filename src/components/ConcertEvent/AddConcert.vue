<template>
  <div class="add-concert">
    <h2>Add New Concert</h2>
    <form @submit.prevent="handleAddConcert">
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
        <label for="artist">Artist ID:</label>
        <input
          id="artist"
          v-model="form.artist"
          type="text"
          required
          placeholder="Enter artist ID"
        />
      </div>

      <div class="form-group">
        <label for="date">Date:</label>
        <input id="date" v-model="form.date" type="datetime-local" required />
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
        <label for="city">City:</label>
        <input
          id="city"
          v-model="form.city"
          type="text"
          required
          placeholder="Enter city"
        />
      </div>

      <button type="submit" :disabled="loading">
        {{ loading ? "Adding Concert..." : "Add Concert" }}
      </button>
    </form>

    <div v-if="message" :class="['message', messageType]">
      {{ message }}
    </div>

    <div v-if="concert" class="concert-result">
      <h3>Concert Added Successfully!</h3>
      <p><strong>Concert ID:</strong> {{ concert._id }}</p>
      <p><strong>Owner:</strong> {{ concert.owner }}</p>
      <p><strong>Artist:</strong> {{ concert.artist }}</p>
      <p>
        <strong>Date:</strong> {{ new Date(concert.date).toLocaleString() }}
      </p>
      <p><strong>Venue:</strong> {{ concert.venue }}</p>
      <p><strong>City:</strong> {{ concert.city }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { concertEventAPI } from "../../services/api.js";

const emit = defineEmits(["concert-added"]);

const loading = ref(false);
const message = ref("");
const messageType = ref("");
const concert = ref(null);

const form = reactive({
  user: "",
  artist: "",
  date: "",
  venue: "",
  city: "",
});

const handleAddConcert = async () => {
  loading.value = true;
  message.value = "";
  concert.value = null;

  try {
    const response = await concertEventAPI.addConcert(
      form.user,
      form.artist,
      form.date,
      form.venue,
      form.city
    );

    if (response.concert) {
      message.value = "Concert added successfully!";
      messageType.value = "success";
      concert.value = response.concert;
      emit("concert-added", response.concert);

      // Reset form
      form.user = "";
      form.artist = "";
      form.date = "";
      form.venue = "";
      form.city = "";
    } else if (response.error) {
      message.value = `Failed to add concert: ${response.error}`;
      messageType.value = "error";
    }
  } catch (error) {
    message.value = `Failed to add concert: ${error.message}`;
    messageType.value = "error";
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.add-concert {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #f9f9f9;
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
  background: #007bff;
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

.concert-result {
  margin-top: 20px;
  padding: 15px;
  background: #e7f3ff;
  border: 1px solid #b3d9ff;
  border-radius: 4px;
}

.concert-result h3 {
  margin-top: 0;
  color: #0066cc;
}

.concert-result p {
  margin: 5px 0;
}
</style>

