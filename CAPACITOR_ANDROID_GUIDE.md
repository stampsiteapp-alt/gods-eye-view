# God's Eye View Android Deployment Guide

This project is set up as a web app that can be wrapped into an Android app using Capacitor.

## 1) Install dependencies

```bash
npm ci
```

## 2) Build the app for mobile

```bash
npm run mobile:build
```

This runs the Vite build and syncs the generated web bundle into the Android project.

## 3) Add the Android platform

If the Android platform is not present yet:

```bash
npx cap add android
```

## 4) Open Android Studio

```bash
npx cap open android
```

## 5) Build a release bundle for Google Play

Inside Android Studio:
- Build > Generate Signed Bundle / APK
- Select Android App Bundle (.aab)
- Create a keystore if needed
- Upload it to Google Play Console

## 6) Sign the app for Play Store

Use a proper release keystore stored outside the repo.

Example:

```bash
keytool -genkeypair -v -keystore release-key.jks -alias gods-eye-view -keyalg RSA -keysize 2048 -validity 10000
```

Then configure `android/gradle.properties` or signing in Gradle.

## 7) Recommended Play Store setup

- App category: Maps & Navigation, Utility, or Entertainment
- App privacy: Data Collection disclosure if using analytics or user-driven keys
- Age rating: default to general audience unless content policy demands otherwise
- Sensitive permissions: microphone, location, camera

## 8) Required production config

Add your real keys to a secure deployment environment, not the repo. Example values:

- `OPENAI_API_KEY`
- `CESIUM_ION_TOKEN`
- `GOOGLE_MAPS_API_KEY`
- `AISSTREAM_API_KEY`
- `FIRMS_MAP_KEY`
- `TOMTOM_API_KEY`

## 9) Production backend recommendation

This project is data-heavy and should run behind a proper backend in production. A secure admin API is included in `admin-backend/` for managing users, access control, analytics, and API key boundaries.

## 10) Update strategy

Use continuous deployment by pushing to GitHub, then wrapping a new release bundle via CI.

## 11) Submission checklist

- App icon and splash screen set
- Privacy policy URL added
- App signing created
- Play Console data safety form completed
- Target SDK updated to current Play requirements
- Permissions justified in manifest
- Release notes prepared

This is the fastest practical route from the existing web repo to a native Android app package while maintaining the app’s current interactive Earth-view experience.
