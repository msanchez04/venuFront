<template>
  <div class="create-album">
    <h2>Create Media Album</h2>
    <form @submit.prevent="handleCreateAlbum">
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
        <label for="concert">Concert ID:</label>
        <input
          id="concert"
          v-model="form.concert"
          type="text"
          required
          placeholder="Enter concert ID"
        />
      </div>

      <button type="submit" :disabled="loading">
        {{ loading ? "Creating Album..." : "Create Album" }}
      </button>
    </form>

    <div v-if="message" :class="['message', messageType]">
      {{ message }}
    </div>

    <div v-if="albumId" class="album-result">
      <h3>Album Created Successfully!</h3>
      <p><strong>Album ID:</strong> {{ albumId }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { mediaAlbumAPI } from "../../services/api.js";

const emit = defineEmits(["album-created"]);

const loading = ref(false);
const message = ref("");
const messageType = ref("");
const albumId = ref("");

const form = reactive({
  user: "",
  concert: "",
});

const handleCreateAlbum = async () => {
  loading.value = true;
  message.value = "";
  albumId.value = "";

  try {
    const response = await mediaAlbumAPI.createAlbum(form.user, form.concert);

    if (response.album) {
      message.value = "Album created successfully!";
      messageType.value = "success";
      albumId.value = response.album;
      emit("album-created", response.album);

      // Reset form
      form.user = "";
      form.concert = "";
    } else if (response.error) {
      message.value = `Failed to create album: ${response.error}`;
      messageType.value = "error";
    }
  } catch (error) {
    message.value = `Failed to create album: ${error.message}`;
    messageType.value = "error";
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.create-album {
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
  background: #17a2b8;
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

.album-result {
  margin-top: 20px;
  padding: 15px;
  background: #dcd6f7;
  border: 1px solid #b3d9ff;
  border-radius: 4px;
}

.album-result h3 {
  margin-top: 0;
  color: #0066cc;
}

.album-result p {
  margin: 5px 0;
}
</style>
