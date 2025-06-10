import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../config/firebaseConfig';

export class AuthService {
  // Login with email and password
  static async loginWithEmail(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Get additional user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userData = userDoc.exists() ? userDoc.data() : {};
      
      // Update last login time
      await updateDoc(doc(db, 'users', user.uid), {
        lastLoginAt: new Date().toISOString()
      });
      
      return {
        uid: user.uid,
        email: user.email,
        name: user.displayName || userData.name || '',
        username: userData.username || user.email.split('@')[0],
        photoURL: user.photoURL || userData.photoURL || '',
        emailVerified: user.emailVerified,
        createdAt: userData.createdAt || user.metadata.creationTime,
        lastLoginAt: new Date().toISOString(),
        preferences: userData.preferences || {
          theme: 'light',
          language: 'id',
          notifications: true
        },
        analyses: userData.analyses || [],
        ...userData
      };
    } catch (error) {
      console.error('Login error:', error);
      throw this.handleAuthError(error);
    }
  }
  // Register new user
  static async registerWithEmail(email, password, userData) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save additional user data to Firestore
      const userDocData = {
        name: userData.name,
        email: user.email,
        username: userData.username || user.email.split('@')[0],
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        emailVerified: user.emailVerified,
        preferences: {
          theme: 'light',
          language: 'id',
          notifications: true
        },
        analyses: [],
        profile: {
          bio: '',
          location: '',
          website: '',
          dateOfBirth: ''
        }
      };

      await setDoc(doc(db, 'users', user.uid), userDocData);

      return {
        uid: user.uid,
        email: user.email,
        name: userData.name,
        username: userDocData.username,
        emailVerified: user.emailVerified,
        ...userDocData
      };
    } catch (error) {
      console.error('Registration error:', error);
      throw this.handleAuthError(error);
    }
  }

  // Logout
  static async logout() {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  // Send password reset email
  static async sendPasswordReset(email) {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('Password reset error:', error);
      throw this.handleAuthError(error);
    }
  }
  // Get current user data
  static async getCurrentUserData() {
    try {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const userData = userDoc.exists() ? userDoc.data() : {};
        
        return {
          uid: user.uid,
          email: user.email,
          name: user.displayName || userData.name || '',
          username: userData.username || user.email.split('@')[0],
          photoURL: user.photoURL || userData.photoURL || '',
          emailVerified: user.emailVerified,
          ...userData
        };
      }
      return null;
    } catch (error) {
      console.error('Get user data error:', error);
      return null;
    }
  }

  // Save user analysis
  static async saveUserAnalysis(analysisData) {
    try {
      const user = auth.currentUser;
      if (user) {
        // Save to analyses collection
        const analysisDoc = await addDoc(collection(db, 'analyses'), {
          userId: user.uid,
          ...analysisData,
          createdAt: new Date().toISOString()
        });

        // Update user's analyses array
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const userData = userDoc.exists() ? userDoc.data() : {};
        const analyses = userData.analyses || [];
        
        analyses.unshift({
          id: analysisDoc.id,
          ...analysisData,
          createdAt: new Date().toISOString()
        });

        // Keep only last 10 analyses in user document
        const limitedAnalyses = analyses.slice(0, 10);

        await updateDoc(doc(db, 'users', user.uid), {
          analyses: limitedAnalyses,
          updatedAt: new Date().toISOString()
        });

        return analysisDoc.id;
      } else {
        throw new Error('No authenticated user');
      }
    } catch (error) {
      console.error('Save analysis error:', error);
      throw error;
    }
  }

  // Get user analyses
  static async getUserAnalyses(limit = 10) {
    try {
      const user = auth.currentUser;
      if (user) {
        const q = query(
          collection(db, 'analyses'), 
          where('userId', '==', user.uid)
        );
        const querySnapshot = await getDocs(q);
        
        const analyses = [];
        querySnapshot.forEach((doc) => {
          analyses.push({
            id: doc.id,
            ...doc.data()
          });
        });

        // Sort by creation date (newest first)
        analyses.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        return analyses.slice(0, limit);
      }
      return [];
    } catch (error) {
      console.error('Get analyses error:', error);
      return [];
    }
  }

  // Delete user analysis
  static async deleteUserAnalysis(analysisId) {
    try {
      const user = auth.currentUser;
      if (user) {
        // Remove from analyses collection
        await deleteDoc(doc(db, 'analyses', analysisId));

        // Update user's analyses array
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const userData = userDoc.exists() ? userDoc.data() : {};
        const analyses = userData.analyses || [];
        
        const updatedAnalyses = analyses.filter(analysis => analysis.id !== analysisId);

        await updateDoc(doc(db, 'users', user.uid), {
          analyses: updatedAnalyses,
          updatedAt: new Date().toISOString()
        });

        return true;
      } else {
        throw new Error('No authenticated user');
      }
    } catch (error) {
      console.error('Delete analysis error:', error);
      throw error;
    }
  }

  // Auth state listener
  static onAuthStateChange(callback) {
    return onAuthStateChanged(auth, callback);
  }

  // Handle Firebase Auth errors
  static handleAuthError(error) {
    const errorMessages = {
      'auth/user-not-found': 'Tidak ditemukan pengguna dengan alamat email ini.',
      'auth/wrong-password': 'Password salah.',
      'auth/email-already-in-use': 'Alamat email sudah terdaftar.',
      'auth/weak-password': 'Password harus minimal 6 karakter.',
      'auth/invalid-email': 'Alamat email tidak valid.',
      'auth/user-disabled': 'Akun ini telah dinonaktifkan.',
      'auth/too-many-requests': 'Terlalu banyak percobaan gagal. Coba lagi nanti.',
      'auth/network-request-failed': 'Error jaringan. Periksa koneksi internet Anda.',
      'auth/invalid-credential': 'Kredensial tidak valid.',
      'auth/requires-recent-login': 'Operasi ini memerlukan login ulang.',
    };

    return new Error(errorMessages[error.code] || error.message || 'Terjadi kesalahan yang tidak diketahui.');
  }
}