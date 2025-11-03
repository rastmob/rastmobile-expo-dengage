# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-11-03

### Added
- Initial release of Rastmobile Expo Dengage package
- Expo plugin for Dengage integration
- Android support with MainActivity and MainApplication modifications
- iOS support with Swift AppDelegate (Expo SDK 53+)
- Nuclear option pattern for duplicate prevention
- Android 13+ (API 33+) POST_NOTIFICATIONS permission handling
- Crash-safe initialization with Handler + postDelayed
- WIS delegate handling for react-native-wis compatibility
- Firebase integration support
- Notification extensions (Content & Service) for iOS
- Deep linking & Universal links support
- TypeScript support with full type definitions
- Comprehensive error handling and logging
- Build scripts compatible with npm (yarn dependency removed)

### Features
- Modern Expo SDK compatibility (SDK 53+)
- TypeScript type safety
- Android MainActivity and MainApplication auto-configuration
- iOS AppDelegate.swift template-based generation
- Notification Service Extension for iOS
- Content Extension for iOS rich notifications
- Automatic package resolution with fallbacks
- Better logging with RastmobileDengageLog
- Idempotent prebuild (can run multiple times safely)
- Cross-platform support (iOS & Android)

### Documentation
- Comprehensive README in Turkish
- Installation guide
- Configuration examples
- Feature descriptions for both platforms
- Important notes and warnings

---

## Future Releases

### Planned Features
- [ ] Enhanced error reporting
- [ ] Additional notification customization options
- [ ] Better debugging tools
- [ ] Performance optimizations
- [ ] More configuration options

---

Note: For upgrade instructions, breaking changes, and migration guides, please refer to the [README.md](README.md)
