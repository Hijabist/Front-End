import {
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
} from "firebase/auth";
import {
  doc,
  getDoc,
} from "firebase/firestore";
import { auth, db } from "../../firebase";
export class AuthService {  // Login with email and password
  static async loginWithEmail(auth, email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      if (!user) {
        throw new Error("Login failed. Please check your credentials.");
      }
      const token = await user.getIdToken();

      // Fetch displayName from Firestore users collection
      let displayName = user.displayName;
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          displayName = userData.displayName || userData.name || user.displayName;
        }
      } catch (firestoreError) {
        console.warn("Failed to fetch user data from Firestore:", firestoreError);
      }

      return {
        uid: user.uid,
        displayName: displayName,
        email: user.email,
        token: token,
      };
    } catch (error) {
      console.error("Login error:", error);
      throw this.handleAuthError(error);
    }
  }

  // Logout
  static async logout() {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  }

  // Send password reset email
  static async sendPasswordReset(email) {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error("Password reset error:", error);
      throw this.handleAuthError(error);
    }
  }
  // Get current user data
  static async getCurrentUserData() {
    try {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const userData = userDoc.exists() ? userDoc.data() : {};

        return {
          uid: user.uid,
          email: user.email,
          name: user.displayName || userData.name || "",
          username: userData.username || user.email.split("@")[0],
          photoURL: user.photoURL || userData.photoURL || "",
          emailVerified: user.emailVerified,
          ...userData,
        };
      }
      return null;
    } catch (error) {
      console.error("Get user data error:", error);
      return null;
    }
  }

  // Auth state listener
  static onAuthStateChange(callback) {
    return onAuthStateChanged(auth, callback);
  }

  // Handle Firebase Auth errors
  static handleAuthError(error) {
    const errorMessages = {
      "auth/user-not-found":
        "Tidak ditemukan pengguna dengan alamat email ini.",
      "auth/wrong-password": "Password salah.",
      "auth/email-already-in-use": "Alamat email sudah terdaftar.",
      "auth/weak-password": "Password harus minimal 6 karakter.",
      "auth/invalid-email": "Alamat email tidak valid.",
      "auth/too-many-requests":
        "Terlalu banyak percobaan gagal. Coba lagi nanti.",
      "auth/network-request-failed":
        "Error jaringan. Periksa koneksi internet Anda.",
      "auth/invalid-credential": "Kredensial tidak valid.",
      "auth/requires-recent-login": "Operasi ini memerlukan login ulang.",
    };

    return new Error(
      errorMessages[error.code] ||
        error.message ||
        "Terjadi kesalahan yang tidak diketahui."
    );
  }
}
