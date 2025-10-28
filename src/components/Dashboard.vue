<template>
  <div class="dashboard">
    <header class="dashboard-header">
      <h1>🎵 Welcome to Venu, {{ userName }}!</h1>
      <div class="header-actions">
        <button @click="showSettings = true" class="settings-btn">
          ⚙️ Settings
        </button>
        <button @click="handleLogout" class="logout-btn">Logout</button>
      </div>
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
            class="concert-wrapper"
          >
            <div class="concert-card">
              <div class="concert-info">
                <h4>{{ concert.artist }}</h4>
                <p>
                  <strong>Date:</strong>
                  {{ new Date(concert.date).toLocaleString() }}
                </p>
                <p>
                  <strong>Venue:</strong> {{ concert.venue }},
                  {{ concert.city }}
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
                <button @click="deleteConcert(concert)" class="delete-btn">
                  Delete
                </button>
              </div>
            </div>

            <!-- Album displayed inline for this concert -->
            <div
              v-if="selectedConcert && selectedConcert._id === concert._id"
              class="inline-album-section"
            >
              <h4>📸 Media Album for {{ concert.artist }}</h4>

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
                  <p>
                    Album created:
                    {{ new Date(currentAlbum.createdAt).toLocaleString() }}
                  </p>
                </div>

                <!-- Upload Media -->
                <div class="upload-section">
                  <h5>Upload Media</h5>
                  <form @submit.prevent="handleUploadMedia">
                    <div class="form-group">
                      <label for="mediaFile">Select File (max 5MB):</label>
                      <input
                        id="mediaFile"
                        type="file"
                        accept="image/*,video/*"
                        @change="handleFileSelect"
                        ref="fileInput"
                        required
                      />
                      <p v-if="mediaForm.fileName" class="selected-file">
                        Selected: {{ mediaForm.fileName }} ({{
                          mediaForm.type
                        }})
                      </p>
                    </div>
                    <button
                      type="submit"
                      :disabled="loading || !mediaForm.file || !mediaForm.type"
                      class="submit-btn"
                    >
                      {{ loading ? "Uploading..." : "Upload Media" }}
                    </button>
                  </form>
                </div>

                <!-- Album Cover View -->
                <div v-if="albumMedia.length > 0" class="album-cover-section">
                  <h5>
                    {{ albumMedia.length }} Media Item{{
                      albumMedia.length !== 1 ? "s" : ""
                    }}
                  </h5>
                  <div class="album-cover-grid">
                    <div
                      v-for="(item, index) in albumMedia.slice(0, 4)"
                      :key="index"
                      class="album-thumbnail"
                      @click="openAlbumGallery(index)"
                    >
                      <img
                        v-if="item.type === 'photo' || item.type === 'Photo'"
                        :src="item.url"
                        :alt="`Photo ${index + 1}`"
                      />
                      <div v-else class="video-thumbnail">
                        <span>🎥</span>
                      </div>
                    </div>
                  </div>
                  <button @click="openAlbumGallery(0)" class="view-album-btn">
                    📖 Open Album ({{ albumMedia.length }} items)
                  </button>
                </div>
              </div>
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

        <!-- AI Summary Section -->
        <div class="ai-summary-section">
          <h3>🤖 AI Concert Statistics</h3>
          <div class="ai-actions">
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

    <!-- Album Gallery Modal -->
    <div
      v-if="showAlbumGallery"
      class="gallery-modal"
      @click="closeAlbumGallery"
    >
      <div class="gallery-backdrop"></div>
      <div class="gallery-content" @click.stop>
        <button class="close-gallery-btn" @click="closeAlbumGallery">
          &times;
        </button>
        <div class="gallery-main">
          <button
            v-if="currentGalleryIndex > 0"
            @click="prevMedia"
            class="gallery-nav gallery-prev"
          >
            ‹
          </button>

          <div class="gallery-media-container">
            <img
              v-if="
                currentMedia &&
                (currentMedia.type === 'photo' || currentMedia.type === 'Photo')
              "
              :src="currentMedia.url"
              alt="Gallery image"
              class="gallery-media"
            />
            <video
              v-else-if="
                currentMedia &&
                (currentMedia.type === 'video' || currentMedia.type === 'Video')
              "
              :src="currentMedia.url"
              controls
              class="gallery-media"
            ></video>
          </div>

          <button
            v-if="currentGalleryIndex < albumMedia.length - 1"
            @click="nextMedia"
            class="gallery-nav gallery-next"
          >
            ›
          </button>
        </div>
        <div class="gallery-info">
          <p>{{ currentGalleryIndex + 1 }} / {{ albumMedia.length }}</p>
          <button
            v-if="currentMedia"
            @click="deleteMediaItem(currentMedia.id)"
            class="delete-from-gallery-btn"
          >
            🗑️ Delete this item
          </button>
        </div>
      </div>
    </div>

    <!-- Account Settings Modal -->
    <div v-if="showSettings" class="settings-modal" @click="closeSettings">
      <div class="settings-backdrop"></div>
      <div class="settings-content" @click.stop>
        <button class="close-settings-btn" @click="closeSettings">
          &times;
        </button>
        <h3>⚙️ Account Settings</h3>

        <!-- Update Name Section -->
        <div class="settings-section">
          <h4>Update Display Name</h4>
          <form @submit.prevent="handleUpdateName">
            <div class="form-group">
              <label for="newName">New Name:</label>
              <input
                id="newName"
                v-model="settingsForm.newName"
                type="text"
                placeholder="Enter new name"
                required
              />
            </div>
            <button type="submit" :disabled="loading" class="submit-btn">
              {{ loading ? "Updating..." : "Update Name" }}
            </button>
          </form>
        </div>

        <!-- Update Password Section -->
        <div class="settings-section">
          <h4>Change Password</h4>
          <form @submit.prevent="handleUpdatePassword">
            <div class="form-group">
              <label for="currentPassword">Current Password:</label>
              <input
                id="currentPassword"
                v-model="settingsForm.currentPassword"
                type="password"
                placeholder="Enter current password"
                required
              />
            </div>
            <div class="form-group">
              <label for="newPassword">New Password:</label>
              <input
                id="newPassword"
                v-model="settingsForm.newPassword"
                type="password"
                placeholder="Enter new password"
                required
              />
            </div>
            <button type="submit" :disabled="loading" class="submit-btn">
              {{ loading ? "Updating..." : "Update Password" }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import {
  userAccountAPI,
  concertEventAPI,
  mediaAlbumAPI,
  concertStatsAAPI,
} from "../services/api.js";

const emit = defineEmits(["logout", "name-updated"]);

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
const fileInput = ref(null);
const fullSizeImageUrl = ref(null);
const showAlbumGallery = ref(false);
const currentGalleryIndex = ref(0);
const currentMedia = ref(null);
const showSettings = ref(false);

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
  file: null,
  dataUrl: "",
  fileName: "",
  type: "",
});

