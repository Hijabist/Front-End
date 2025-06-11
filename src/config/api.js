const CONFIG = {
  BASE_URL: 'https://back-end-production-f224.up.railway.app/api'
};

const ENDPOINTS = {
  LOGIN: `${CONFIG.BASE_URL}/auth/login`,
  REGISTER: `${CONFIG.BASE_URL}/auth/register`,
  PREDICT_FACE_SHAPE: `${CONFIG.BASE_URL}/predict/face-shape`,
  PREDICT_SKIN_TONE: `${CONFIG.BASE_URL}/predict/skin-tone`,
  AUTH_PROFILE: `${CONFIG.BASE_URL}/auth/profile`,
};

export { CONFIG, ENDPOINTS };