import {
  BaseMods,
  ConfigPlugin,
  IOSConfig,
  Mod,
  withAppDelegate,
  withDangerousMod,
  withEntitlementsPlist,
  withInfoPlist,
  withMod,
  withXcodeProject,
} from "expo/config-plugins";

import { RastmobileDengagePluginProps } from "./types";
import { ExpoConfig } from "@expo/config-types";
import getEasManagedCredentialsConfigExtra from "../support/eas/getEasManagedCredentialsConfigExtra";
import { updatePodfile } from "../support/updatePodfile";
import { RastmobileDengageLog } from "../support/RastmobileDengageLog";
import * as fs from "fs";
import * as path from "path";
import {
  DCEB_SOURCE_FILE,
  DCEC_SOURCE_FILE,
  DCED_SOURCE_FILE,
  DCEE_SOURCE_FILE,
  DCE_EXT_FILES,
  DCE_SOURCE_FILE,
  DCE_TARGET_NAME,
  DEFAULT_BUNDLE_SHORT_VERSION,
  DEFAULT_BUNDLE_VERSION,
  DNE_EXT_FILES,
  DNE_SOURCE_FILE,
  DNE_TARGET_NAME,
  IPHONEOS_DEPLOYMENT_TARGET,
  TARGETED_DEVICE_FAMILY,
} from "../support/iosConstants";
import { FileManager } from "../support/FileManager";
import NseUpdaterManager from "../support/NseUpdaterManager";
// updateAppDelegateHeader removed - Expo SDK 53+ uses Swift, not Objective-C

// UPDATE Info.plist
const withRemoteNotificationsPermissions: ConfigPlugin<
  RastmobileDengagePluginProps
> = (config, props) => {
  const BACKGROUND_MODE_KEYS = ["remote-notification"];
  return withInfoPlist(config, (newConfig) => {
    if (!Array.isArray(newConfig.modResults.UIBackgroundModes)) {
      newConfig.modResults.UIBackgroundModes = [];
    }
    for (const key of BACKGROUND_MODE_KEYS) {
      if (!newConfig.modResults.UIBackgroundModes.includes(key)) {
        newConfig.modResults.UIBackgroundModes.push(key);
      }
    }

    return newConfig;
  });
};

const modifyInfoPlist: ConfigPlugin<RastmobileDengagePluginProps> = (
  config,
  props
) => {
  return withInfoPlist(config, (newConfig) => {
    newConfig.modResults.DengageApiUrl =
      props.dengageApiUrl || "https://tr-push.dengage.com";
    newConfig.modResults.DengageEventApiUrl =
      props.dengageEventApiUrl || "https://tr-event.dengage.com";
    newConfig.modResults.DengageGeofenceApiUrl =
      props.dengageGeofenceApiUrl || "https://tr-push.dengage.com/geoapi/";
    return newConfig;
  });
};

// REMOVED: modifyAppDelegateHeader - Expo SDK 53+ uses Swift, not Objective-C
// AppDelegate.h doesn't exist anymore, we need to modify AppDelegate.swift instead
// This is now handled in modifyAppDelegate function

