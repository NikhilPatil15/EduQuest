I'll update the README.md file to include the PvP Battle Socket documentation. Here's the updated version:

````markdown
# 🎮 EduQuest Pokémon Learning Platform - API Documentation

## 📋 Table of Contents

- [Authentication Routes](#authentication-routes)
- [User & Profile Routes](#user--profile-routes)
- [Quiz System Routes](#quiz-system-routes)
- [Pokémon Collection Routes](#pokémon-collection-routes)
- [World Map & Progression Routes](#world-map--progression-routes)
- [Social & Leaderboard Routes](#social--leaderboard-routes)
- [Feedback & Notification Routes](#feedback--notification-routes)
- [Pokedex & Evolution Routes](#pokedex--evolution-routes)
- [Adaptive Learning Routes](#adaptive-learning-routes)
- [PvP Battle System](#pvp-battle-system) 🆕

---

## 🔐 Authentication Routes

### **POST** `/api/v1/users/register`

Register a new user.

**Request Body:**

```json
{
	"userName": "ashketchum",
	"email": "ash@pokemon.com",
	"password": "pikachu123",
	"fullName": "Ash Ketchum"
}
```
````

**Response:**

```json
{
  "success": true,
  "data": {
    "user": { ... },
    "accessToken": "eyJ...",
    "refreshToken": "eyJ..."
  },
  "message": "User registered successfully"
}
```

### **POST** `/api/v1/users/login`

Login user.

**Request Body:**

```json
{
	"email": "ash@pokemon.com",
	"password": "pikachu123"
}
```

**Response:** Same as register

### **GET** `/api/v1/users/current-user`

Get current user profile (Requires Auth)

**Headers:**

```
Authorization: Bearer <accessToken>
```

---

## 👤 User & Profile Routes

### **GET** `/api/v1/users/game-profile`

Get user's game profile and stats.

**Response:**

```json
{
	"success": true,
	"data": {
		"user": {
			"userName": "ashketchum",
			"level": 15,
			"xp": 12500,
			"coins": 450,
			"dailyStreak": 7,
			"totalQuizzes": 42,
			"correctAnswers": 315,
			"unlockedSubjects": ["math", "science"]
		}
	}
}
```

### **POST** `/api/v1/users/add-xp`

Add XP to user (for testing).

**Request Body:**

```json
{
	"xpAmount": 500
}
```

### **POST** `/api/v1/users/leaderboard`

Get user's leaderboard position.

---

## 🧠 Quiz System Routes

### **POST** `/api/v1/quizzes/start`

Start a new quiz session.

**Request Body:**

```json
{
	"subject": "math",
	"difficulty": "intermediate",
	"questionCount": 10,
	"useAdaptive": false
}
```

**Response:**

```json
{
	"success": true,
	"data": {
		"sessionId": "507f1f77bcf86cd799439011",
		"currentQuestion": {
			"_id": "...",
			"question": "What is 15 + 27?",
			"questionType": "multiple_choice",
			"options": ["32", "42", "52", "62"],
			"timeLimit": 30
		},
		"progress": {
			"current": 1,
			"total": 10
		}
	}
}
```

### **POST** `/api/v1/quizzes/start-adaptive`

Start an adaptive quiz session.

**Request Body:**

```json
{
	"subject": "math",
	"questionCount": 8
}
```

### **GET** `/api/v1/quizzes/:sessionId/next`

Get next question in current session.

### **POST** `/api/v1/quizzes/:sessionId/answer`

Submit answer for current question.

**Request Body:**

```json
{
	"answer": "42",
	"timeSpent": 12.5
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "isCorrect": true,
    "correctAnswer": "42",
    "explanation": "15 + 27 equals 42",
    "xpEarned": 100,
    "coinsEarned": 10,
    "currentStreak": 3,
    "isCompleted": false,
    "nextQuestion": { ... }
  }
}
```

### **GET** `/api/v1/quizzes/:sessionId/results`

Get quiz session results.

### **GET** `/api/v1/quizzes/history`

Get user's quiz history.

**Query Parameters:**

- `page` (default: 1)
- `limit` (default: 10)
- `subject` (optional)

### **GET** `/api/v1/quizzes/subjects`

Get available subjects and user progress.

### **POST** `/api/v1/quizzes/unlock-subject`

Unlock a new subject.

**Request Body:**

```json
{
	"subject": "coding"
}
```

---

## 🐾 Pokémon Collection Routes

### **GET** `/api/v1/pokemons/`

Get all available Pokémon.

**Query Parameters:**

- `type` (math/science/coding)
- `rarity` (common/rare/epic/legendary)

### **GET** `/api/v1/pokemons/collection`

Get user's Pokémon collection.

### **POST** `/api/v1/pokemons/catch`

Catch a Pokémon (usually triggered by quiz rewards).

**Request Body:**

```json
{
	"pokemonId": "507f1f77bcf86cd799439011"
}
```

### **POST** `/api/v1/pokemons/:id/evolve`

Evolve a Pokémon.

**Request Body:**

```json
{
	"evolutionId": "507f1f77bcf86cd799439012"
}
```

---

## 🗺️ World Map & Progression Routes

### **GET** `/api/v1/world-map/progress`

Get user's world map progress.

**Response:**

```json
{
	"success": true,
	"data": {
		"progress": [
			{
				"world": {
					"name": "Math Forest",
					"theme": "forest",
					"color": "#4CAF50"
				},
				"regions": [
					{
						"name": "Number Grove",
						"subject": "math",
						"userProgress": {
							"mastery": 75,
							"completedQuizzes": 8,
							"totalQuizzes": 10
						},
						"canUnlock": false
					}
				],
				"stats": {
					"unlockedRegions": 3,
					"completedRegions": 2,
					"totalRegions": 5,
					"overallProgress": 60
				}
			}
		]
	}
}
```

### **POST** `/api/v1/world-map/unlock-region`

Unlock a new region.

**Request Body:**

```json
{
	"regionId": "507f1f77bcf86cd799439011"
}
```

### **GET** `/api/v1/world-map/recommended`

Get recommended region for user.

### **GET** `/api/v1/world-map/:regionId/details`

Get region details and leaderboard.

### **GET** `/api/v1/world-map/:regionId/leaderboard`

Get region-specific leaderboard.

---

## 🏆 Social & Leaderboard Routes

### **GET** `/api/v1/social/leaderboard`

Get leaderboards.

**Query Parameters:**

- `type` (global/subject/weekly/friends)
- `subject` (required for subject leaderboard)
- `timeframe` (daily/weekly/monthly/all-time)
- `limit` (default: 100)

**Response:**

```json
{
	"success": true,
	"data": {
		"leaderboard": {
			"type": "global",
			"rankings": [
				{
					"rank": 1,
					"user": {
						"userName": "ashketchum",
						"level": 25,
						"xp": 25000
					},
					"score": 2850,
					"badges": 15,
					"pokemonCount": 42,
					"streak": 14
				}
			]
		},
		"userRank": 1
	}
}
```

### **Friend System**

#### **GET** `/api/v1/social/friends`

Get user's friends list.

#### **GET** `/api/v1/social/friends/requests`

Get pending friend requests.

#### **GET** `/api/v1/social/friends/suggestions`

Get friend suggestions.

#### **POST** `/api/v1/social/friends/request`

Send friend request.

**Request Body:**

```json
{
	"friendUsername": "mistywater"
}
```

#### **POST** `/api/v1/social/friends/requests/:requestId/accept`

Accept friend request.

#### **DELETE** `/api/v1/social/friends/requests/:requestId/decline`

Decline friend request.

#### **DELETE** `/api/v1/social/friends/:friendId`

Remove friend.

### **Badge System**

#### **GET** `/api/v1/social/badges`

Get user's badges and progress.

#### **GET** `/api/v1/social/badges/stats`

Get badge statistics.

#### **POST** `/api/v1/social/badges/share`

Share a badge.

**Request Body:**

```json
{
	"badgeId": "507f1f77bcf86cd799439011"
}
```

### **Social Sharing**

#### **POST** `/api/v1/social/share/victory`

Share quiz victory.

**Request Body:**

```json
{
	"quizData": {
		"score": 95,
		"subject": "math",
		"correctAnswers": 19,
		"totalQuestions": 20
	}
}
```

#### **POST** `/api/v1/social/share/level-up`

Share level up.

#### **POST** `/api/v1/social/share/pokemon-catch`

Share Pokémon catch.

#### **GET** `/api/v1/social/shares`

Get user's shares.

#### **GET** `/api/v1/social/shares/popular`

Get popular shares.

---

## 🔔 Feedback & Notification Routes

### **Daily Quests**

#### **GET** `/api/v1/feedback/quests`

Get user's daily quests.

**Response:**

```json
{
	"success": true,
	"data": {
		"quests": [
			{
				"_id": "...",
				"title": "Complete 3 Quizzes",
				"description": "Complete any 3 quizzes to earn rewards",
				"type": "quiz_completion",
				"goal": 3,
				"progress": 2,
				"reward": {
					"xp": 150,
					"coins": 25
				},
				"status": "active",
				"expiresAt": "2024-01-20T23:59:59.000Z"
			}
		]
	}
}
```

#### **POST** `/api/v1/feedback/quests/:questId/claim`

Claim quest reward.

### **Performance Insights**

#### **GET** `/api/v1/feedback/insights`

Get performance insights.

#### **PATCH** `/api/v1/feedback/insights/:insightId/read`

Mark insight as read.

### **Streak & Analytics**

#### **GET** `/api/v1/feedback/streak`

Get user streak information.

### **Notifications**

#### **GET** `/api/v1/feedback/notifications`

Get user notifications.

**Query Parameters:**

- `limit` (default: 20)
- `unreadOnly` (true/false)

#### **PATCH** `/api/v1/feedback/notifications/:notificationId/read`

Mark notification as read.

#### **PATCH** `/api/v1/feedback/notifications/read-all`

Mark all notifications as read.

---

## 📖 Pokedex & Evolution Routes

### **Pokedex System**

#### **GET** `/api/v1/pokedex/pokedex`

Get user's Pokédex.

**Query Parameters:**

- `type` (math/science/coding)
- `rarity` (common/rare/epic/legendary)
- `discovered` (true/false)
- `favorite` (true/false)
- `sortBy` (pokedexNumber/name/type/rarity/discoveredAt)
- `sortOrder` (asc/desc)

**Response:**

```json
{
	"success": true,
	"data": {
		"pokedex": [
			{
				"pokemon": {
					"pokedexNumber": 1,
					"name": "Mathchu",
					"type": "math",
					"rarity": "common",
					"image": "/pokemon/mathchu.png"
				},
				"discovered": true,
				"discoveredAt": "2024-01-15T10:30:00.000Z",
				"timesEncountered": 5,
				"timesCaught": 2,
				"isFavorite": true,
				"researchProgress": 85,
				"isCaught": true
			}
		]
	}
}
```

#### **GET** `/api/v1/pokedex/stats`

Get Pokédex statistics.

#### **GET** `/api/v1/pokedex/:pokemonId`

Get detailed Pokémon information.

#### **PATCH** `/api/v1/pokedex/:pokemonId/favorite`

Toggle favorite status.

#### **PATCH** `/api/v1/pokedex/:pokemonId/notes`

Add research notes.

**Request Body:**

```json
{
	"notes": "This Pokémon appears frequently in algebra quizzes"
}
```

### **Evolution System**

#### **GET** `/api/v1/pokedex/evolutions/check`

Check for evolution opportunities.

#### **POST** `/api/v1/pokedex/evolutions/evolve`

Evolve a Pokémon.

**Request Body:**

```json
{
	"userPokemonId": "507f1f77bcf86cd799439011",
	"evolutionId": "507f1f77bcf86cd799439012"
}
```

#### **GET** `/api/v1/pokedex/evolutions/history`

Get evolution history.

#### **POST** `/api/v1/pokedex/evolutions/auto-evolve`

Process auto-evolutions.

---

## 🧩 Adaptive Learning Routes

### **POST** `/api/v1/adaptive/adaptive-quiz`

Get adaptive quiz questions.

**Request Body:**

```json
{
	"subject": "math",
	"questionCount": 8
}
```

### **POST** `/api/v1/adaptive/:sessionId/performance`

Update user performance for adaptive system.

### **GET** `/api/v1/adaptive/analytics`

Get performance analytics.

---

## ⚔️ PvP Battle System 🆕

### **Socket.IO Connection**

Connect to the battle namespace:

```javascript
const socket = io('/battle');
```

### **Socket Events**

#### **Join Battle Room**

**Event:** `join-battle`  
**Data:**

```json
{
	"roomId": "battle_room_123"
}
```

**Description:** Join a specific battle room to participate in PvP battles.

#### **Player Ready**

**Event:** `player-ready`  
**Data:**

```json
{
	"roomId": "battle_room_123",
	"playerId": "user_id_123"
}
```

**Description:** Notify when a player is ready to start the battle.

#### **New Question**

**Event:** `new-question`  
**Data:**

```json
{
	"roomId": "battle_room_123",
	"question": {
		"_id": "question_id",
		"question": "What is 15 + 27?",
		"options": ["32", "42", "52", "62"],
		"timeLimit": 30
	}
}
```

**Description:** Send a new question to all players in the battle room.

#### **Player Answer**

**Event:** `player-answer`  
**Data:**

```json
{
	"roomId": "battle_room_123",
	"playerId": "user_id_123",
	"isCorrect": true,
	"timeSpent": 12.5
}
```

**Description:** Submit player's answer and track performance.

#### **Round Results**

**Event:** `round-results`  
**Data:**

```json
{
	"roomId": "battle_room_123",
	"results": {
		"player1": { "score": 100, "time": 12.5 },
		"player2": { "score": 150, "time": 8.2 }
	}
}
```

**Description:** Broadcast round results to all players.

#### **Battle Finished**

**Event:** `battle-finished`  
**Data:**

```json
{
	"roomId": "battle_room_123",
	"winner": "user_id_123",
	"rewards": {
		"xp": 500,
		"coins": 100,
		"pokemon": "pokemon_id_123"
	}
}
```

**Description:** Announce battle completion and distribute rewards.

#### **Leave Battle**

**Event:** `leave-battle`  
**Data:**

```json
{
	"roomId": "battle_room_123"
}
```

**Description:** Leave the battle room.

#### **Battle Update**

**Event:** `battle-update` (Server → Client)  
**Data:** Complete battle object with populated player and Pokémon data.

### **Battle Flow**

1. **Connection:** Players connect to `/battle` namespace
2. **Join Room:** Players join specific battle room with `join-battle`
3. **Ready Check:** Players signal readiness with `player-ready`
4. **Question Rounds:** Server sends questions via `new-question`
5. **Answer Submission:** Players submit answers with `player-answer`
6. **Round Results:** Server broadcasts results with `round-results`
7. **Battle Completion:** Server announces winner with `battle-finished`

### **Battle Model Structure**

```javascript
{
  roomId: String,
  player1: { type: ObjectId, ref: 'User' },
  player2: { type: ObjectId, ref: 'User' },
  player1Pokemon: { type: ObjectId, ref: 'Pokemon' },
  player2Pokemon: { type: ObjectId, ref: 'Pokemon' },
  currentQuestion: { type: ObjectId, ref: 'Question' },
  status: String, // 'waiting', 'active', 'finished'
  winner: { type: ObjectId, ref: 'User' },
  rewards: Object
}
```

---

## 🛠️ Utility Routes

### **GET** `/api/v1/health`

Health check endpoint.

### **POST** `/api/v1/seed/all` (Development Only)

Seed sample data for testing.

---

## 🔐 Authentication Requirements

**All routes except the following require JWT authentication:**

- `POST /api/v1/users/register`
- `POST /api/v1/users/login`
- `GET /api/v1/health`

**Authentication Header:**

```
Authorization: Bearer <accessToken>
```

---

## 📝 Response Format

All endpoints follow this response format:

```json
{
  "success": boolean,
  "data": object | array,
  "message": string,
  "error": string | null
}
```

**Success Example:**

```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully"
}
```

**Error Example:**

```json
{
	"success": false,
	"data": null,
	"message": "Error description",
	"error": "Detailed error message"
}
```

---

## 🎯 Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

This completes the comprehensive API documentation for the EduQuest Pokémon Learning Platform! 🚀
