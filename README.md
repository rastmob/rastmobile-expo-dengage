# Rastmobile Expo Dengage

**Easy Dengage push notifications for Expo apps - no manual setup needed!**

## The Problem We Solved 😤

If you've tried using Dengage with Expo, you probably hit this wall:

### What Usually Happens:
1. You install Dengage's React Native package ✅
2. You run `expo prebuild` ✅  
3. Push notifications don't work 💥
4. You realize you need to manually edit Android and iOS native files 😱
5. You spend hours figuring out the right configurations 🕐
6. Every time you run `expo prebuild --clean`, your changes disappear 💀
7. You start questioning your life choices 🤦‍♂️

### Why This Happens:
- Dengage's package works great for **regular React Native** projects
- But **Expo** generates Android/iOS folders automatically during `prebuild`
- Dengage's native configurations don't get included automatically
- You end up with broken push notifications and no clue why

### Our Solution ✨
**This package fixes everything automatically!**

- ✅ **Works with Expo prebuild** - no manual editing needed
- ✅ **Android setup** - handles all the Java/Kotlin configurations  
- ✅ **iOS setup** - creates proper Swift AppDelegate and extensions
- ✅ **Permission handling** - adds all required permissions automatically
- ✅ **Production ready** - used in real apps serving thousands of users

**Just install, configure, and it works!** 🎉

## Quick Start 🚀

### 1. Add to your project

```json
// In your package.json
{
  "dependencies": {
    "rastmobile-expo-dengage": "file:./packages/rastmobile-expo-dengage"
  }
}
```

### 2. Install

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

**That's it!** 🎉 Your app now has working Dengage push notifications.

## Development

Want to modify this package? Here's how:

```bash
cd packages/rastmobile-expo-dengage
npm install --legacy-peer-deps
npm run build
```

## What Happens Behind the Scenes 🔧

When you run `expo prebuild`, this package automatically:

### Android Magic ✨
- **Fixes your MainActivity** - Adds Dengage setup code in the right place
- **Updates MainApplication** - Registers Dengage package properly  
- **Configures AndroidManifest** - Adds all required permissions and receivers
- **Handles Android 13+** - Adds notification permissions for newer Android versions
- **Prevents crashes** - Uses safe timing to avoid initialization issues

### iOS Magic ✨  
- **Creates AppDelegate.swift** - Builds a complete Swift AppDelegate (Expo SDK 53+ compatible)
- **Sets up notification extensions** - Creates Content and Service extensions automatically
- **Configures Xcode project** - Adds frameworks and build settings
- **Handles permissions** - Sets up push notification entitlements
- **Team ID integration** - Uses your Apple Developer Team for proper code signing

### Smart Features 🧠
- **No duplicates** - Won't break if you run prebuild multiple times
- **Error recovery** - Handles missing files gracefully  
- **TypeScript ready** - Full type safety included
- **Logging** - Helpful logs to debug issues

## What This Package Does

### The Simple Version
Instead of manually editing native code after each `expo prebuild`, this package does it all automatically.

### Automated Native Configuration
This package works as an **Expo Config Plugin**. That means:
- It runs during `expo prebuild` 
- It modifies native Android and iOS code based on your settings
- No manual editing required
- Works with EAS Build and development builds
- Supports both development and production

## Technical Details

### Advanced Android Features
- **Nuclear option pattern** - Cleans up any existing Dengage code before adding new code (prevents duplicates)
- **Kotlin support** - Uses modern Kotlin syntax
- **SplashScreen compatibility** - Works with Expo's splash screen system
- **Permission handling** - Adds `POST_NOTIFICATIONS` permission for Android 13+
- **Safe initialization** - Uses delays and checks to prevent crashes
- **Build safety** - You can run prebuild multiple times without breaking anything

### Advanced iOS Features  
- **Expo SDK 53+ ready** - Built for the latest Expo (AppDelegate is now Swift!)
- **Complete file generation** - Creates the entire AppDelegate.swift from a template
- **No patch scripts** - Pure TypeScript, no bash scripts needed
- **WIS compatibility** - Works with react-native-wis if you use it
- **Firebase integration** - Handles Firebase along with Dengage
- **Universal links** - Supports deep linking and universal links

