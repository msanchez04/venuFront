<template>
  <div class="dashboard">
    <header class="dashboard-header">
      <h1>🎵 Welcome to Venu, {{ userName }}!</h1>
      <button @click="handleLogout" class="logout-btn">Logout</button>
    </header>

    <main class="dashboard-main">
      <!-- Concert Event Management Section -->
      <section class="concert-management">
        <h2>🎤 Concert Event Management</h2>

        <!-- Add Concert Button -->
        <div class="action-section">
          <button @click="showAddConcert = !showAddConcert" class="primary-btn">
            {{ showAddConcert ? "Cancel" : "+ Add New Concert" }}
          </button>
        </div>

        <!-- Add Concert Form -->
        <div v-if="showAddConcert" class="concert-form">
          <h3>Create New Concert</h3>
          <form @submit.prevent="handleAddConcert">
            <div class="form-row">
              <div class="form-group">
                <label for="artist">Artist:</label>
                <input
                  id="artist"
                  v-model="concertForm.artist"
                  type="text"
                  required
                  placeholder="Enter artist name"
                />
              </div>
              <div class="form-group">
                <label for="date">Date:</label>
                <input
                  id="date"
                  v-model="concertForm.date"
                  type="datetime-local"
                  required
                />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="venue">Venue:</label>
                <input
                  id="venue"
                  v-model="concertForm.venue"
                  type="text"
                  required
                  placeholder="Enter venue name"
                />
              </div>
              <div class="form-group">
                <label for="city">City:</label>
                <input
                  id="city"
                  v-model="concertForm.city"
                  type="text"
                  required
                  placeholder="Enter city"
                />
              </div>
            </div>
            <button type="submit" :disabled="loading" class="submit-btn">
              {{ loading ? "Creating..." : "Create Concert" }}
            </button>
          </form>
        </div>

        <!-- Concert List -->
        <div v-if="concerts.length > 0" class="concerts-list">
          <h3>Your Concerts</h3>
          <div
            v-for="concert in concerts"
            :key="concert._id"
            class="concert-card"
          >
            <div class="concert-info">
              <h4>{{ concert.artist }}</h4>
              <p>
                <strong>Date:</strong>
                {{ new Date(concert.date).toLocaleString() }}
              </p>
              <p>
                <strong>Venue:</strong> {{ concert.venue }}, {{ concert.city }}
              </p>
            </div>
            <div class="concert-actions">
              <button @click="editConcert(concert)" class="edit-btn">
                Edit
              </button>
              <button @click="createAlbum(concert)" class="album-btn">
                Create Album
              </button>
              <button @click="viewAlbum(concert)" class="view-btn">
                View Album
              </button>
            </div>
          </div>
        </div>

        <!-- Edit Concert Modal -->
        <div v-if="editingConcert" class="edit-modal">
          <div class="modal-content">
            <h3>Edit Concert: {{ editingConcert.artist }}</h3>
            <form @submit.prevent="handleEditConcert">
              <div class="form-row">
                <div class="form-group">
                  <label for="editArtist">Artist:</label>
                  <input
                    id="editArtist"
                    v-model="editForm.artist"
                    type="text"
                    placeholder="Enter artist name"
                  />
                </div>
                <div class="form-group">
                  <label for="editDate">Date:</label>
                  <input
                    id="editDate"
                    v-model="editForm.date"
                    type="datetime-local"
                  />
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label for="editVenue">Venue:</label>
                  <input
                    id="editVenue"
                    v-model="editForm.venue"
                    type="text"
                    placeholder="Enter venue name"
                  />
                </div>
                <div class="form-group">
                  <label for="editCity">City:</label>
                  <input
                    id="editCity"
                    v-model="editForm.city"
                    type="text"
                    placeholder="Enter city"
                  />
                </div>
              </div>
              <div class="modal-actions">
                <button type="submit" :disabled="loading" class="submit-btn">
                  Update Concert
                </button>
                <button type="button" @click="cancelEdit" class="cancel-btn">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Media Album Section -->
        <div v-if="selectedConcert" class="album-section">
          <h3>📸 Media Album for {{ selectedConcert.artist }}</h3>

          <!-- Create Album -->
          <div v-if="!currentAlbum" class="create-album">
            <button
              @click="handleCreateAlbum"
              :disabled="loading"
              class="primary-btn"
            >
              {{ loading ? "Creating..." : "Create Media Album" }}
            </button>
          </div>

          <!-- Album Management -->
          <div v-if="currentAlbum" class="album-management">
            <div class="album-info">
              <h4>Album ID: {{ currentAlbum._id }}</h4>
              <p>
                Created: {{ new Date(currentAlbum.createdAt).toLocaleString() }}
              </p>
            </div>

            <!-- Upload Media -->
            <div class="upload-section">
              <h4>Upload Media</h4>
              <form @submit.prevent="handleUploadMedia">
                <div class="form-row">
                  <div class="form-group">
                    <label for="mediaUrl">Media URL:</label>
                    <input
                      id="mediaUrl"
                      v-model="mediaForm.url"
                      type="url"
                      required
                      placeholder="Enter media URL"
                    />
                  </div>
                  <div class="form-group">
                    <label for="mediaType">Type:</label>
                    <select id="mediaType" v-model="mediaForm.type" required>
                      <option value="">Select type</option>
                      <option value="photo">Photo</option>
                      <option value="video">Video</option>
                    </select>
                  </div>
                </div>
                <button type="submit" :disabled="loading" class="submit-btn">
                  {{ loading ? "Uploading..." : "Upload Media" }}
                </button>
              </form>
            </div>

            <!-- View Media -->
            <div v-if="albumMedia.length > 0" class="media-gallery">
              <h4>Media Items ({{ albumMedia.length }})</h4>
              <div class="media-grid">
                <div
                  v-for="(item, index) in albumMedia"
                  :key="index"
                  class="media-item"
                >
                  <div class="media-preview">
                    <img
                      v-if="item.type === 'photo'"
                      :src="item.url"
                      :alt="`Photo ${index + 1}`"
                    />
                    <video
                      v-else-if="item.type === 'video'"
                      :src="item.url"
                      controls
                    ></video>
                  </div>
                  <div class="media-info">
                    <p><strong>Type:</strong> {{ item.type }}</p>
                    <p>
                      <strong>Uploaded:</strong>
                      {{ new Date(item.uploadTimestamp).toLocaleString() }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- AI Summary Section -->
        <div class="ai-summary-section">
          <h3>🤖 AI Concert Statistics</h3>
          <div class="ai-actions">
            <button @click="initializeStats" :disabled="loading" class="ai-btn">
              {{ loading ? "Initializing..." : "Initialize Stats Tracking" }}
            </button>
            <button @click="generateSummary" :disabled="loading" class="ai-btn">
              {{ loading ? "Generating..." : "Generate AI Summary" }}
            </button>
          </div>
          <div v-if="aiSummary" class="summary-result">
            <h4>Your Concert Statistics</h4>
            <p>{{ aiSummary }}</p>
          </div>
        </div>
      </section>
    </main>

    <!-- Messages -->
    <div v-if="message" :class="['message', messageType]">
      {{ message }}
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import {
  concertEventAPI,
  mediaAlbumAPI,
  concertStatsAAPI,
} from "../services/api.js";

const emit = defineEmits(["logout"]);

const props = defineProps({
  userId: String,
  userName: String,
});

// State
const loading = ref(false);
const message = ref("");
const messageType = ref("");
const showAddConcert = ref(false);
const editingConcert = ref(null);
const selectedConcert = ref(null);
const currentAlbum = ref(null);
const albumMedia = ref([]);
const concerts = ref([]);
const aiSummary = ref("");

// Forms
const concertForm = reactive({
  artist: "",
  date: "",
  venue: "",
  city: "",
});

const editForm = reactive({
  artist: "",
  date: "",
  venue: "",
  city: "",
});

const mediaForm = reactive({
  url: "",
  type: "",
});

// Methods
const handleAddConcert = async () => {
  loading.value = true;
  message.value = "";

  try {
    const response = await concertEventAPI.addConcert(
      props.userId,
      concertForm.artist,
      concertForm.date,
      concertForm.venue,
      concertForm.city
    );

    if (response.concert) {
      concerts.value.push(response.concert);

      // Also log the concert to stats for AI summary
      await concertStatsAAPI.logConcert(
        props.userId,
        concertForm.artist,
        concertForm.venue,
        concertForm.date
      );

      message.value = "Concert created successfully!";
      messageType.value = "success";
      showAddConcert.value = false;

      // Reset form
      Object.keys(concertForm).forEach((key) => {
        concertForm[key] = "";
      });
    } else if (response.error) {
      message.value = `Failed to create concert: ${response.error}`;
      messageType.value = "error";
    }
  } catch (error) {
    message.value = `Failed to create concert: ${error.message}`;
    messageType.value = "error";
  } finally {
    loading.value = false;
  }
};

const editConcert = (concert) => {
  editingConcert.value = concert;
  editForm.artist = concert.artist;
  editForm.date = concert.date;
  editForm.venue = concert.venue;
  editForm.city = concert.city;
};

const handleEditConcert = async () => {
  loading.value = true;
  message.value = "";

  try {
    const response = await concertEventAPI.editConcertDetails(
      editingConcert.value._id,
      editForm.artist,
      editForm.date,
      editForm.venue,
      editForm.city
    );

    if (response.error) {
      message.value = `Failed to update concert: ${response.error}`;
      messageType.value = "error";
    } else {
      // Update local concert
      const index = concerts.value.findIndex(
        (c) => c._id === editingConcert.value._id
      );
      if (index !== -1) {
        concerts.value[index] = { ...concerts.value[index], ...editForm };
      }

      message.value = "Concert updated successfully!";
      messageType.value = "success";
      editingConcert.value = null;
    }
  } catch (error) {
    message.value = `Failed to update concert: ${error.message}`;
    messageType.value = "error";
  } finally {
    loading.value = false;
  }
};

const cancelEdit = () => {
  editingConcert.value = null;
  Object.keys(editForm).forEach((key) => {
    editForm[key] = "";
  });
};

const createAlbum = (concert) => {
  selectedConcert.value = concert;
  currentAlbum.value = null;
  albumMedia.value = [];
};

const handleCreateAlbum = async () => {
  loading.value = true;
  message.value = "";

  try {
    const response = await mediaAlbumAPI.createAlbum(
      props.userId,
      selectedConcert.value._id
    );

    if (response.album) {
      currentAlbum.value = {
        _id: response.album,
        owner: props.userId,
        concert: selectedConcert.value._id,
        createdAt: new Date().toISOString(),
        mediaItems: [],
      };
      message.value = "Album created successfully!";
      messageType.value = "success";
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

const viewAlbum = async (concert) => {
  selectedConcert.value = concert;

  try {
    const response = await mediaAlbumAPI.getAlbumsByUserAndConcert(
      props.userId,
      concert._id
    );

    if (response.albums && response.albums.length > 0) {
      currentAlbum.value = response.albums[0];
      albumMedia.value = currentAlbum.value.mediaItems || [];
    } else {
      currentAlbum.value = null;
      albumMedia.value = [];
    }
  } catch (error) {
    console.error("Failed to load album:", error);
  }
};

const handleUploadMedia = async () => {
  loading.value = true;
  message.value = "";

  try {
    const response = await mediaAlbumAPI.uploadMedia(
      props.userId,
      currentAlbum.value._id,
      mediaForm.url,
      new Date().toISOString(),
      mediaForm.type
    );

    if (response.error) {
      message.value = `Failed to upload media: ${response.error}`;
      messageType.value = "error";
    } else {
      // Add to local media array
      albumMedia.value.push({
        url: mediaForm.url,
        type: mediaForm.type,
        uploadTimestamp: new Date().toISOString(),
      });

      message.value = "Media uploaded successfully!";
      messageType.value = "success";

      // Reset form
      mediaForm.url = "";
      mediaForm.type = "";
    }
  } catch (error) {
    message.value = `Failed to upload media: ${error.message}`;
    messageType.value = "error";
  } finally {
    loading.value = false;
  }
};

const initializeStats = async () => {
  try {
    const response = await concertStatsAAPI.initializeUser(props.userId);

    // If error is "already exists", that's expected - silently ignore
    if (response.error && !response.error.includes("already exists")) {
      console.warn("Stats initialization:", response.error);
    }
  } catch (error) {
    // Silently ignore errors during initialization
    console.debug("Stats initialization error:", error.message);
  }
};

const generateSummary = async () => {
  loading.value = true;
  message.value = "";

  try {
    const response = await concertStatsAAPI.generateSummaryAI(props.userId);

    if (response.error) {
      message.value = `Failed to generate summary: ${response.error}`;
      messageType.value = "error";
    } else {
      // Fetch the generated summary and recommendations
      const statsResponse = await concertStatsAAPI.getStatsRecord(props.userId);

      if (statsResponse.error) {
        message.value = `Failed to get summary: ${statsResponse.error}`;
        messageType.value = "error";
      } else {
        const record = statsResponse.record;
        let summaryText = record.summary || "";

        if (record.recommendations && record.recommendations.length > 0) {
          summaryText += "\n\nRecommendations:\n";
          record.recommendations.forEach((rec, index) => {
            summaryText += `${index + 1}. ${rec}\n`;
          });
        }

        aiSummary.value = summaryText;
        message.value = "AI summary generated successfully!";
        messageType.value = "success";
      }
    }
  } catch (error) {
    message.value = `Failed to generate summary: ${error.message}`;
    messageType.value = "error";
  } finally {
    loading.value = false;
  }
};

const handleLogout = () => {
  emit("logout");
};

const loadConcerts = async () => {
  try {
    const response = await concertEventAPI.getConcertsByUser(props.userId);
    if (response.concerts) {
      concerts.value = response.concerts;
    }
  } catch (error) {
    console.error("Failed to load concerts:", error);
  }
};

onMounted(() => {
  // Load existing concerts for the user
  loadConcerts();
  // Initialize stats tracking when dashboard loads
  initializeStats();
});
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.dashboard-header {
  background: rgba(255, 255, 255, 0.95);
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.dashboard-header h1 {
  margin: 0;
  color: #2c3e50;
  font-size: 2rem;
}

.logout-btn {
  background: #dc3545;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
}

.dashboard-main {
  max-width: 1200px;
  margin: 0 auto;
}

.concert-management {
  background: rgba(255, 255, 255, 0.95);
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.concert-management h2 {
  margin: 0 0 30px 0;
  color: #2c3e50;
  font-size: 1.8rem;
  text-align: center;
  border-bottom: 3px solid #3498db;
  padding-bottom: 10px;
}

.action-section {
  margin-bottom: 30px;
  text-align: center;
}

.primary-btn {
  background: #007bff;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
}

.concert-form {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 5px;
  font-weight: bold;
  color: #495057;
}

.form-group input,
.form-group select {
  padding: 10px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 16px;
}

.submit-btn {
  background: #28a745;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
}

.submit-btn:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.concerts-list {
  margin-top: 30px;
}

.concert-card {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.concert-info h4 {
  margin: 0 0 10px 0;
  color: #2c3e50;
  font-size: 1.2rem;
}

.concert-actions {
  display: flex;
  gap: 10px;
}

.edit-btn,
.album-btn,
.view-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.edit-btn {
  background: #ffc107;
  color: #212529;
}

.album-btn {
  background: #17a2b8;
  color: white;
}

.view-btn {
  background: #6f42c1;
  color: white;
}

.edit-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 30px;
  border-radius: 12px;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-actions {
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  margin-top: 20px;
}

.cancel-btn {
  background: #6c757d;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
}

.album-section {
  background: #e7f3ff;
  border: 1px solid #b3d9ff;
  border-radius: 8px;
  padding: 20px;
  margin-top: 30px;
}

.album-management {
  margin-top: 20px;
}

.album-info {
  background: white;
  padding: 15px;
  border-radius: 6px;
  margin-bottom: 20px;
}

.upload-section {
  background: white;
  padding: 20px;
  border-radius: 6px;
  margin-bottom: 20px;
}

.media-gallery {
  background: white;
  padding: 20px;
  border-radius: 6px;
}

.media-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
  margin-top: 15px;
}

.media-item {
  border: 1px solid #dee2e6;
  border-radius: 6px;
  overflow: hidden;
}

.media-preview img,
.media-preview video {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

.media-info {
  padding: 10px;
  font-size: 14px;
}

.ai-summary-section {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 20px;
  margin-top: 30px;
}

.ai-actions {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

.ai-btn {
  background: #e83e8c;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
}

.ai-btn:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.summary-result {
  background: white;
  padding: 20px;
  border-radius: 6px;
  border-left: 4px solid #28a745;
}

.message {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 15px 20px;
  border-radius: 6px;
  max-width: 400px;
  z-index: 1001;
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

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }

  .concert-card {
    flex-direction: column;
    align-items: flex-start;
  }

  .concert-actions {
    margin-top: 15px;
    width: 100%;
    justify-content: space-between;
  }

  .ai-actions {
    flex-direction: column;
  }
}
</style>
