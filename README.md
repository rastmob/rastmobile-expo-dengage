# Rastmobile Expo Dengage

Modern Expo SDK için Dengage entegrasyon paketi.

## Kurulum

Bu paket projenizde yerel bir paket olarak kullanılabilir.

### 1. Ana Projenin package.json'ına ekleyin:

### 2. Bağımlılıkları kurun:

```bash
npm install
```

### 3. app.config.ts'de kullanım:

```typescript
export default {
  // ... diğer config
  plugins: [
    // ... diğer pluginler
    [
      "rastmobile-expo-dengage",
      {
        productionIntegrationKeys: {
          ios: "YOUR_IOS_KEY",
          android: "YOUR_ANDROID_KEY",
        },
        developmentIntegrationKeys: {
          ios: "YOUR_DEV_IOS_KEY",
          android: "YOUR_DEV_ANDROID_KEY",
        },
        mode: "production", // veya "development"
        devTeam: "YOUR_APPLE_TEAM_ID",
        smallIcons: ["./assets/images/icon.png"],
        largeIcons: ["./assets/images/icon.png"],
        contentExtensionIosBundle: "DengageContentExtension",
        notificationServiceIosBundle: "DengageNotificationServiceExtension",
        iosGroupBundle: "",
        disableDevelopmentClient: true,
      },
    ],
  ],
};
```

### 4. Prebuild:

```bash
npx expo prebuild --clean
```

## Build

Paketi geliştirirken build etmek için:

```bash
cd packages/rastmobile-expo-dengage
npm install --legacy-peer-deps
npm run build
```

## Özellikler ve İyileştirmeler

### Android

Bu paket, önemli Android optimizasyonları içerir:

#### Nuclear Option Pattern
- **Çift import önleme**: Tüm mevcut Dengage import'larını temizler, sonra tek bir tane ekler
- **Duplicate kod önleme**: Coordinator setup kodunun tekrar eklenmesini engeller
- **Güvenli temizleme**: Regex ile aggressive temizleme, sonra kontrollü ekleme

#### MainActivity İyileştirmeleri
- **Kotlin desteği**: Modern Kotlin syntax
- **SplashScreen uyumluluğu**: `@generated begin expo-splashscreen` marker'ı ile çalışır
- **Permission handling**: Android 13+ (API 33+) için `POST_NOTIFICATIONS` izni
- **Crash önleme**: Permission request `super.onCreate` sonrasında yapılır
- **postDelayed kullanımı**: React Native'in tam başlatılmasını bekler

#### MainApplication Düzenlemesi
- **DengagePackage ekleme**: Otomatik ve güvenli paket registrasyonu
- **Duplicate check**: Zaten eklenmişse tekrar eklenmez
- **PackageList uyumluluğu**: Modern Expo paket yönetimi ile uyumlu

#### AndroidManifest
- **Receiver configuration**: Doğru package name ile (`expo.modules.rastmobiledengage.MyReceiver`)
- **Service registration**: FCM messaging service
- **Permission declaration**: `POST_NOTIFICATIONS` manifest'te

#### Build Güvenliği
- **Idempotent**: Birden fazla prebuild çalıştırılabilir
- **Safe regex**: Yanlış eşleşmeleri önler
- **Error-resistant**: Eksik dosyalarda bile çalışır

### iOS

Bu paket, Expo SDK 53+ için özel olarak geliştirilmiştir:

#### Swift AppDelegate (Expo SDK 53+)
- **Objective-C değil, Swift**: Expo SDK 53+ ile AppDelegate artık Swift
- **Tam dosya oluşturma**: Template ile complete AppDelegate.swift oluşturur
- **Patch-free**: Bash script'e bağımlı değil, saf TypeScript

#### İçerik
- AppDelegate.swift tam template
- Notification extensions (Content & Service)
- WIS delegate handling (react-native-wis uyumluluğu)
- Firebase integration
- Entitlements ve permissions
- Xcode project configuration
- Push token handling
- Deep linking & Universal links

## Temel Özellikler

### Kod Özellikleri
- Nuclear option pattern (duplicate önleme)
- MainActivity ve MainApplication düzenlemeleri
- Modern Expo SDK uyumluluğu
- Android 13+ permission handling
- Crash-safe initialization
- Build script'leri npm uyumlu (yarn dependency kaldırıldı)

### Ek Özellikler
- TypeScript type safety
- Comprehensive error handling
- Better logging with RastmobileDengageLog
- Package resolution fallbacks

## Önemli Notlar

### Android
- Bu paket MainActivity'yi **nuclear option** pattern ile düzenler
- Duplicate import/kod sorunlarını otomatik çözer
- `POST_NOTIFICATIONS` permission'ı otomatik olarak eklenir
- Android 13+ için güvenli permission request (500ms delay + crash protection)
- `Handler` + `postDelayed` ile Activity tam hazır olana kadar bekler

### iOS  
- **Expo SDK 53+ Uyumlu**: AppDelegate artık Swift!
- Template-based: Tüm AppDelegate.swift dosyasını yeniden oluşturur
- Apple Developer Team ID gereklidir
- Notification extensions otomatik oluşturulur
- WIS (react-native-wis) ile uyumludur
- Firebase, Dengage ve diğer tüm servisler entegre
- **Patch script'e gerek yok**: Saf TypeScript, cross-platform

Detaylı bilgi için:
- [CHANGELOG.md](CHANGELOG.md) - Versiyon geçmişi

## Lisans

MIT - Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## Geliştirme Ekibi

Rastmobile Team

## Bağlantılar

- GitHub: https://github.com/rastmob/rastmobile-expo-dengage
- NPM: https://www.npmjs.com/package/rastmobile-expo-dengage
- Issues: https://github.com/rastmob/rastmobile-expo-dengage/issues

---

Made by Rastmobile