const modifyAppDelegate: ConfigPlugin<RastmobileDengagePluginProps> = (
  config,
  props
) => {
  return withDangerousMod(config, [
    "ios",
    async (config) => {
      const projectName = config.modRequest.projectName || "";
      const platformProjectRoot = config.modRequest.platformProjectRoot;
      const appDelegateSwiftPath = path.join(platformProjectRoot, projectName, "AppDelegate.swift");

      // Check if AppDelegate.swift exists (Expo SDK 53+)
      if (!fs.existsSync(appDelegateSwiftPath)) {
        RastmobileDengageLog.log(`AppDelegate.swift not found, skipping...`);
        return config;
      }

      const key =
        props.mode === "development"
          ? props.developmentIntegrationKeys?.ios ||
            props.productionIntegrationKeys?.ios
          : props.productionIntegrationKeys?.ios ||
            props.developmentIntegrationKeys?.ios;

      if (!key) {
        RastmobileDengageLog.error("Dengage iOS integration key not found in config!");
        return config;
      }

      RastmobileDengageLog.log("Creating AppDelegate.swift with Dengage setup...");

      // Create complete AppDelegate.swift template (Swift)
      const appDelegateSwiftContent = `import Expo
import FirebaseCore
import React
import ReactAppDependencyProvider
import UserNotifications
import react_native_dengage

@UIApplicationMain
public class AppDelegate: ExpoAppDelegate, UNUserNotificationCenterDelegate {
  var window: UIWindow?

  var reactNativeDelegate: ExpoReactNativeFactoryDelegate?
  var reactNativeFactory: RCTReactNativeFactory?
  
  // Delegate kontrolü için
  var otherDelegate: UNUserNotificationCenterDelegate?
  var delegateCheckTimer: Timer?
  
  // APNS Token'ı saklamak için static property (JavaScript tarafından erişilebilir)
  static var apnsToken: String?

  public override func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    let delegate = ReactNativeDelegate()
    let factory = ExpoReactNativeFactory(delegate: delegate)
    delegate.dependencyProvider = RCTAppDependencyProvider()

    reactNativeDelegate = delegate
    reactNativeFactory = factory
    bindReactNativeFactory(factory)

#if os(iOS) || os(tvOS)
    window = UIWindow(frame: UIScreen.main.bounds)
// @generated begin @react-native-firebase/app-didFinishLaunchingWithOptions - expo prebuild (DO NOT MODIFY) sync-10e8520570672fd76b2403b7e1e27f5198a6349a
FirebaseApp.configure()
// @generated end @react-native-firebase/app-didFinishLaunchingWithOptions

    /**** Dengage Setup code Starting here ********/
    let coordinator = DengageRNCoordinator.staticInstance
    
    // launchOptions -> NSDictionary bridge (setupDengage bu türü bekliyor)
    let nsLaunchOptions: NSDictionary? = {
      guard let opts = launchOptions else { return nil }
      var dict: [String: Any] = [:]
      for (k, v) in opts { dict[k.rawValue] = v }
      return dict as NSDictionary
    }()
    
    // Swift SDK signature - enableGeoFence parameter is not exposed!
    coordinator.setupDengage(
      key: "${key}" as NSString,
      launchOptions: nsLaunchOptions,
      application: application,
      askNotificaionPermission: true,
      enableGeoFence: false,
      disableOpenURL: false,
      badgeCountReset: false
    )
    
    // UNUserNotificationCenter delegate set et
    let center = UNUserNotificationCenter.current()
    center.delegate = self
    /**** Dengage Setup code ends here ********/

    factory.startReactNative(
      withModuleName: "main",
      in: window,
      launchOptions: launchOptions)
#endif

    // Super call'dan SONRA delegate kontrolü
    let result = super.application(application, didFinishLaunchingWithOptions: launchOptions)
    
    #if os(iOS) || os(tvOS)
    // Super call sonrası delegate kontrolü
    let centerAfterSuper = UNUserNotificationCenter.current()
    if centerAfterSuper.delegate != nil && centerAfterSuper.delegate !== self {
      otherDelegate = centerAfterSuper.delegate as? UNUserNotificationCenterDelegate
      centerAfterSuper.delegate = self
    }
    
    // Timer ile delegate kontrolü
    delegateCheckTimer = Timer.scheduledTimer(withTimeInterval: 0.1, repeats: true) { [weak self] _ in
      self?.captureDelegateIfNeeded()
    }
    #endif
    
    return result
  }
  
  // Delegate capture fonksiyonu
  private func captureDelegateIfNeeded() {
    let center = UNUserNotificationCenter.current()
    if center.delegate != nil && center.delegate !== self && otherDelegate == nil {
      otherDelegate = center.delegate as? UNUserNotificationCenterDelegate
      center.delegate = self
      
      // Timer'ı durdur
      if let timer = delegateCheckTimer {
        timer.invalidate()
        delegateCheckTimer = nil
      }
    }
  }

  // Linking API
  public override func application(
    _ app: UIApplication,
    open url: URL,
    options: [UIApplication.OpenURLOptionsKey: Any] = [:]
  ) -> Bool {
    return super.application(app, open: url, options: options) || RCTLinkingManager.application(app, open: url, options: options)
  }

  // Universal Links
  public override func application(
    _ application: UIApplication,
    continue userActivity: NSUserActivity,
    restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void
  ) -> Bool {
    let result = RCTLinkingManager.application(application, continue: userActivity, restorationHandler: restorationHandler)
    return super.application(application, continue: userActivity, restorationHandler: restorationHandler) || result
  }

  // MARK: - APNs Token Registration
  public override func application(
    _ application: UIApplication,
    didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data
  ) {
    // Token'ı string olarak logla
    let tokenParts = deviceToken.map { data in String(format: "%02.2hhx", data) }
    let tokenString = tokenParts.joined()
    print("🟢 [Dengage] APNs Token alındı: \\(tokenString)")
    
    // APNS Token'ı static property'de sakla
    AppDelegate.apnsToken = tokenString
    
    // Dengage'e kaydet
    let coordinator = DengageRNCoordinator.staticInstance
    coordinator.registerForPushToken(deviceToken: deviceToken)
    print("🟢 [Dengage] Token Dengage'e kaydedildi")
    
    super.application(application, didRegisterForRemoteNotificationsWithDeviceToken: deviceToken)
  }

  public override func application(
    _ application: UIApplication,
    didFailToRegisterForRemoteNotificationsWithError error: Error
  ) {
    super.application(application, didFailToRegisterForRemoteNotificationsWithError: error)
  }
  
  // MARK: - Application Lifecycle
  public override func applicationDidBecomeActive(_ application: UIApplication) {
    captureDelegateIfNeeded()
    super.applicationDidBecomeActive(application)
  }
  
  // MARK: - Background Notification Handler
  public override func application(
    _ application: UIApplication,
    didReceiveRemoteNotification userInfo: [AnyHashable: Any],
    fetchCompletionHandler completionHandler: @escaping (UIBackgroundFetchResult) -> Void
  ) {
    super.application(application, didReceiveRemoteNotification: userInfo, fetchCompletionHandler: completionHandler)
  }

  // MARK: - UNUserNotificationCenterDelegate - Foreground Notification
  public func userNotificationCenter(
    _ center: UNUserNotificationCenter,
    willPresent notification: UNNotification,
    withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void
  ) {
    // Delegate kontrolü
    if otherDelegate == nil {
      let notifCenter = UNUserNotificationCenter.current()
      let currentDelegate = notifCenter.delegate
      if currentDelegate != nil && currentDelegate !== self {
        otherDelegate = currentDelegate as? UNUserNotificationCenterDelegate
        notifCenter.delegate = self
      }
    }

    completionHandler([.sound, .alert, .badge])
  }

  // MARK: - UNUserNotificationCenterDelegate - Notification Tap Handler
  public func userNotificationCenter(
    _ center: UNUserNotificationCenter,
    didReceive response: UNNotificationResponse,
    withCompletionHandler completionHandler: @escaping () -> Void
  ) {
    // Delegate kontrolü
    if otherDelegate == nil {
      let notifCenter = UNUserNotificationCenter.current()
      let currentDelegate = notifCenter.delegate
      if currentDelegate != nil && currentDelegate !== self {
        otherDelegate = currentDelegate as? UNUserNotificationCenterDelegate
        notifCenter.delegate = self
      }
    }

    // Dengage'i her zaman çağır
    let coordinator = DengageRNCoordinator.staticInstance
    coordinator.didReceivePush(center, response) {
      completionHandler()
    }
  }
}

class ReactNativeDelegate: ExpoReactNativeFactoryDelegate {
  override func sourceURL(for bridge: RCTBridge) -> URL? {
    bridge.bundleURL ?? bundleURL()
  }

  override func bundleURL() -> URL? {
#if DEBUG
    return RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: ".expo/.virtual-metro-entry")
#else
    return Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }
}
`;

      // Write the complete AppDelegate.swift file
      fs.writeFileSync(appDelegateSwiftPath, appDelegateSwiftContent, "utf8");
      RastmobileDengageLog.log("✅ AppDelegate.swift created successfully with Dengage setup");

      return config;
    },
  ]);
};

