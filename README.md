# Doctor Booking AI (Frontend)

Production-ready React Native (Expo) frontend for discovering doctors by category and booking appointments with an AI voice agent trigger. Backend is assumed available via REST; this app uses a centralized API service with mock data and clear integration points to swap to real endpoints.

## Tech Stack
- Expo + React Native (TypeScript)
- React Navigation (Bottom Tabs + Native Stack)
- Context API + AsyncStorage (auth)
- Functional components + hooks

## Project Structure
```
app/
  navigation/ RootNavigator.tsx, TabNavigator.tsx, HomeStack.tsx
  screens/ HomeScreen.tsx, DoctorListScreen.tsx, DoctorDetailScreen.tsx, AppointmentsScreen.tsx, ProfileScreen.tsx, LoginScreen.tsx, SignupScreen.tsx
  components/ CategoryCard.tsx, DoctorCard.tsx, AppointmentCard.tsx, FloatingAIButton.tsx
  context/ AuthContext.tsx
  services/ api.ts
  types/ index.ts
App.tsx
```

## Running Locally

1) Install Node.js LTS
2) Install dependencies

```bash
npm install
```

3) Start the Expo dev server

```bash
npx expo start
```

4) Open on device/emulator
- Press `a` for Android emulator, `i` for iOS (macOS) or scan the QR with Expo Go.

## Notes
- This project ships with a mock `api.ts`. Replace mock methods with real `fetch` calls to your backend and keep token attachment in place.
- Auth token and user profile persist via AsyncStorage.
- Auth-only flows: Appointments, Profile, and booking/payment require login; browsing categories/doctors is public.
- The floating "Chat with AI" button currently triggers a mock AI endpoint; wire to your backend for voice/chat startup.

## Integration Points
- Centralized service: `app/services/api.ts`
  - `getCategories`, `getDoctorsByCategory`, `getDoctor`
  - `login`, `signup`, `logout`, `getProfile`
  - `getAppointments`, `bookAppointment`, `initiatePayment`, `triggerAIVoiceForAppointment`, `triggerAIQuick`
- Swap mock implementations with real `fetch` calls and your base URL.

## Type Contracts
See `app/types/index.ts` for `Doctor`, `Appointment`, and `User` shapes.

## Lint/Type Check
```bash
npm run typecheck
```

## Production Readiness
- Clean architecture, modular services, and reusable UI components
- Robust loading/empty/error UX
- Navigation guards implemented via runtime checks and CTA redirects