const settingsForm = reactive({
  newName: "",
  currentPassword: "",
  newPassword: "",
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

const deleteConcert = async (concert) => {
  if (
    !confirm(
      `Are you sure you want to delete this concert: ${concert.artist}? This will also delete any associated media albums.`
    )
  ) {
    return;
  }

  loading.value = true;
  message.value = "";

  try {
    const response = await concertEventAPI.deleteConcert(
      props.userId,
      concert._id
    );

    if (response.error) {
      message.value = `Failed to delete concert: ${response.error}`;
      messageType.value = "error";
    } else {
      // Remove from local concerts array
      concerts.value = concerts.value.filter((c) => c._id !== concert._id);

      // Close the album if viewing this concert's album
      if (selectedConcert.value && selectedConcert.value._id === concert._id) {
        selectedConcert.value = null;
        currentAlbum.value = null;
        albumMedia.value = [];
      }

      // Also remove from AI stats history
      try {
        await concertStatsAAPI.removeConcertFromHistory(
          props.userId,
          concert.artist,
          concert.venue,
          concert.date
        );
      } catch (error) {
        // Non-critical error, just log it
        console.warn("Failed to remove concert from AI history:", error);
      }

      message.value = "Concert deleted successfully!";
      messageType.value = "success";
    }
  } catch (error) {
    message.value = `Failed to delete concert: ${error.message}`;
    messageType.value = "error";
  } finally {
    loading.value = false;
  }
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
      console.log("Loaded album media:", albumMedia.value);
    } else {
      currentAlbum.value = null;
      albumMedia.value = [];
    }
  } catch (error) {
    console.error("Failed to load album:", error);
  }
};