const modifyAppEnvironment: ConfigPlugin<RastmobileDengagePluginProps> = (
  config,
  props
) => {
  return withEntitlementsPlist(config, (newConfig) => {
    if (props?.mode == null) {
      throw new Error(`
            Missing required "mode" key in your app.json or app.config.js file for "rastmobile-expo-dengage".
            "mode" can be either "development" or "production".
            Please see rastmobile-expo-dengage's README.md for more details.`);
    }
    newConfig.modResults["aps-environment"] = props.mode;
    return newConfig;
  });
};

const withAppGroupPermissions: ConfigPlugin<RastmobileDengagePluginProps> = (
  config,
  props
) => {
  const groupBundle = props.iosGroupBundle || "";
  const APP_GROUP_KEY = "com.apple.security.application-groups";
  return withEntitlementsPlist(config, (newConfig) => {
    if (!Array.isArray(newConfig.modResults[APP_GROUP_KEY])) {
      newConfig.modResults[APP_GROUP_KEY] = [];
    }
    const modResultsArray = newConfig.modResults[APP_GROUP_KEY] as Array<any>;
    const entitlement = `group.${newConfig?.ios?.bundleIdentifier || ""}${
      groupBundle?.length ? "." + groupBundle : ""
    }`;
    if (modResultsArray.indexOf(entitlement) !== -1) {
      return newConfig;
    }
    modResultsArray.push(entitlement);

    return newConfig;
  });
};

