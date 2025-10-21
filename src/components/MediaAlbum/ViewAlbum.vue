<template>
  <div class="view-album">
    <h2>View Media Album</h2>

    <!-- Get Album by ID -->
    <div class="album-lookup">
      <h3>Get Album by ID</h3>
      <form @submit.prevent="handleGetAlbum">
        <div class="form-group">
          <label for="albumId">Album ID:</label>
          <input
            id="albumId"
            v-model="albumId"
            type="text"
            required
            placeholder="Enter album ID"
          />
        </div>
        <button type="submit" :disabled="loading">
          {{ loading ? "Loading..." : "Get Album" }}
        </button>
      </form>
    </div>

    <!-- Get Albums by User and Concert -->
    <div class="albums-lookup">
      <h3>Get Albums by User and Concert</h3>
      <form @submit.prevent="handleGetAlbumsByUserAndConcert">
        <div class="form-group">
          <label for="user">User ID:</label>
          <input
            id="user"
            v-model="userConcertForm.user"
            type="text"
            required
            placeholder="Enter user ID"
          />
        </div>
        <div class="form-group">
          <label for="concert">Concert ID:</label>
          <input
            id="concert"
            v-model="userConcertForm.concert"
            type="text"
            required
            placeholder="Enter concert ID"
          />
        </div>
        <button type="submit" :disabled="loading">
          {{ loading ? "Loading..." : "Get Albums" }}
        </button>
      </form>
    </div>

    <div v-if="message" :class="['message', messageType]">
      {{ message }}
    </div>

    <!-- Display Single Album -->
    <div v-if="album" class="album-display">
      <h3>Album Details</h3>
      <div class="album-info">
        <p><strong>Album ID:</strong> {{ album._id }}</p>
        <p><strong>Owner:</strong> {{ album.owner }}</p>
        <p><strong>Concert:</strong> {{ album.concert }}</p>
        <p>
          <strong>Created:</strong>
          {{ new Date(album.createdAt).toLocaleString() }}
        </p>
        <p>
          <strong>Media Items:</strong>
          {{ album.mediaItems ? album.mediaItems.length : 0 }}
        </p>
      </div>

      <div
        v-if="album.mediaItems && album.mediaItems.length > 0"
        class="media-items"
      >
        <h4>Media Items</h4>
        <div
          v-for="(item, index) in album.mediaItems"
          :key="index"
          class="media-item"
        >
          <p><strong>URL:</strong> {{ item.url }}</p>
          <p><strong>Type:</strong> {{ item.type }}</p>
          <p>
            <strong>Uploaded:</strong>
            {{ new Date(item.uploadTimestamp).toLocaleString() }}
          </p>
        </div>
      </div>
    </div>

    <!-- Display Multiple Albums -->
    <div v-if="albums && albums.length > 0" class="albums-display">
      <h3>Albums ({{ albums.length }})</h3>
      <div v-for="album in albums" :key="album._id" class="album-card">
        <h4>Album {{ album._id }}</h4>
        <p><strong>Owner:</strong> {{ album.owner }}</p>
        <p><strong>Concert:</strong> {{ album.concert }}</p>
        <p>
          <strong>Created:</strong>
          {{ new Date(album.createdAt).toLocaleString() }}
        </p>
        <p>
          <strong>Media Items:</strong>
          {{ album.mediaItems ? album.mediaItems.length : 0 }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { mediaAlbumAPI } from "../../services/api.js";

const loading = ref(false);
const message = ref("");
const messageType = ref("");
const album = ref(null);
const albums = ref([]);
const albumId = ref("");

const userConcertForm = reactive({
  user: "",
  concert: "",
});

const handleGetAlbum = async () => {
  loading.value = true;
  message.value = "";
  album.value = null;
  albums.value = [];

  try {
    const response = await mediaAlbumAPI.getMediaAlbum(albumId.value);

    if (response.album) {
      album.value = response.album;
      message.value = "Album retrieved successfully!";
      messageType.value = "success";
    } else if (response.error) {
      message.value = `Failed to get album: ${response.error}`;
      messageType.value = "error";
    }
  } catch (error) {
    message.value = `Failed to get album: ${error.message}`;
    messageType.value = "error";
  } finally {
    loading.value = false;
  }
};

const handleGetAlbumsByUserAndConcert = async () => {
  loading.value = true;
  message.value = "";
  album.value = null;
  albums.value = [];

  try {
    const response = await mediaAlbumAPI.getAlbumsByUserAndConcert(
      userConcertForm.user,
      userConcertForm.concert
    );

    if (response.albums) {
      albums.value = response.albums;
      message.value = `Found ${response.albums.length} album(s)!`;
      messageType.value = "success";
    } else if (response.error) {
      message.value = `Failed to get albums: ${response.error}`;
      messageType.value = "error";
    }
  } catch (error) {
    message.value = `Failed to get albums: ${error.message}`;
    messageType.value = "error";
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.view-album {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #f9f9f9;
}

.album-lookup,
.albums-lookup {
  margin-bottom: 30px;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: white;
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
  background: #28a745;
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

.album-display,
.albums-display {
  margin-top: 20px;
  padding: 20px;
  background: #e7f3ff;
  border: 1px solid #b3d9ff;
  border-radius: 8px;
}

.album-info {
  margin-bottom: 20px;
}

.album-info p {
  margin: 5px 0;
}

.media-items {
  margin-top: 20px;
}

.media-item {
  margin: 10px 0;
  padding: 10px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.album-card {
  margin: 10px 0;
  padding: 15px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.album-card h4 {
  margin-top: 0;
  color: #0066cc;
}
</style>

