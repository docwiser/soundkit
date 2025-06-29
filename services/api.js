const BASE_URL = 'https://saavn.dev/api';

export const saavnAPI = {
  // Global search
  search: async (query, limit = 10) => {
    try {
      const response = await fetch(`${BASE_URL}/search?query=${encodeURIComponent(query)}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Search error:', error);
      throw error;
    }
  },

  // Search songs with pagination
  searchSongs: async (query, page = 0, limit = 20) => {
    try {
      const response = await fetch(`${BASE_URL}/search/songs?query=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Search songs error:', error);
      throw error;
    }
  },

  // Search albums
  searchAlbums: async (query, page = 0, limit = 20) => {
    try {
      const response = await fetch(`${BASE_URL}/search/albums?query=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Search albums error:', error);
      throw error;
    }
  },

  // Search artists
  searchArtists: async (query, page = 0, limit = 20) => {
    try {
      const response = await fetch(`${BASE_URL}/search/artists?query=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Search artists error:', error);
      throw error;
    }
  },

  // Search playlists
  searchPlaylists: async (query, page = 0, limit = 20) => {
    try {
      const response = await fetch(`${BASE_URL}/search/playlists?query=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Search playlists error:', error);
      throw error;
    }
  },

  // Get song by ID
  getSong: async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/songs/${id}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Get song error:', error);
      throw error;
    }
  },

  // Get multiple songs by IDs
  getSongs: async (ids) => {
    try {
      const response = await fetch(`${BASE_URL}/songs?ids=${ids.join(',')}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Get songs error:', error);
      throw error;
    }
  },

  // Get song suggestions
  getSongSuggestions: async (id, limit = 20) => {
    try {
      const response = await fetch(`${BASE_URL}/songs/${id}/suggestions?limit=${limit}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Get suggestions error:', error);
      throw error;
    }
  },

  // Get album
  getAlbum: async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/albums?id=${id}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Get album error:', error);
      throw error;
    }
  },

  // Get artist
  getArtist: async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/artists/${id}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Get artist error:', error);
      throw error;
    }
  },

  // Get artist songs
  getArtistSongs: async (id, page = 0, sortBy = 'popularity', sortOrder = 'desc') => {
    try {
      const response = await fetch(`${BASE_URL}/artists/${id}/songs?page=${page}&sortBy=${sortBy}&sortOrder=${sortOrder}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Get artist songs error:', error);
      throw error;
    }
  },

  // Get artist albums
  getArtistAlbums: async (id, page = 0, sortBy = 'popularity', sortOrder = 'desc') => {
    try {
      const response = await fetch(`${BASE_URL}/artists/${id}/albums?page=${page}&sortBy=${sortBy}&sortOrder=${sortOrder}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Get artist albums error:', error);
      throw error;
    }
  },

  // Get playlist
  getPlaylist: async (id, page = 0, limit = 50) => {
    try {
      const response = await fetch(`${BASE_URL}/playlists?id=${id}&page=${page}&limit=${limit}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Get playlist error:', error);
      throw error;
    }
  }
};