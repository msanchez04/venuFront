const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api";

/**
 * Generic API call function for all backend endpoints
 * @param {string} endpoint - The API endpoint path
 * @param {Object} data - Request body data
 * @returns {Promise<Object>} - Response data
 */
export async function apiCall(endpoint, data = {}) {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error);
    throw error;
  }
}

// Backend API is now available and working
console.log(`✅ Using backend API at ${API_BASE}`);

// UserAccount API calls
export const userAccountAPI = {
  register: (name, email, password) =>
    apiCall("/UserAccount/register", { name, email, password }),

  login: (email, password) =>
    apiCall("/UserAccount/login", { email, password }),

  updateName: (user, newName) =>
    apiCall("/UserAccount/updateName", { user, newName }),

  updatePassword: (user, currentPassword, newPassword) =>
    apiCall("/UserAccount/updatePassword", {
      user,
      currentPassword,
      newPassword,
    }),
};

// ConcertEvent API calls
export const concertEventAPI = {
  addConcert: (user, artist, date, venue, city) =>
    apiCall("/ConcertEvent/addConcert", { user, artist, date, venue, city }),

  editConcertDetails: (concert, newArtist, newDate, newVenue, newCity) =>
    apiCall("/ConcertEvent/editConcertDetails", {
      concert,
      newArtist,
      newDate,
      newVenue,
      newCity,
    }),

  getConcertsByUser: (user) =>
    apiCall("/ConcertEvent/_getConcertsByUser", { user }),

  deleteConcert: (user, concert) =>
    apiCall("/ConcertEvent/deleteConcert", { user, concert }),
};

// MediaAlbum API calls
export const mediaAlbumAPI = {
  createAlbum: (user, concert) =>
    apiCall("/MediaAlbum/createAlbum", { user, concert }),

  uploadMedia: (user, album, url, uploadTimestamp, type) =>
    apiCall("/MediaAlbum/uploadMedia", {
      user,
      album,
      url,
      uploadTimestamp,
      type,
    }),

  getMediaAlbum: (album) => apiCall("/MediaAlbum/_getMediaAlbum", { album }),

  getAlbumsByUserAndConcert: (user, concert) =>
    apiCall("/MediaAlbum/_getAlbumsByUserAndConcert", { user, concert }),

  deleteMedia: (user, album, mediaId) =>
    apiCall("/MediaAlbum/deleteMedia", { user, album, mediaId }),
};

// ConcertStatsAI API calls
export const concertStatsAAPI = {
  initializeUser: (user) => apiCall("/ConcertStatsAI/initializeUser", { user }),

  logConcert: (user, artist, venue, date) =>
    apiCall("/ConcertStatsAI/logConcert", { user, artist, venue, date }),

  removeConcertFromHistory: (user, artist, venue, date) =>
    apiCall("/ConcertStatsAI/removeConcertFromHistory", {
      user,
      artist,
      venue,
      date,
    }),

  generateSummaryAI: (user) =>
    apiCall("/ConcertStatsAI/generateSummaryAI", { user }),

  getStatsRecord: (user) =>
    apiCall("/ConcertStatsAI/_getStatsRecord", { user }),
};