### Developer-Friendly Features
- **TypeScript** - Full type safety and IntelliSense support
- **Error handling** - Clear error messages when something goes wrong
- **Logging** - Helpful logs with `RastmobileDengageLog`
- **Fallbacks** - Smart fallbacks when packages can't be found

## Important Notes 📝

### For Android Developers
- This package completely rewrites parts of your MainActivity (that's the "nuclear option")
- It automatically fixes duplicate import/code issues
- `POST_NOTIFICATIONS` permission gets added automatically
- For Android 13+, it uses a 500ms delay to prevent permission crashes
- Everything is crash-safe and tested in production apps

### For iOS Developers  
- **Only works with Expo SDK 53+** (AppDelegate is now Swift!)
- Creates the entire AppDelegate.swift file from scratch
- You **must** provide your Apple Developer Team ID
- Notification extensions are created automatically
- Works with other notification libraries (like react-native-wis)
- All services (Firebase, Dengage, etc.) are integrated properly
- **No manual Xcode editing needed**

## Troubleshooting 🆘

### Common Issues

**Q: Push notifications not working after prebuild?**  
A: Make sure you provided the correct Team ID in your config and that your Dengage keys are correct.

**Q: Build failing on iOS?**  
A: Check that your Apple Developer Team ID is correct in the plugin config.

**Q: Android permissions not working?**  
A: This package automatically adds permissions. If it's not working, check your Dengage integration keys.

**Q: Getting duplicate code errors?**  
A: This package uses "nuclear option" pattern to prevent duplicates. If you still get errors, try `expo prebuild --clean`.

For more help, check our [GitHub Issues](https://github.com/rastmob/rastmobile-expo-dengage/issues).

## License

MIT - See [LICENSE](LICENSE) file for details.

## About Rast Mobile 🏢

Hi! We're **Rast Mobile** - a mobile app development team that loves solving tricky problems.

### Why We Built This 💡
We kept running into the same issue on client projects: Dengage + Expo just didn't work together nicely. After manually fixing this problem for the 5th time, we decided to build a proper solution that works automatically.

**Result**: This package is now used in production apps serving thousands of users. It just works! ✨

### What We Do
We're a mobile development company that specializes in:
- **React Native & Expo apps** - especially the tricky integrations
- **Push notifications** - we've probably integrated every push service that exists  
- **Native modules** - when you need to connect JavaScript with native code
- **Performance optimization** - making apps fast and smooth
- **CI/CD pipelines** - automated testing and deployments

### Get In Touch 📞
- **Website**: [rastmobile.com](https://rastmobile.com/en)
- **Services**: [Mobile App Development](https://rastmobile.com/en/services/mobile-app)
- **LinkedIn**: [Rast Mobile](https://www.linkedin.com/company/rastmobile/)
- **Email**: contact@rastmobile.com
- **Phone**: +90 212 945 47 44

### Need Help? 🤝
Struggling with a complex React Native or Expo integration? We've probably solved something similar before. Feel free to reach out for a consultation!

**Our expertise includes:**
- Cross-platform app development (React Native, Flutter, Expo)
- Native iOS and Android development  
- Complex third-party integrations (like this Dengage solution)
- Backend development and API integration
- App store optimization and deployment
- Code reviews and architecture consulting

## More Info 📚

- **GitHub**: [rastmob/rastmobile-expo-dengage](https://github.com/rastmob/rastmobile-expo-dengage)
- **NPM**: [rastmobile-expo-dengage](https://www.npmjs.com/package/rastmobile-expo-dengage)
- **Issues**: [GitHub Issues](https://github.com/rastmob/rastmobile-expo-dengage/issues)
- **Changelog**: [CHANGELOG.md](CHANGELOG.md)

## License 📄

MIT License - see [LICENSE](LICENSE) file for details.

---

**Made with ❤️ by [Rast Mobile](https://rastmobile.com/en)**  
*Solving mobile development challenges, one package at a time.*