const withEasManagedCredentials: ConfigPlugin<RastmobileDengagePluginProps> = (
  config,
  props
) => {
  //assert(config.ios?.bundleIdentifier, "Missing 'ios.bundleIdentifier' in app config.")
  config.extra = getEasManagedCredentialsConfigExtra(config as ExpoConfig);
  return config;
};

const modifyPodfile: ConfigPlugin<RastmobileDengagePluginProps> = (config) => {
  return withDangerousMod(config, [
    "ios",
    async (config) => {
      // not awaiting in order to not block main thread
      const iosRoot = path.join(config.modRequest.projectRoot, "ios");
      updatePodfile(iosRoot).catch((err) => {
        RastmobileDengageLog.error(err);
      });

      return config;
    },
  ]);
};

const withDengageContentExtension: ConfigPlugin<RastmobileDengagePluginProps> = (
  config,
  props
) => {
  // Try to resolve from node_modules first, fallback to __dirname for local development
  let pluginDir;
  try {
    pluginDir = require.resolve(
      "rastmobile-expo-dengage/package.json"
    );
  } catch (e) {
    // Fallback for local development with npm link or file: protocol
    pluginDir = path.join(__dirname, "../../package.json");
  }
  const sourceDirD = path.join(
    pluginDir,
    "../src/support/DengageContentExtension/"
  );

  const contentExtensionBundle = props.iosGroupBundle || "";

  return withDangerousMod(config, [
    "ios",
    async (config) => {
      const iosPath = path.join(config.modRequest.projectRoot, "ios");

      /* COPY OVER EXTENSION FILES */
      fs.mkdirSync(`${iosPath}/${DCE_TARGET_NAME}`, { recursive: true });

      for (let i = 0; i < DCE_EXT_FILES.length; i++) {
        const extFile = DCE_EXT_FILES[i];
        const targetFile = `${iosPath}/${DCE_TARGET_NAME}/${extFile}`;
        await FileManager.copyFile(`${sourceDirD}${extFile}`, targetFile);
      }

      // Copy DCE source file either from configuration-provided location, falling back to the default one.
      const sourcePathD = `${sourceDirD}${DCE_SOURCE_FILE}`;
      const targetFileD = `${iosPath}/${DCE_TARGET_NAME}/${DCE_SOURCE_FILE}`;
      await FileManager.copyFile(`${sourcePathD}`, targetFileD);

      const sourcePathDB = `${sourceDirD}${DCEB_SOURCE_FILE}`;
      const targetFileDB = `${iosPath}/${DCE_TARGET_NAME}/${DCEB_SOURCE_FILE}`;
      await FileManager.copyFile(`${sourcePathDB}`, targetFileDB);

      const sourcePathDC = `${sourceDirD}${DCEC_SOURCE_FILE}`;
      const targetFileDC = `${iosPath}/${DCE_TARGET_NAME}/${DCEC_SOURCE_FILE}`;
      await FileManager.copyFile(`${sourcePathDC}`, targetFileDC);

      const sourcePathDD = `${sourceDirD}${DCED_SOURCE_FILE}`;
      const targetFileDD = `${iosPath}/${DCE_TARGET_NAME}/${DCED_SOURCE_FILE}`;
      await FileManager.copyFile(`${sourcePathDD}`, targetFileDD);

      const sourcePathDE = `${sourceDirD}${DCEE_SOURCE_FILE}`;
      const targetFileDE = `${iosPath}/${DCE_TARGET_NAME}/${DCEE_SOURCE_FILE}`;
      await FileManager.copyFile(`${sourcePathDE}`, targetFileDE);

      /* MODIFY COPIED EXTENSION FILES */
      const nseUpdater = new NseUpdaterManager(iosPath);
      await nseUpdater.updateDCEEntitlements(
        `group.${config.ios?.bundleIdentifier}${
          contentExtensionBundle?.length ? "." + contentExtensionBundle : ""
        }`
      );
      await nseUpdater.updateDCEBundleVersion(
        config.ios?.buildNumber ?? DEFAULT_BUNDLE_VERSION
      );
      await nseUpdater.updateDCEBundleShortVersion(
        config?.version ?? DEFAULT_BUNDLE_SHORT_VERSION
      );

      return config;
    },
  ]);
};

