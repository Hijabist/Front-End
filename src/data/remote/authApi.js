import { ENDPOINTS } from '../../config/api.js';

export async function register(displayName, email, password) {
  try {
    // Create URLSearchParams for x-www-form-urlencoded format
    const formData = new URLSearchParams();
    formData.append('displayName', displayName);
    formData.append('email', email);
    formData.append('password', password);
        
    const response = await fetch(ENDPOINTS.REGISTER, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData,
    });

    // If somehow we can read the response (shouldn't happen with no-cors)
    const result = await response.json();
    
    if (result.error === "true") {
      throw new Error(result.message || "Registration failed");
    }

    return result;  } catch (error) {
    console.error("[register] Error:", error);
    
    // Handle specific CORS errors
    if (error.message.includes('CORS') || error.message.includes('fetch')) {
      throw new Error("Unable to connect to server. Please check if the backend is running and CORS is properly configured.");
    }
    
    throw error;
  }
}