const API_BASE_URL = "http://localhost:8000/api";

/**
 * Generic API call function for all backend endpoints
 * @param {string} endpoint - The API endpoint path
 * @param {Object} data - Request body data
 * @returns {Promise<Object>} - Response data
 */
export async function apiCall(endpoint, data = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
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
console.log("✅ Using real backend API at http://localhost:8000");

// UserAccount API calls
export const userAccountAPI = {
  register: (name, email, password) =>
    apiCall("/userAccount/register", { name, email, password }),

  login: (email, password) =>
    apiCall("/userAccount/login", { email, password }),
};

// ConcertEvent API calls
export const concertEventAPI = {
  addConcert: (user, artist, date, venue, city) =>
    apiCall("/concertEvent/addConcert", { user, artist, date, venue, city }),

  editConcertDetails: (concert, newArtist, newDate, newVenue, newCity) =>
    apiCall("/concertEvent/editConcertDetails", {
      concert,
      newArtist,
      newDate,
      newVenue,
      newCity,
    }),
};

// MediaAlbum API calls
export const mediaAlbumAPI = {
  createAlbum: (user, concert) =>
    apiCall("/mediaAlbum/createAlbum", { user, concert }),

  uploadMedia: (user, album, url, uploadTimestamp, type) =>
    apiCall("/mediaAlbum/uploadMedia", {
      user,
      album,
      url,
      uploadTimestamp,
      type,
    }),

  getMediaAlbum: (album) => apiCall("/mediaAlbum/_getMediaAlbum", { album }),

  getAlbumsByUserAndConcert: (user, concert) =>
    apiCall("/mediaAlbum/_getAlbumsByUserAndConcert", { user, concert }),
};

// ConcertStatsAI API calls
export const concertStatsAAPI = {
  initializeUser: (user) => apiCall("/concertStatsAI/initializeUser", { user }),

  logConcert: (user, artist, venue, date) =>
    apiCall("/concertStatsAI/logConcert", { user, artist, venue, date }),

  generateSummaryAI: (user) =>
    apiCall("/concertStatsAI/generateSummaryAI", { user }),
};