const withDengageNotificationExtension: ConfigPlugin<RastmobileDengagePluginProps> = (
  config,
  props
) => {
  // support for monorepos where node_modules can be above the project directory.
  const notificationServiceBundle = props.iosGroupBundle || "";

  // Try to resolve from node_modules first, fallback to __dirname for local development
  let pluginDir;
  try {
    pluginDir = require.resolve(
      "rastmobile-expo-dengage/package.json"
    );
  } catch (e) {
    // Fallback for local development with npm link or file: protocol
    pluginDir = path.join(__dirname, "../../package.json");
  }
  const sourceDirD = path.join(
    pluginDir,
    "../src/support/DengageNotificationServiceExtension/"
  );

  return withDangerousMod(config, [
    "ios",
    async (config) => {
      const iosPath = path.join(config.modRequest.projectRoot, "ios");

      /* COPY OVER EXTENSION FILES */
      fs.mkdirSync(`${iosPath}/${DNE_TARGET_NAME}`, { recursive: true });

      for (let i = 0; i < DNE_EXT_FILES.length; i++) {
        const extFile = DNE_EXT_FILES[i];
        const targetFile = `${iosPath}/${DNE_TARGET_NAME}/${extFile}`;
        await FileManager.copyFile(`${sourceDirD}${extFile}`, targetFile);
      }

      const sourcePath = `${sourceDirD}${DNE_SOURCE_FILE}`;
      const targetFile = `${iosPath}/${DNE_TARGET_NAME}/${DNE_SOURCE_FILE}`;
      await FileManager.copyFile(`${sourcePath}`, targetFile);

      /* MODIFY COPIED EXTENSION FILES */
      const nseUpdater = new NseUpdaterManager(iosPath);
      await nseUpdater.updateDNEEntitlements(
        `group.${config.ios?.bundleIdentifier}${
          notificationServiceBundle?.length
            ? "." + notificationServiceBundle
            : ""
        }`
      );
      await nseUpdater.updateDNEBundleVersion(
        config.ios?.buildNumber ?? DEFAULT_BUNDLE_VERSION
      );
      await nseUpdater.updateDNEBundleShortVersion(
        config?.version ?? DEFAULT_BUNDLE_SHORT_VERSION
      );

      return config;
    },
  ]);
};

