// services/api.js
import axiosInstance from "../utils/AxiosInstance";

// Authentication APIs
export const authAPI = {
  register: (userData) => axiosInstance.post("/users/register", userData),
  login: (credentials) => axiosInstance.post("/users/login", credentials),
  getCurrentUser: () => axiosInstance.get("/users/current-user"),
  logout: () => axiosInstance.post("/users/logout"),
  refreshToken: () => axiosInstance.post("/users/refresh-token"),
};

// User & Profile APIs
export const userAPI = {
  getGameProfile: () => axiosInstance.get("/users/game-profile"),
  addXP: (xpAmount) => axiosInstance.post("/users/add-xp", { xpAmount }),
  addCoins: (coinAmount) =>
    axiosInstance.post("/users/add-coins", { coinAmount }),
  getLeaderboardPosition: () => axiosInstance.post("/users/leaderboard"),
  updateQuizStats: (stats) =>
    axiosInstance.post("/users/update-quiz-stats", stats),
  updateUserDetails: (userData) =>
    axiosInstance.patch("/users/update-details", userData),
  updateUserAvatar: (formData) =>
    axiosInstance.patch("/users/update-avatar", formData),
  changePassword: (passwordData) =>
    axiosInstance.post("/users/change-password", passwordData),
};

// Quiz System APIs
export const quizAPI = {
  startQuiz: (quizData) => axiosInstance.post("/quizzes/start", quizData),
  startAdaptiveQuiz: (quizData) =>
    axiosInstance.post("/quizzes/start-adaptive", quizData),
  getNextQuestion: (sessionId) =>
    axiosInstance.get(`/quizzes/${sessionId}/next`),
  submitAnswer: (sessionId, answerData) =>
    axiosInstance.post(`/quizzes/${sessionId}/answer`, answerData),
  getQuizResults: (sessionId) =>
    axiosInstance.get(`/quizzes/${sessionId}/results`),
  getQuizHistory: (params) => axiosInstance.get("/quizzes/history", { params }),
  getSubjects: () => axiosInstance.get("/quizzes/subjects"),
  unlockSubject: (subject) =>
    axiosInstance.post("/quizzes/unlock-subject", { subject }),
};

// Pokémon Collection APIs
export const pokemonAPI = {
  getAllPokemons: (params) => axiosInstance.get("/pokemons", { params }),
  getUserCollection: () => axiosInstance.get("/pokemons/collection"),
  catchPokemon: (pokemonId) =>
    axiosInstance.post("/pokemons/catch", { pokemonId }),
  evolvePokemon: (pokemonId, evolutionId) =>
    axiosInstance.post(`/pokemons/${pokemonId}/evolve`, { evolutionId }),
};

// World Map APIs
export const worldMapAPI = {
  getProgress: () => axiosInstance.get("/world-map/progress"),
  unlockRegion: (regionId) =>
    axiosInstance.post("/world-map/unlock-region", { regionId }),
  getRecommended: () => axiosInstance.get("/world-map/recommended"),
  getRegionDetails: (regionId) =>
    axiosInstance.get(`/world-map/${regionId}/details`),
  getRegionLeaderboard: (regionId) =>
    axiosInstance.get(`/world-map/${regionId}/leaderboard`),
};

// Social & Leaderboard APIs
export const socialAPI = {
  getLeaderboard: (params) =>
    axiosInstance.get("/social/leaderboard", { params }),
  getFriends: () => axiosInstance.get("/social/friends"),
  getFriendRequests: () => axiosInstance.get("/social/friends/requests"),
  getFriendSuggestions: () => axiosInstance.get("/social/friends/suggestions"),
  sendFriendRequest: (friendUsername) =>
    axiosInstance.post("/social/friends/request", { friendUsername }),
  acceptFriendRequest: (requestId) =>
    axiosInstance.post(`/social/friends/requests/${requestId}/accept`),
  declineFriendRequest: (requestId) =>
    axiosInstance.delete(`/social/friends/requests/${requestId}/decline`),
  removeFriend: (friendId) =>
    axiosInstance.delete(`/social/friends/${friendId}`),
  getBadges: () => axiosInstance.get("/social/badges"),
  getBadgeStats: () => axiosInstance.get("/social/badges/stats"),
  shareBadge: (badgeId) =>
    axiosInstance.post("/social/badges/share", { badgeId }),
  shareVictory: (quizData) =>
    axiosInstance.post("/social/share/victory", { quizData }),
  shareLevelUp: () => axiosInstance.post("/social/share/level-up"),
  sharePokemonCatch: () => axiosInstance.post("/social/share/pokemon-catch"),
  getUserShares: () => axiosInstance.get("/social/shares"),
  getPopularShares: () => axiosInstance.get("/social/shares/popular"),
};

// Pokedex & Evolution APIs
export const pokedexAPI = {
  getPokedex: (params) => axiosInstance.get("/pokedex/pokedex", { params }),
  getPokedexStats: () => axiosInstance.get("/pokedex/stats"),
  getPokemonDetails: (pokemonId) => axiosInstance.get(`/pokedex/${pokemonId}`),
  toggleFavorite: (pokemonId) =>
    axiosInstance.patch(`/pokedex/${pokemonId}/favorite`),
  addResearchNotes: (pokemonId, notes) =>
    axiosInstance.patch(`/pokedex/${pokemonId}/notes`, { notes }),
  checkEvolutions: () => axiosInstance.get("/pokedex/evolutions/check"),
  evolvePokemon: (userPokemonId, evolutionId) =>
    axiosInstance.post("/pokedex/evolutions/evolve", {
      userPokemonId,
      evolutionId,
    }),
  getEvolutionHistory: () => axiosInstance.get("/pokedex/evolutions/history"),
  processAutoEvolutions: () =>
    axiosInstance.post("/pokedex/evolutions/auto-evolve"),
};

// Adaptive Learning APIs
export const adaptiveAPI = {
  getAdaptiveQuiz: (quizData) =>
    axiosInstance.post("/adaptive/adaptive-quiz", quizData),
  updatePerformance: (sessionId, performanceData) =>
    axiosInstance.post(`/adaptive/${sessionId}/performance`, performanceData),
  getAnalytics: () => axiosInstance.get("/adaptive/analytics"),
};

// Feedback & Notification APIs
export const feedbackAPI = {
  getDailyQuests: () => axiosInstance.get("/feedback/quests"),
  claimQuestReward: (questId) =>
    axiosInstance.post(`/feedback/quests/${questId}/claim`),
  getPerformanceInsights: () => axiosInstance.get("/feedback/insights"),
  markInsightRead: (insightId) =>
    axiosInstance.patch(`/feedback/insights/${insightId}/read`),
  getStreakInfo: () => axiosInstance.get("/feedback/streak"),
  getNotifications: (params) =>
    axiosInstance.get("/feedback/notifications", { params }),
  markNotificationRead: (notificationId) =>
    axiosInstance.patch(`/feedback/notifications/${notificationId}/read`),
  markAllNotificationsRead: () =>
    axiosInstance.patch("/feedback/notifications/read-all"),
};

// Health Check
export const healthAPI = {
  checkHealth: () => axiosInstance.get("/health"),
};