const handleFileSelect = (event) => {
  const file = event.target.files[0];
  if (file) {
    // Check file size - limit to 5MB to avoid MongoDB 16MB BSON limit
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      message.value = "File too large. Please upload images smaller than 5MB.";
      messageType.value = "error";
      // Clear the file input
      if (fileInput.value) {
        fileInput.value.value = "";
      }
      mediaForm.file = null;
      mediaForm.fileName = "";
      mediaForm.dataUrl = "";
      mediaForm.type = "";
      return;
    }

    mediaForm.file = file;
    mediaForm.fileName = file.name;

    // Auto-detect type from file
    if (file.type.startsWith("image/")) {
      mediaForm.type = "photo";
    } else if (file.type.startsWith("video/")) {
      mediaForm.type = "video";
    }

    // Convert file to data URL for display
    const reader = new FileReader();
    reader.onload = (e) => {
      mediaForm.dataUrl = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const handleUploadMedia = async () => {
  loading.value = true;
  message.value = "";

  if (!mediaForm.file || !mediaForm.dataUrl) {
    message.value = "Please select a file first";
    messageType.value = "error";
    loading.value = false;
    return;
  }

  try {
    // Use the data URL as the "URL" for storage
    const response = await mediaAlbumAPI.uploadMedia(
      props.userId,
      currentAlbum.value._id,
      mediaForm.dataUrl,
      new Date().toISOString(),
      mediaForm.type
    );

    if (response.error) {
      message.value = `Failed to upload media: ${response.error}`;
      messageType.value = "error";
    } else {
      // Reload the album to get the updated media items with proper IDs
      const albumResponse = await mediaAlbumAPI.getMediaAlbum(
        currentAlbum.value._id
      );
      if (albumResponse.album) {
        albumMedia.value = albumResponse.album.mediaItems || [];
      }

      message.value = "Media uploaded successfully!";
      messageType.value = "success";

      // Reset form
      mediaForm.file = null;
      mediaForm.dataUrl = "";
      mediaForm.fileName = "";
      mediaForm.type = "";

      // Clear file input
      if (fileInput.value) {
        fileInput.value.value = "";
      }
    }
  } catch (error) {
    message.value = `Failed to upload media: ${error.message}`;
    messageType.value = "error";
  } finally {
    loading.value = false;
  }
};

const deleteMediaItem = async (mediaId) => {
  if (!confirm("Are you sure you want to delete this media item?")) {
    return;
  }

  loading.value = true;
  message.value = "";

  try {
    const response = await mediaAlbumAPI.deleteMedia(
      props.userId,
      currentAlbum.value._id,
      mediaId
    );

    if (response.error) {
      message.value = `Failed to delete media: ${response.error}`;
      messageType.value = "error";
    } else {
      // Remove from local media array
      albumMedia.value = albumMedia.value.filter((item) => item.id !== mediaId);

      // If in gallery mode, update the gallery
      if (showAlbumGallery.value) {
        if (albumMedia.value.length === 0) {
          closeAlbumGallery();
        } else if (currentGalleryIndex.value >= albumMedia.value.length) {
          currentGalleryIndex.value = albumMedia.value.length - 1;
          currentMedia.value = albumMedia.value[currentGalleryIndex.value];
        } else {
          currentMedia.value = albumMedia.value[currentGalleryIndex.value];
        }
      }

      message.value = "Media deleted successfully!";
      messageType.value = "success";
    }
  } catch (error) {
    message.value = `Failed to delete media: ${error.message}`;
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

const formatTimestamp = (timestamp) => {
  if (!timestamp) return "Unknown date";

  // Handle both Date objects and ISO strings
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp);

  // Check if date is valid
  if (isNaN(date.getTime())) {
    console.warn("Invalid timestamp:", timestamp);
    return "Invalid date";
  }

  return date.toLocaleString();
};

const handleImageError = (event) => {
  console.error("Image failed to load:", event.target.src);
  event.target.style.display = "none";
};

const handleVideoError = (event) => {
  console.error("Video failed to load:", event.target.src);
  event.target.style.display = "none";
};

const openAlbumGallery = (startIndex) => {
  currentGalleryIndex.value = startIndex;
  currentMedia.value = albumMedia.value[startIndex];
  showAlbumGallery.value = true;
};

const closeAlbumGallery = () => {
  showAlbumGallery.value = false;
  currentGalleryIndex.value = 0;
  currentMedia.value = null;
};

const nextMedia = () => {
  if (currentGalleryIndex.value < albumMedia.value.length - 1) {
    currentGalleryIndex.value++;
    currentMedia.value = albumMedia.value[currentGalleryIndex.value];
  }
};

const prevMedia = () => {
  if (currentGalleryIndex.value > 0) {
    currentGalleryIndex.value--;
    currentMedia.value = albumMedia.value[currentGalleryIndex.value];
  }
};

const viewFullImage = (imageUrl) => {
  fullSizeImageUrl.value = imageUrl;
};

const closeFullImage = () => {
  fullSizeImageUrl.value = null;
};

const closeSettings = () => {
  showSettings.value = false;
  settingsForm.newName = "";
  settingsForm.currentPassword = "";
  settingsForm.newPassword = "";
};

const handleUpdateName = async () => {
  loading.value = true;
  message.value = "";

  try {
    const response = await userAccountAPI.updateName(
      props.userId,
      settingsForm.newName
    );

    if (response.error) {
      message.value = `Failed to update name: ${response.error}`;
      messageType.value = "error";
    } else {
      message.value = "Name updated successfully!";
      messageType.value = "success";

      // Update the userName prop by emitting an event
      emit("name-updated", settingsForm.newName);

      // Close settings and reset form
      settingsForm.newName = "";
    }
  } catch (error) {
    message.value = `Failed to update name: ${error.message}`;
    messageType.value = "error";
  } finally {
    loading.value = false;
  }
};

const handleUpdatePassword = async () => {
  loading.value = true;
  message.value = "";

  try {
    const response = await userAccountAPI.updatePassword(
      props.userId,
      settingsForm.currentPassword,
      settingsForm.newPassword
    );

    if (response.error) {
      message.value = `Failed to update password: ${response.error}`;
      messageType.value = "error";
    } else {
      message.value = "Password updated successfully!";
      messageType.value = "success";

      // Close settings and reset form
      settingsForm.currentPassword = "";
      settingsForm.newPassword = "";
    }
  } catch (error) {
    message.value = `Failed to update password: ${error.message}`;
    messageType.value = "error";
  } finally {
    loading.value = false;
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
  background: linear-gradient(135deg, #a6b1e1 0%, #424874 100%);
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
  color: #424874;
  font-size: 2rem;
}

.logout-btn {
  background: #ca6b75;
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
  color: #424874;
  font-size: 1.8rem;
  text-align: center;
  border-bottom: 3px solid #a6b1e1;
  padding-bottom: 10px;
}

.action-section {
  margin-bottom: 30px;
  text-align: center;
}

.primary-btn {
  background: #a6b1e1;
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
  color: #424874;
}

.form-group input,
.form-group select {
  padding: 10px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 16px;
}

.submit-btn {
  background: #a6b1e1;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
}

.submit-btn:hover {
  background: #424874;
}

.submit-btn:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.concerts-list {
  margin-top: 30px;
}

.concert-wrapper {
  margin-bottom: 30px;
}

.concert-card {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.inline-album-section {
  background: white;
  border: 2px solid #6f42c1;
  border-top: none;
  border-radius: 0 0 8px 8px;
  padding: 20px;
  margin-top: -5px;
}

.inline-album-section h4 {
  margin: 0 0 15px 0;
  color: #6f42c1;
  font-size: 1.1rem;
}

.inline-album-section h5 {
  margin: 15px 0 10px 0;
  color: #424874;
  font-size: 1rem;
  font-weight: 600;
}

.concert-info h4 {
  margin: 0 0 10px 0;
  color: #424874;
  font-size: 1.2rem;
}

.concert-actions {
  display: flex;
  gap: 10px;
}

.edit-btn,
.album-btn,
.view-btn,
.delete-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.edit-btn {
  background: #ffe596;
  color: #212529;
}

.album-btn {
  background: #6ba8b2;
  color: white;
}

.view-btn {
  background: #424874;
  color: white;
}

.delete-btn {
  background: #ca6b75;
  color: white;
}

.delete-btn:hover {
  background: #c82333;
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
  background: #dcd6f7;
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

.selected-file {
  margin-top: 10px;
  padding: 8px;
  background: #dcd6f7;
  border-radius: 4px;
  font-size: 14px;
  color: #424874;
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

.delete-media-btn {
  background: #dc3545;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  margin-top: 8px;
  width: 100%;
}

.delete-media-btn:hover {
  background: #c82333;
}

.fallback-text {
  padding: 40px;
  text-align: center;
  color: #6c757d;
}

.image-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  cursor: pointer;
}

.modal-content-large {
  position: relative;
  max-width: 90%;
  max-height: 90%;
  z-index: 2001;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-button {
  position: absolute;
  top: -40px;
  right: -40px;
  background: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 30px;
  cursor: pointer;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  transition: all 0.3s;
}

.close-button:hover {
  background: #f0f0f0;
  transform: scale(1.1);
}

.full-size-image {
  max-width: 100%;
  max-height: 90vh;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
}

/* Album Cover Styles */
.album-cover-section {
  margin-top: 20px;
}

.album-cover-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 15px;
}

.album-thumbnail {
  aspect-ratio: 1;
  overflow: hidden;
  border-radius: 8px;
  border: 2px solid #dee2e6;
  cursor: pointer;
  transition: all 0.3s;
  background: #f8f9fa;
}

.album-thumbnail:hover {
  transform: scale(1.05);
  border-color: #6f42c1;
  box-shadow: 0 4px 12px rgba(111, 66, 193, 0.3);
}

.album-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.video-thumbnail {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
}

.view-album-btn {
  width: 100%;
  background: #424874;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s;
}

.view-album-btn:hover {
  background: #a6b1e1;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(111, 66, 193, 0.4);
}

/* Gallery Modal Styles */
.gallery-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 3000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.gallery-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
}

.gallery-content {
  position: relative;
  width: 95%;
  height: 95%;
  max-width: 1400px;
  max-height: 900px;
  background: rgba(20, 20, 20, 0.98);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  z-index: 3001;
}

.close-gallery-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  z-index: 3002;
}

.close-gallery-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: rotate(90deg);
}

.gallery-main {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  position: relative;
}

.gallery-media-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 90%;
  max-height: 80vh;
}

.gallery-media {
  max-width: 100%;
  max-height: 80vh;
  object-fit: contain;
  border-radius: 8px;
}

.gallery-nav {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  font-size: 60px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  line-height: 1;
}

.gallery-nav:hover {
  background: rgba(255, 255, 255, 0.4);
  transform: scale(1.1);
}

.gallery-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
  color: white;
  padding-top: 15px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.gallery-info p {
  margin: 0;
  font-size: 16px;
}

.delete-from-gallery-btn {
  background: #ca6b75;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.delete-from-gallery-btn:hover {
  background: #c82333;
  transform: scale(1.05);
}

.header-actions {
  display: flex;
  gap: 10px;
}

.settings-btn {
  background: #a6b1e1;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s;
}

.settings-btn:hover {
  background: #424874;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(166, 177, 225, 0.4);
}

.settings-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 4000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.settings-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
}

.settings-content {
  position: relative;
  background: white;
  padding: 30px;
  border-radius: 12px;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  z-index: 4001;
}

.close-settings-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  background: #f8f9fa;
  color: #333;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.close-settings-btn:hover {
  background: #e9ecef;
  transform: rotate(90deg);
}

.settings-content h3 {
  margin: 0 0 20px 0;
  color: #424874;
}

.settings-section {
  margin: 25px 0;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #a6b1e1;
}

.settings-section h4 {
  margin: 0 0 15px 0;
  color: #424874;
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
  justify-content: center;
}

.ai-btn {
  background: #b87996;
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
  border-left: 4px solid #a6b1e1;
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
