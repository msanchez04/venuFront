<template>
  <div class="upload-media">
    <h2>Upload Media to Album</h2>
    <form @submit.prevent="handleUploadMedia">
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
        <label for="album">Album ID:</label>
        <input
          id="album"
          v-model="form.album"
          type="text"
          required
          placeholder="Enter album ID"
        />
      </div>

      <div class="form-group">
        <label for="url">Media URL:</label>
        <input
          id="url"
          v-model="form.url"
          type="url"
          required
          placeholder="Enter media URL"
        />
      </div>

      <div class="form-group">
        <label for="type">Media Type:</label>
        <select id="type" v-model="form.type" required>
          <option value="">Select media type</option>
          <option value="photo">Photo</option>
          <option value="video">Video</option>
        </select>
      </div>

      <div class="form-group">
        <label for="uploadTimestamp">Upload Timestamp:</label>
        <input
          id="uploadTimestamp"
          v-model="form.uploadTimestamp"
          type="datetime-local"
          required
        />
      </div>

      <button type="submit" :disabled="loading">
        {{ loading ? "Uploading Media..." : "Upload Media" }}
      </button>
    </form>

    <div v-if="message" :class="['message', messageType]">
      {{ message }}
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { mediaAlbumAPI } from "../../services/api.js";

const emit = defineEmits(["media-uploaded"]);

const loading = ref(false);
const message = ref("");
const messageType = ref("");

const form = reactive({
  user: "",
  album: "",
  url: "",
  type: "",
  uploadTimestamp: "",
});

const handleUploadMedia = async () => {
  loading.value = true;
  message.value = "";

  try {
    const response = await mediaAlbumAPI.uploadMedia(
      form.user,
      form.album,
      form.url,
      form.uploadTimestamp,
      form.type
    );

    if (response.error) {
      message.value = `Failed to upload media: ${response.error}`;
      messageType.value = "error";
    } else {
      message.value = "Media uploaded successfully!";
      messageType.value = "success";
      emit("media-uploaded", {
        album: form.album,
        url: form.url,
        type: form.type,
      });

      // Reset form
      form.user = "";
      form.album = "";
      form.url = "";
      form.type = "";
      form.uploadTimestamp = "";
    }
  } catch (error) {
    message.value = `Failed to upload media: ${error.message}`;
    messageType.value = "error";
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.upload-media {
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

input,
select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

button {
  width: 100%;
  padding: 10px;
  background: #424874;
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