const modifyXcodeProject: ConfigPlugin<RastmobileDengagePluginProps> = (
  config,
  props
) => {
  return withXcodeProject(config, (newConfig) => {
    const xcodeProject = newConfig.modResults;

    // Create new PBXGroup for the extension
    const extGroup = xcodeProject.addPbxGroup(
      [...DNE_EXT_FILES, DNE_SOURCE_FILE],
      DNE_TARGET_NAME,
      DNE_TARGET_NAME
    );
    const extGroupD = xcodeProject.addPbxGroup(
      [
        ...DCE_EXT_FILES,
        DCE_SOURCE_FILE,
        DCEB_SOURCE_FILE,
        DCEC_SOURCE_FILE,
        DCED_SOURCE_FILE,
        DCEE_SOURCE_FILE,
      ],
      DCE_TARGET_NAME,
      DCE_TARGET_NAME
    );

    // Add the new PBXGroup to the top level group. This makes the
    // files / folder appear in the file explorer in Xcode.
    const groups = xcodeProject.hash.project.objects["PBXGroup"];
    Object.keys(groups).forEach(function (key) {
      if (groups[key].name === undefined) {
        xcodeProject.addToPbxGroup(extGroup.uuid, key);
        xcodeProject.addToPbxGroup(extGroupD.uuid, key);
      }
    });

    // WORK AROUND for codeProject.addTarget BUG
    // Xcode projects don't contain these if there is only one target
    // An upstream fix should be made to the code referenced in this link:
    //   - https://github.com/apache/cordova-node-xcode/blob/8b98cabc5978359db88dc9ff2d4c015cba40f150/lib/pbxProject.js#L860
    const projObjects = xcodeProject.hash.project.objects;
    projObjects["PBXTargetDependency"] =
      projObjects["PBXTargetDependency"] || {};
    projObjects["PBXContainerItemProxy"] =
      projObjects["PBXTargetDependency"] || {};

    if (!!xcodeProject.pbxTargetByName(DNE_TARGET_NAME)) {
      RastmobileDengageLog.log(
        `${DNE_TARGET_NAME} already exists in project. Skipping...`
      );
      return newConfig;
    }

    if (!!xcodeProject.pbxTargetByName(DCE_TARGET_NAME)) {
      RastmobileDengageLog.log(
        `${DCE_TARGET_NAME} already exists in project. Skipping...`
      );
      return newConfig;
    }

    // Add the NSE target
    // This adds PBXTargetDependency and PBXContainerItemProxy for you

    const notificationBundle =
      props.notificationServiceIosBundle || DNE_TARGET_NAME;
    const contentBundle = props.contentExtensionIosBundle || DCE_TARGET_NAME;

    const dneTarget = xcodeProject.addTarget(
      DNE_TARGET_NAME,
      "app_extension",
      DNE_TARGET_NAME,
      `${config.ios?.bundleIdentifier}.${notificationBundle}`
    );
    const dceTarget = xcodeProject.addTarget(
      DCE_TARGET_NAME,
      "app_extension",
      DCE_TARGET_NAME,
      `${config.ios?.bundleIdentifier}.${contentBundle}`
    );

    // Add build phases to the new target
    xcodeProject.addBuildPhase(
      ["NotificationService.swift"],
      "PBXSourcesBuildPhase",
      "Sources",
      dneTarget.uuid
    );

    xcodeProject.addBuildPhase(
      [],
      "PBXResourcesBuildPhase",
      "Resources",
      dneTarget.uuid
    );

    xcodeProject.addBuildPhase(
      [],
      "PBXFrameworksBuildPhase",
      "Frameworks",
      dneTarget.uuid
    );

    // Add build phases to the new target
    xcodeProject.addBuildPhase(
      [
        "DengageNotificationViewController.m",
        "CarouselNotificationCell.m",
        "DengageRecievedMessage.m",
        "CarouselNotificationCell.xib",
        "MainInterface.storyboard",
      ],
      "PBXSourcesBuildPhase",
      "Sources",
      dceTarget.uuid
    );

    xcodeProject.addBuildPhase(
      [],
      "PBXResourcesBuildPhase",
      "Resources",
      dceTarget.uuid
    );

    xcodeProject.addBuildPhase(
      ["UserNotifications.framework", "UserNotificationsUI.framework"],
      "PBXFrameworksBuildPhase",
      "Frameworks",
      dceTarget.uuid
    );

    // Edit the Deployment info of the new Target, only IphoneOS and Targeted Device Family
    // However, can be more
    const configurations = xcodeProject.pbxXCBuildConfigurationSection();
    for (const key in configurations) {
      if (
        typeof configurations[key].buildSettings !== "undefined" &&
        configurations[key].buildSettings.PRODUCT_NAME == `"${DNE_TARGET_NAME}"`
      ) {
        const buildSettingsObj = configurations[key].buildSettings;
        buildSettingsObj.DEVELOPMENT_TEAM = props?.devTeam;
        buildSettingsObj.IPHONEOS_DEPLOYMENT_TARGET =
          IPHONEOS_DEPLOYMENT_TARGET;
        buildSettingsObj.TARGETED_DEVICE_FAMILY = TARGETED_DEVICE_FAMILY;
        buildSettingsObj.CODE_SIGN_ENTITLEMENTS = `${DNE_TARGET_NAME}/${DNE_TARGET_NAME}.entitlements`;
        buildSettingsObj.CODE_SIGN_STYLE = "Automatic";
        buildSettingsObj.SWIFT_VERSION = "5";
      }

      if (
        typeof configurations[key].buildSettings !== "undefined" &&
        configurations[key].buildSettings.PRODUCT_NAME == `"${DCE_TARGET_NAME}"`
      ) {
        const buildSettingsObj = configurations[key].buildSettings;
        buildSettingsObj.DEVELOPMENT_TEAM = props?.devTeam;
        buildSettingsObj.IPHONEOS_DEPLOYMENT_TARGET =
          IPHONEOS_DEPLOYMENT_TARGET;
        buildSettingsObj.TARGETED_DEVICE_FAMILY = TARGETED_DEVICE_FAMILY;
        buildSettingsObj.CODE_SIGN_ENTITLEMENTS = `${DCE_TARGET_NAME}/${DCE_TARGET_NAME}.entitlements`;
        buildSettingsObj.CODE_SIGN_STYLE = "Automatic";
      }
    }

    // Add development teams to both your target and the original project
    xcodeProject.addTargetAttribute(
      "DevelopmentTeam",
      props?.devTeam,
      dneTarget
    );
    xcodeProject.addTargetAttribute(
      "DevelopmentTeam",
      props?.devTeam,
      dceTarget
    );
    xcodeProject.addTargetAttribute("DevelopmentTeam", props?.devTeam);
    return newConfig;
  });
};

const withRastmobileDengageIos: ConfigPlugin<RastmobileDengagePluginProps> = (
  config,
  props
) => {
  config = withDengageContentExtension(config, props);
  config = withDengageNotificationExtension(config, props);
  config = modifyAppEnvironment(config, props);
  config = withRemoteNotificationsPermissions(config, props);
  config = withAppGroupPermissions(config, props);
  config = modifyPodfile(config, props);
  config = modifyInfoPlist(config, props);
  config = modifyXcodeProject(config, props);
  config = withEasManagedCredentials(config, props);
  config = modifyAppDelegate(config, props); // Creates complete AppDelegate.swift for Expo SDK 53+
  return config;
};

export default withRastmobileDengageIos;
