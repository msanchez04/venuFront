<template>
  <div class="edit-concert">
    <h2>Edit Concert Details</h2>
    <form @submit.prevent="handleEditConcert">
      <div class="form-group">
        <label for="concert">Concert ID:</label>
        <input
          id="concert"
          v-model="form.concert"
          type="text"
          required
          placeholder="Enter concert ID"
        />
      </div>

      <div class="form-group">
        <label for="newArtist">New Artist ID (optional):</label>
        <input
          id="newArtist"
          v-model="form.newArtist"
          type="text"
          placeholder="Enter new artist ID"
        />
      </div>

      <div class="form-group">
        <label for="newDate">New Date (optional):</label>
        <input id="newDate" v-model="form.newDate" type="datetime-local" />
      </div>

      <div class="form-group">
        <label for="newVenue">New Venue (optional):</label>
        <input
          id="newVenue"
          v-model="form.newVenue"
          type="text"
          placeholder="Enter new venue"
        />
      </div>

      <div class="form-group">
        <label for="newCity">New City (optional):</label>
        <input
          id="newCity"
          v-model="form.newCity"
          type="text"
          placeholder="Enter new city"
        />
      </div>

      <button type="submit" :disabled="loading">
        {{ loading ? "Updating Concert..." : "Update Concert" }}
      </button>
    </form>

    <div v-if="message" :class="['message', messageType]">
      {{ message }}
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { concertEventAPI } from "../../services/api.js";

const emit = defineEmits(["concert-updated"]);

const loading = ref(false);
const message = ref("");
const messageType = ref("");

const form = reactive({
  concert: "",
  newArtist: "",
  newDate: "",
  newVenue: "",
  newCity: "",
});

const handleEditConcert = async () => {
  loading.value = true;
  message.value = "";

  try {
    // Only include fields that have values
    const updateData = {
      concert: form.concert,
    };

    if (form.newArtist) updateData.newArtist = form.newArtist;
    if (form.newDate) updateData.newDate = form.newDate;
    if (form.newVenue) updateData.newVenue = form.newVenue;
    if (form.newCity) updateData.newCity = form.newCity;

    const response = await concertEventAPI.editConcertDetails(
      updateData.concert,
      updateData.newArtist,
      updateData.newDate,
      updateData.newVenue,
      updateData.newCity
    );

    if (response.error) {
      message.value = `Failed to update concert: ${response.error}`;
      messageType.value = "error";
    } else {
      message.value = "Concert updated successfully!";
      messageType.value = "success";
      emit("concert-updated", form.concert);

      // Reset form
      form.concert = "";
      form.newArtist = "";
      form.newDate = "";
      form.newVenue = "";
      form.newCity = "";
    }
  } catch (error) {
    message.value = `Failed to update concert: ${error.message}`;
    messageType.value = "error";
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.edit-concert {
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
  background: #ffc107;
  color: #212529;
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
