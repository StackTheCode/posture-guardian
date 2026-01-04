#  Frontend Architecture Overview
The application is built with React and TypeScript, utilizing a modern tech stack focused on real-time feedback and a high-performance user interface.


## Tech Stack
State Management: Zustand (via useAuthStore) for lightweight, global authentication state.

Styling & Animation: Tailwind CSS for utility-first styling and Framer Motion for smooth, glassmorphic transitions.

Navigation: React Router DOM for SPA routing.

Icons: Lucide React.

Real-time Communication: WebSockets (custom hook) for instantaneous posture feedback.

## 📄 Page Documentation
### 1.**Login Page** (LoginPage.tsx)

The entry point for existing users, designed with a focus on security and user feedback.

Primary Function: Authenticates users via the authApi and initializes the global auth state.

### Key Features:

Password Visibility Toggle: Improves UX by allowing users to verify their input.

Loading States: Disables interaction and updates button text during API calls to prevent duplicate submissions.

Error Handling: Displays dynamic error messages from the backend (e.g., "Invalid credentials").

Interactions: On success, the user's token and profile are saved to the store, and they are redirected to /dashboard.

### 2. **Register Page** (RegisterPage.tsx)

Handles new user onboarding with client-side validation.

Primary Function: Registers a new user account.

### Key Features:

Validation Logic: Includes checks for password matching and minimum character length (6 characters) before hitting the API.

Form Integration: Captures username, email, and password.

Visuals: Utilizes a "glass-strong" UI theme with slide-in animations for a modern feel.

### 3. Dashboard Page (DashboardPage.tsx)


The central hub for real-time monitoring and historical posture data.

Primary Function: Provides a live view of the user's posture and summarizes daily health metrics.

Core Logic & Hooks:

usePostureWebSocket: Manages a persistent connection to the server to receive live postureState, confidence, and severity scores.

usePostureAnalytics: Fetches aggregated historical data for the stats cards and timeline.

| Component          | Visual Type              | Responsibility |
|-------------------|--------------------------|----------------|
| PostureIndicator  | Circular Gauge / SVG     | Displays the real-time posture state. Uses `confidence` and `severity` props to change colors (e.g., green for good posture, red for slouching) and provides immediate visual feedback to the user. |
| StatsCards        | Grid of Cards            | Summarizes historical performance by calculating and displaying key performance indicators (KPIs), such as the total count of good vs. bad posture events and the average posture severity over time. |
| PostureTimeline   | Area / Line Chart        | Visualizes behavioral trends by mapping posture events onto a chronological axis, allowing users to identify specific times of day when posture tends to decline. |
| Status Bar        | Icon & Label             | Monitors system connectivity by displaying a **Live** or **Offline** status based on the WebSocket connection state, ensuring the user knows whether data is being synced. |
| GlassCard         | Wrapper Container        | UI/UX utility component that applies consistent glassmorphic styling (blur, transparency, borders) across all dashboard widgets. |


### 📂 Component Structure
To maintain clean code, the project follows a modular structure:

/components/ui: Reusable, atomic components like AnimatedButton and GlassCard.

/components/dashboard: Specific domain components like the PostureIndicator.

/hooks: Abstracted logic for WebSockets and API fetching.

/services: Centralized Axios/Fetch API instances (authApi).

/store: Global state definitions using Zustand


## API Service Layer (api.ts)
The API layer is built using Axios to handle HTTP requests. It serves as a centralized gateway for all network communication, ensuring consistency across the application.

### ⚙️ Core Configuration
**Base URL**: The service automatically adapts to the environment using VITE_API_URL. This allows for a seamless transition between local development (localhost:8080) and production environments.

**Global Headers**: Sets Content-Type: application/json by default for all outgoing requests.

### 🔐 Security & Authentication
To handle user sessions securely, the service utilizes a Request Interceptor. This logic executes automatically before every request:

**Token Retrieval**: It checks localStorage for a valid JWT token.

**Authorization Injection**: If a token exists, it is attached to the request headers as a Bearer token.

**Persistence**: This ensures that the user stays logged in and can access protected posture data without manual header configuration in individual components.



## 📂 API Modules
The services are organized into logical modules to keep the codebase clean and maintainable.

1. **Authentication Module (authApi)**:Handles the user lifecycle and security credentials

| Method   | Endpoint        | Description |
|---------|-----------------|-------------|
| register | POST `/auth/register` | Creates a new user profile using a username, email, and password. |
| login    | POST `/auth/login`    | Validates user credentials and returns an authentication token. |


## **Global Authentication Store (authStore.ts)**
The application uses Zustand with the persist middleware to manage the authentication lifecycle. This ensures that the user's session remains active even after refreshing the browser or closing the tab.


### Store Actions

The store provides two primary actions to manipulate the authentication state:

login(token, username, email):

Updates State: Sets all user details and flips isAuthenticated to true.

Local Storage: Manually syncs the token to localStorage for use by the Axios interceptors.

logout():

Clears State: Resets all properties to null and false.

Cleanup: Removes the token from localStorage, effectively de-authorizing future API calls.