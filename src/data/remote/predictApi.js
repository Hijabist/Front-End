import { ENDPOINTS } from "../../config/api.js";
import { getAuth } from "firebase/auth";

export class PredictApiService {
  async getAuthToken() {
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (!currentUser) {
        throw new Error("User not authenticated");
      }

      const token = await currentUser.getIdToken();
      return token;
    } catch (error) {
      console.error("❌ Failed to get Firebase auth token:", error);
      throw error;
    }
  }

  async predictFaceShape(imageFile, token) {
    try {
      const formData = new FormData();
      formData.append("image", imageFile);

      const response = await fetch(ENDPOINTS.PREDICT_FACE_SHAPE, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Face shape prediction failed: ${response.status} - ${errorText}`);
      }

      const json = await response.json();
      const result = json.result;

      return {
        shape: result.predicted_face_shape,
        confidence: result.confidence_raw ?? 0,
        allProbabilities: result.all_probabilities,
        recommendations: result.hijabRecomendation?.recommendations || [],
        description: `Recommended hijab styles for ${result.predicted_face_shape} face.`,
      };
    } catch (error) {
      console.error("❌ Face shape prediction error:", error);
      throw error;
    }
  }

  async predictSkinTone(imageFile, token) {
    try {
      const formData = new FormData();
      formData.append("image", imageFile);

      const response = await fetch(ENDPOINTS.PREDICT_SKIN_TONE, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Skin tone prediction failed: ${response.status} - ${errorText}`);
      }

      const json = await response.json();
      const result = json.result.color_recommendation;

      return {
        tone: result.skin_tone,
        recommendedGroups: result.recommended_groups,
        confidence: 0.8,
      };
    } catch (error) {
      console.error("❌ Skin tone prediction error:", error);
      throw error;
    }
  }

  async performCombinedAnalysis(imageFile) {
    try {
      const token = await this.getAuthToken();
      const [faceShapeResult, skinToneResult] = await Promise.all([
        this.predictFaceShape(imageFile, token),
        this.predictSkinTone(imageFile, token),
      ]);

      const result = {
        faceShape: {
          type: faceShapeResult.shape,
          confidence: faceShapeResult.confidence,
          description: faceShapeResult.description,
          allProbabilities: faceShapeResult.allProbabilities,
          recommendations: faceShapeResult.recommendations,
        },
        skinTone: {
          type: skinToneResult.tone,
          recommendedGroups: skinToneResult.recommendedGroups,
          confidence: skinToneResult.confidence,
        },
        timestamp: new Date().toISOString(),
      };

      return result;
    } catch (error) {
      console.error("❌ Combined analysis error:", error);
      throw error;
    }
  }
}

export const predictApiService = new PredictApiService();
