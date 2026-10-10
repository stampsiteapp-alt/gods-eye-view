# Mobile Build & Deployment Guide

## Overview

This guide walks you through building a native Android and iOS app using Capacitor and deploying it to Google Play Store and Apple App Store.

## Prerequisites

- Node.js 24.x or 26.x
- npm or yarn
- Android Studio (for Android builds)
- Xcode (for iOS builds, macOS only)
- Google Play Developer Account ($25 one-time fee)
- Apple Developer Account ($99/year)

## Step 1: Setup Environment

```bash
# Clone repo
git clone https://github.com/stampsiteapp-alt/gods-eye-view.git
cd gods-eye-view

# Install dependencies
npm ci

# Copy environment template
cp .env.example .env
```

## Step 2: Add Your API Keys

Edit `.env` and add your real API keys:

```bash
OPENAI_API_KEY=sk_live_...
CESIUM_ION_TOKEN=eyJhbGc...
GOOGLE_MAPS_API_KEY=AIza...
AISSTREAM_API_KEY=...
FIRMS_MAP_KEY=...
TOMTOM_API_KEY=...
```

⚠️ **Never commit `.env` to Git. Keep it local and secure.**

## Step 3: Build Web Assets

```bash
npm run build
```

This generates optimized static files in `dist/`.

## Step 4: Capacitor Setup

### Install Capacitor CLI

```bash
npm install -g @capacitor/cli
```

### Initialize Mobile Platforms

```bash
# Add Android platform
npx cap add android

# Add iOS platform (macOS only)
npx cap add ios
```

### Sync web assets to native projects

```bash
npx cap sync
```

## Step 5: Android Build

### Open Android Studio

```bash
npx cap open android
```

### Create Release Keystore

```bash
keytool -genkeypair -v \
  -keystore release-key.jks \
  -alias gods-eye-view \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -storepass your-password \
  -keypass your-key-password
```

**Save the keystore file outside the repo (never commit it).**

### Configure Signing in Android Studio

1. Open `android/app/build.gradle`
2. Add signing config:

```gradle
signingConfigs {
  release {
    storeFile file('/path/to/release-key.jks')
    storePassword 'your-password'
    keyAlias 'gods-eye-view'
    keyPassword 'your-key-password'
  }
}

buildTypes {
  release {
    signingConfig signingConfigs.release
  }
}
```

### Build Release Bundle

In Android Studio:
- **Build** → **Generate Signed Bundle / APK**
- Select **Android App Bundle (.aab)**
- Choose your keystore
- Output: `app-release.aab`

**Or via command line:**

```bash
cd android
./gradlew bundleRelease
```

Output: `app/build/outputs/bundle/release/app-release.aab`

## Step 6: iOS Build

### Open Xcode

```bash
npx cap open ios
```

### Create App ID

1. Go to **Apple Developer Portal** → **Certificates, IDs & Profiles**
2. Create new App ID: `com.stampsiteapp.godseyeview`
3. Enable required capabilities: Microphone, Camera, Location

### Configure Code Signing

1. In Xcode, select **Project** → **Signing & Capabilities**
2. Select your Team
3. Xcode auto-manages provisioning profiles

### Build Archive

1. **Product** → **Archive**
2. **Distribute App** → **App Store Connect**
3. Follow Xcode prompts

## Step 7: Google Play Store Submission

### Setup Google Play Console

1. Go to [Google Play Console](https://play.google.com/console)
2. Create new app: "Gods Eye View"
3. Fill in app details

### Upload APK/Bundle

1. Navigate to **Testing** → **Internal Testing**
2. Upload `app-release.aab`
3. Click **Create Release**
4. Add release notes and submit

### Submit for Review

1. Complete **Store Listing** (screenshots, description, etc.)
2. Fill **App Content** rating
3. Add **Privacy Policy** URL
4. Review **Data Safety** form
5. Click **Submit for Review**

**Typical review time: 1-3 hours**

## Step 8: Apple App Store Submission

### Setup App Store Connect

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Create new app: "Gods Eye View"
3. Fill in app details

### Upload Build

1. From Xcode, upload archive to App Store Connect
2. In App Store Connect, go to **Builds**
3. Select your build and add to **App Store** version

### Submit for Review

1. Complete **App Information**
2. Add **App Preview & Screenshots**
3. Add **App Description**
4. Set **Age Rating**
5. Complete **Licensing & Rights**
6. Click **Submit for Review**

**Typical review time: 24-48 hours**

## Step 9: Updates & Maintenance

### For Each Update

```bash
# Make changes to src/

# Build new web assets
npm run build

# Sync to native
npx cap sync

# Build new APK/IPA
# (Follow steps 5-8 above)
```

### Version Management

Update version in multiple places:
- `package.json`: `"version": "1.0.1"`
- `capacitor.config.ts`: `appVersion: "1.0.1"`
- Android: `android/app/build.gradle` → `versionCode` & `versionName`
- iOS: Xcode → **Build Settings** → **Bundle Version** & **Bundle Version Short**

## Troubleshooting

### App won't build

```bash
# Clean and rebuild
npm run build
npx cap sync
cd android && ./gradlew clean && ./gradlew bundleRelease
```

### Keystore password lost

Generate a new one (old builds can't be updated with new keystore).

### Capacitor sync issues

```bash
npx cap sync android
npx cap sync ios
```

### API keys not working

1. Verify `.env` is loaded: `npm run doctor`
2. Check provider dashboard for rate limits
3. Verify CORS settings if proxying through backend

## Security Checklist

- [ ] Keystore file stored securely (not in Git)
- [ ] API keys in `.env` (never in code)
- [ ] Privacy policy published
- [ ] Data collection disclosed
- [ ] HTTPS enabled for all API calls
- [ ] Sensitive data encrypted at rest

## Monitoring & Analytics

### Google Play Console

- **Crash reporting**: Automatic via Google Play Services
- **Analytics**: Set up Firebase Analytics
- **Performance**: Monitor ANRs and battery usage

### App Store Connect

- **Crashes**: View in Xcode Organizer
- **Performance**: Check App Analytics
- **Review**: Monitor user ratings & reviews

## Monetization

### In-App Purchases

- **Google Play Billing**: Set up in Google Play Console
- **App Store IAP**: Configure in App Store Connect

### Ads

- **AdMob**: Integrate Google Mobile Ads SDK
- **Ad Network**: Choose provider (Google, Meta, etc.)

## Additional Resources

- [Capacitor Docs](https://capacitorjs.com)
- [Android App Development](https://developer.android.com)
- [iOS App Development](https://developer.apple.com)
- [Google Play Console Help](https://support.google.com/googleplay/android-developer)
- [App Store Connect Help](https://help.apple.com/app-store-connect)

## Support

For issues or questions:
- GitHub Issues: https://github.com/stampsiteapp-alt/gods-eye-view/issues
- Stack Overflow tags: `capacitor`, `android`, `ios`
