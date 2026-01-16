// API Configuration
const API_CONFIG = {
  development: {
    API_URL: "http://localhost:3333/api",
    BASE_URL: "http://localhost:3333"
  },
  production: {
    API_URL: "https://code-web-n-gi-n.onrender.com/api",
    BASE_URL: "https://code-web-n-gi-n.onrender.com"
  }
};

// Auto detect environment
const ENV = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" 
  ? "development" 
  : "production";

// Export config
const CONFIG = API_CONFIG[ENV];

console.log(`🌍 Running in ${ENV} mode`);
console.log(`📡 API URL: ${CONFIG.API_URL}`);
