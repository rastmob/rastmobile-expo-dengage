# Rastmobile Expo Dengage

Dengage push notifications for Expo apps with automatic native configuration.

## The Problem We Solved

If you've tried using Dengage with Expo, you've probably run into this frustrating issue:

### What Usually Happens:
1. You install Dengage's React Native package
2. You run `expo prebuild`
3. Push notifications don't work
4. You realize you need to manually edit Android and iOS native files
5. You spend hours figuring out the right configurations
6. Every time you run `expo prebuild --clean`, your changes disappear
7. You start wondering if there's a better way

### Why This Happens:
- Dengage's package works perfectly for regular React Native projects
- But Expo generates Android/iOS folders automatically during prebuild
- Dengage's native configurations don't get included in this process
- You end up with broken push notifications and spend time debugging

### Our Solution
This package handles all the native configuration automatically.

- Works seamlessly with Expo prebuild - no manual editing needed
- Handles all Android Java/Kotlin configurations  
- Creates proper iOS Swift AppDelegate and extensions
- Adds all required permissions automatically
- Production tested - used in real apps serving thousands of users

Just install, configure, and it works.

## Installation

### 1. Add to your project

```json
// In your package.json
{
  "dependencies": {
    "rastmobile-expo-dengage": "file:./packages/rastmobile-expo-dengage"
  }
}
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure your app

```typescript
// In app.config.ts
export default {
  plugins: [
    [
      "rastmobile-expo-dengage",
      {
        // Your Dengage API keys
        productionIntegrationKeys: {
          ios: "YOUR_IOS_KEY",
          android: "YOUR_ANDROID_KEY",
        },
        developmentIntegrationKeys: {
          ios: "YOUR_DEV_IOS_KEY", 
          android: "YOUR_DEV_ANDROID_KEY",
        },
        mode: "production", // or "development"
        
        // iOS settings
        devTeam: "YOUR_APPLE_TEAM_ID", // Required for iOS
        
        // Notification icons
        smallIcons: ["./assets/images/icon.png"],
        largeIcons: ["./assets/images/icon.png"],
        
        // Optional settings
        contentExtensionIosBundle: "DengageContentExtension",
        notificationServiceIosBundle: "DengageNotificationServiceExtension",
        iosGroupBundle: "",
        disableDevelopmentClient: true,
      },
    ],
  ],
};
```

### 4. Build your app

```bash
npx expo prebuild --clean
```

That's it. Your app now has working Dengage push notifications.

## Development

To modify this package:

```bash
cd packages/rastmobile-expo-dengage
npm install --legacy-peer-deps
npm run build
```

## How It Works

When you run `expo prebuild`, this package automatically:

### Android Configuration
- Modifies your MainActivity to add Dengage setup code in the right place
- Updates MainApplication to register the Dengage package properly  
- Configures AndroidManifest to add all required permissions and receivers
- Handles Android 13+ notification permissions
- Uses safe timing to avoid initialization issues

### iOS Configuration  
- Creates a complete Swift AppDelegate (compatible with Expo SDK 53+)
- Sets up notification extensions (Content and Service extensions) automatically
- Configures the Xcode project with proper frameworks and build settings
- Sets up push notification entitlements
- Integrates with your Apple Developer Team for proper code signing

### Key Features
- Won't break if you run prebuild multiple times
- Handles missing files gracefully  
- Includes full TypeScript support
- Provides helpful logging for debugging

## What This Package Does

Instead of manually editing native code after each `expo prebuild`, this package automates everything.

This works as an Expo Config Plugin, which means:
- It runs during `expo prebuild` 
- It modifies native Android and iOS code based on your configuration
- No manual editing required
- Compatible with EAS Build and development builds
- Supports both development and production environments

## Technical Details

### Android Implementation
- Uses a "nuclear option" pattern - cleans up any existing Dengage code before adding new code to prevent duplicates
- Supports modern Kotlin syntax
- Compatible with Expo's splash screen system
- Automatically adds `POST_NOTIFICATIONS` permission for Android 13+
- Uses delays and safety checks to prevent crashes during initialization
- Designed to be run multiple times safely

### iOS Implementation  
- Built specifically for Expo SDK 53+ (where AppDelegate is now Swift)
- Generates the entire AppDelegate.swift file from a template
- Pure TypeScript implementation - no bash scripts required
- Compatible with react-native-wis if you're using it
- Handles Firebase integration alongside Dengage
- Supports deep linking and universal links

### Developer Experience
- Full TypeScript support with proper type definitions
- Clear error messages when something goes wrong
- Comprehensive logging through `RastmobileDengageLog`
- Smart fallbacks when packages can't be found automatically

## Important Notes

### Android Developers
- This package rewrites parts of your MainActivity using the "nuclear option" approach
- It automatically resolves duplicate import and code issues
- The `POST_NOTIFICATIONS` permission is added automatically
- For Android 13+, it uses a 500ms delay to prevent permission-related crashes
- Everything has been tested in production environments

### iOS Developers  
- Only compatible with Expo SDK 53+ (AppDelegate is now Swift)
- The entire AppDelegate.swift file is recreated from scratch
- You must provide your Apple Developer Team ID in the configuration
- Notification extensions are created automatically
- Compatible with other notification libraries like react-native-wis
- All services (Firebase, Dengage, etc.) are properly integrated
- No manual Xcode editing required

## Troubleshooting

### Common Issues

**Push notifications not working after prebuild?**  
Check that you provided the correct Team ID in your configuration and verify your Dengage API keys.

**iOS build failing?**  
Verify that your Apple Developer Team ID is correct in the plugin configuration.

**Android permissions not working?**  
This package adds permissions automatically. If notifications still don't work, double-check your Dengage integration keys.

**Getting duplicate code errors?**  
This package uses a "nuclear option" pattern to prevent duplicates. If you're still getting errors, try running `expo prebuild --clean`.

For additional help, check our [GitHub Issues](https://github.com/rastmob/rastmobile-expo-dengage/issues).

## About Rast Mobile

We're Rast Mobile, a mobile app development team based in Turkey. 

### Why We Built This
We kept running into the same problem on different client projects: Dengage and Expo just didn't play nicely together. After manually fixing this integration for the fifth time, we decided to build a proper solution that handles everything automatically.

This package is now running in production apps that serve thousands of users daily.

### What We Do
We're a mobile development company that focuses on:
- React Native and Expo applications, especially complex integrations
- Push notification systems (we've integrated most of the major services)  
- Native module development when you need to bridge JavaScript with native code
- App performance optimization
- CI/CD pipeline setup for mobile apps

### Contact Information
- Website: [rastmobile.com](https://rastmobile.com/en)
- Mobile App Development: [rastmobile.com/en/services/mobile-app](https://rastmobile.com/en/services/mobile-app)
- LinkedIn: [linkedin.com/company/rastmobile](https://www.linkedin.com/company/rastmobile/)
- Email: contact@rastmobile.com
- Phone: +90 212 945 47 44

### Need Help?
If you're dealing with a complex React Native or Expo integration challenge, we've probably tackled something similar. Feel free to reach out for a consultation.

We work on:
- Cross-platform app development (React Native, Flutter, Expo)
- Native iOS and Android development  
- Third-party SDK integrations (like this Dengage solution)
- Backend development and API integration
- App store deployment and optimization
- Code reviews and architecture consulting

## Additional Information

- GitHub: [rastmob/rastmobile-expo-dengage](https://github.com/rastmob/rastmobile-expo-dengage)
- NPM: [rastmobile-expo-dengage](https://www.npmjs.com/package/rastmobile-expo-dengage)
- Issues: [GitHub Issues](https://github.com/rastmob/rastmobile-expo-dengage/issues)
- Changelog: [CHANGELOG.md](CHANGELOG.md)

## License

MIT License - see [LICENSE](LICENSE) file for details.

---

**Made with ❤️ by [Rast Mobile](https://rastmobile.com/en)**  
*Solving mobile development challenges, one package at a time.*
