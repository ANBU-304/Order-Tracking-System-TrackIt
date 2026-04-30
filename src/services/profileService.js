// src/services/profileService.js

const API_BASE_URL = 'http://localhost:8086/api/profile';

export const profileService = {
  // Create or Update Profile (POST)
  saveProfile: async (profileData) => {
    try {
      const response = await fetch(`${API_BASE_URL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || `HTTP error! status: ${response.status}`);
      }
      
      return result;
    } catch (error) {
      console.error('Error saving profile:', error);
      throw error;
    }
  },

  // Get User Profile by Email
  getUserProfile: async (email) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/login?email=${encodeURIComponent(email)}`
      );
      
      const result = await response.json();
      
      // Return null if profile doesn't exist (404)
      if (!response.ok || !result.success) {
        return null;
      }

      return result.data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  },

  // Update User Profile by Email (Creates if not exists)
  updateUserProfile: async (email, profileData) => {
    try {
      const profilePayload = {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        email: email,
        phoneNumber: profileData.phone,
        geographicData: {
          street: profileData.address,
          city: profileData.city,
          state: profileData.state,
          zipCode: profileData.zipCode,
          country: profileData.country
        }
      };

      const response = await fetch(`${API_BASE_URL}/email/${encodeURIComponent(email)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profilePayload)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to save profile');
      }

      return result;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },

  // Login - Get Profile by Email
  loginByEmail: async (email) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/login?email=${encodeURIComponent(email)}`
      );
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || `HTTP error! status: ${response.status}`);
      }
      
      return result;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  },

  // Get Profile by ID
  getProfileById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`);
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || `HTTP error! status: ${response.status}`);
      }
      
      return result;
    } catch (error) {
      console.error('Error getting profile:', error);
      throw error;
    }
  },

  // Update Profile by ID
  updateProfile: async (id, profileData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || `HTTP error! status: ${response.status}`);
      }
      
      return result;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },

  // Delete Profile
  deleteProfile: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || `HTTP error! status: ${response.status}`);
      }
      
      return result;
    } catch (error) {
      console.error('Error deleting profile:', error);
      throw error;
    }
  },

  // Check if email exists
  checkEmail: async (email) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/check-email?email=${encodeURIComponent(email)}`
      );
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || `HTTP error! status: ${response.status}`);
      }
      
      return result;
    } catch (error) {
      console.error('Error checking email:', error);
      throw error;
    }
  },

  // Get All Profiles
  getAllProfiles: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}`);
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || `HTTP error! status: ${response.status}`);
      }
      
      return result;
    } catch (error) {
      console.error('Error getting all profiles:', error);
      throw error;
    }
  },
};