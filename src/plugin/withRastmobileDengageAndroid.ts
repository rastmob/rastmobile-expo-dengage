/*
 * rastmobile-expo-dengage
 * created by: Rastmobile Team
 */

import {
  AndroidConfig,
  ConfigPlugin,
  withAndroidManifest,
  withDangerousMod,
  withMainActivity,
  withMainApplication,
} from "expo/config-plugins";
import { RastmobileDengagePluginProps } from "./types";

import { generateImageAsync } from '@expo/image-utils';
import { resolve, parse } from 'path';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { RastmobileDengageLog } from "../support/RastmobileDengageLog";


const RESOURCE_ROOT_PATH = 'android/app/src/main/res/';

// The name of each small icon folder resource, and the icon size for that folder.
const SMALL_ICON_DIRS_TO_SIZE: { [name: string]: number } = { 
        'drawable-mdpi': 24, 
        'drawable-hdpi': 36,
        'drawable-xhdpi': 48,
        'drawable-xxhdpi': 72,
        'drawable-xxxhdpi': 96
  };

// The name of each large icon folder resource, and the icon size for that folder.
const LARGE_ICON_DIRS_TO_SIZE: { [name: string]: number } = { 
        'drawable-xxxhdpi': 256
  };

const withSmallIcons: ConfigPlugin<RastmobileDengagePluginProps> = (
  config,
  props
) => {

  if(!props.smallIcons && !config.notification?.icon) {
    return config
  }

  // we are modifying the android build (adding files) without a base mod
  return withDangerousMod(config, [
    'android',
    async (config) => {
      if(config.notification?.icon) {
        await saveIconAsync(config.notification.icon, config.modRequest.projectRoot, SMALL_ICON_DIRS_TO_SIZE)
      }

      if(props.smallIcons) {
        await saveIconsArrayAsync(config.modRequest.projectRoot, props.smallIcons, SMALL_ICON_DIRS_TO_SIZE);
      }
      return config;
    },
  ]);
};

const withLargeIcons: ConfigPlugin<RastmobileDengagePluginProps> = (
  config,
  props
) => {

  if(!props.largeIcons) {
    return config
  }

  // we are modifying the android build (adding files) without a base mod
  return withDangerousMod(config, [
    'android',
    async (config) => {
      if(props.largeIcons) {
        await saveIconsArrayAsync(config.modRequest.projectRoot, props.largeIcons, LARGE_ICON_DIRS_TO_SIZE);
      }
      return config;
    },
  ]);
};

async function saveIconsArrayAsync(projectRoot: string, icons: string[], dirsToSize: { [name: string]: number }) {
  for(const icon of icons) {
    await saveIconAsync(icon, projectRoot, dirsToSize);
  }
}

async function saveIconAsync(icon: string, projectRoot: string, dirsToSize: { [name: string]: number }) {
  const name = parse(icon).name;

  RastmobileDengageLog.log("Saving icon " + icon + " as drawable resource " + name);

  for(const iconResourceDir in dirsToSize) {
    const path = resolve(projectRoot, RESOURCE_ROOT_PATH, iconResourceDir);

    if(!existsSync(path)) {
      mkdirSync(path, { recursive: true });
    }

    const resizedIcon = (
      await generateImageAsync(
        { projectRoot, cacheType: 'onesignal-icon' },
        {
          src: icon,
          width: dirsToSize[iconResourceDir],
          height: dirsToSize[iconResourceDir],
          resizeMode: 'cover',
          backgroundColor: 'transparent',
        }
      )
    ).source;

    writeFileSync(resolve(path, name + '.png'), resizedIcon);
  }
}




const modifyAndroidManifest: ConfigPlugin<RastmobileDengagePluginProps> = (
  config,
  props
) => {
  config = withAndroidManifest(config, (config) => {
    const mainApplication = AndroidConfig.Manifest.getMainApplicationOrThrow(
      config.modResults
    );

    //let receivers = config.modResults.manifest.application?.[0].receiver || [];
    //let services = config.modResults.manifest.application?.[0].service || [];

    let receivers = mainApplication.receiver || [];
    let services = mainApplication.service || [];

    receivers.push({
      $: {
        "android:exported": "true",
        "android:name": "expo.modules.rastmobiledengage.MyReceiver",
      },
      "intent-filter": [
        {
          action: [
            {
              $: {
                "android:name": "com.dengage.push.intent.RECEIVE",
              },
            },
            {
              $: {
                "android:name": "com.dengage.push.intent.ACTION_CLICK",
              },
            },
            {
              $: {
                "android:name": "com.dengage.push.intent.CAROUSEL_ITEM_CLICK",
              },
            },
            {
              $: {
                "android:name": "com.dengage.push.intent.ITEM_CLICK",
              },
            },
            {
              $: {
                "android:name": "com.dengage.push.intent.DELETE",
              },
            },
            {
              $: {
                "android:name": "com.dengage.push.intent.OPEN",
              },
            },
          ],
        },
      ],
    });

    /* services.push({
      $: {
        "android:name": "com.dengage.sdk.push.HmsMessagingService",
        "android:exported": "false",
      },
      "intent-filter": [
        {
          action: [
            {
              $: {
                "android:name": "com.huawei.push.action.MESSAGING_EVENT",
              },
            },
          ],
        },
      ],
    }); */

    services.push({
      $: {
        "android:name": "com.dengage.sdk.push.FcmMessagingService",
        "android:exported": "false",
      },
      "intent-filter": [
        {
          action: [
            {
              $: {
                "android:name": "com.google.firebase.MESSAGING_EVENT",
              },
            },
          ],
        },
      ],
    });

    if (config.modResults.manifest.application?.[0].receiver) {
      config.modResults.manifest.application[0].receiver = receivers;

      /* config.modResults.manifest.application[0].receiver = JSON.parse(
        JSON.stringify(receivers).replace(/intentFilter/g, "intent-filter")
      ); */
    }

    if (config.modResults.manifest.application?.[0].service) {
      config.modResults.manifest.application[0].service = services;

      /* config.modResults.manifest.application[0].service = JSON.parse(
        JSON.stringify(services).replace(/intentFilter/g, "intent-filter")
      ); */
    }

    mainApplication.service = services;
    mainApplication.receiver = receivers;
    //add service

    AndroidConfig.Manifest.addMetaDataItemToMainApplication(
      mainApplication,
      "den_event_api_url",
      props.dengageEventApiUrl || "https://tr-event.dengage.com"
    );

    AndroidConfig.Manifest.addMetaDataItemToMainApplication(
      mainApplication,
      "den_push_api_url",
      props.dengageApiUrl || "https://tr-push.dengage.com"
    );
    AndroidConfig.Manifest.addMetaDataItemToMainApplication(
      mainApplication,
      "den_geofence_api_url",
      props.dengageGeofenceApiUrl || "https://tr-push.dengage.com/geoapi/"
    );
    return config;
  });

  return config;
};

const modifyMainActivity: ConfigPlugin<RastmobileDengagePluginProps> = (
  config,
  props
) => {
  return withMainActivity(config, async (config) => {
    if (!config.modResults?.contents) {
      return config;
    }

    const key =
      props.mode === "development"
        ? props.developmentIntegrationKeys?.android ||
          props.productionIntegrationKeys?.android
        : props.productionIntegrationKeys?.android ||
          props.developmentIntegrationKeys?.android;
          
    let content = config.modResults.contents;

    // ========== STEP 1: NUCLEAR OPTION - Remove ALL Dengage imports first ==========
    // Remove ALL DengageRNCoordinator imports (no matter how many)
    content = content.replace(/import\s+com\.reactnativedengage\.DengageRNCoordinator\s*\n?/g, '');

    // ========== STEP 2: NUCLEAR OPTION - Remove ALL coordinator code blocks ==========
    // Remove ALL coordinator blocks using a very aggressive regex
    // This pattern matches the entire coordinator setup block
    content = content.replace(/\s*val\s+coordinator\s*=\s*DengageRNCoordinator\.sharedInstance[\s\S]*?coordinator\.injectReactInstanceManager[\s\S]*?coordinator\.setupDengage\s*\([\s\S]*?applicationContext\s*\)\s*\n?/g, '');
    
    // Also remove any stray empty lines that might be left
    content = content.replace(/\n\s*\n\s*\n/g, '\n\n');

    // ========== STEP 3: Add import ONCE ==========
    // After cleanup, add the import exactly once after ReactActivityDelegateWrapper
    if (content.includes('import expo.modules.ReactActivityDelegateWrapper')) {
      content = content.replace(
        'import expo.modules.ReactActivityDelegateWrapper',
        'import expo.modules.ReactActivityDelegateWrapper\nimport com.reactnativedengage.DengageRNCoordinator'
      );
    }
    
    // ========== STEP 4: Add coordinator code ONCE before SplashScreenManager ==========
    // After cleanup, add coordinator code exactly once before SplashScreenManager
    const coordinatorCode = `val coordinator = DengageRNCoordinator.sharedInstance
    coordinator.injectReactInstanceManager(reactNativeHost.reactInstanceManager)
    coordinator.setupDengage(
        true,
        "${key}",
        true,
        applicationContext
    )
    `;
    
    // Insert before SplashScreenManager.registerOnActivity
    if (content.includes('SplashScreenManager.registerOnActivity(this)')) {
      content = content.replace(
        'SplashScreenManager.registerOnActivity(this)',
        coordinatorCode + '\n    SplashScreenManager.registerOnActivity(this)'
      );
    } else if (content.includes('// @generated begin expo-splashscreen')) {
      content = content.replace(
        '    // @generated begin expo-splashscreen',
        '    ' + coordinatorCode + '\n    // @generated begin expo-splashscreen'
      );
    } else if (content.includes('super.onCreate(null)')) {
      content = content.replace(
        'super.onCreate(null)',
        coordinatorCode + '\n    super.onCreate(null)'
      );
    }

    // ========== STEP 5: Check if things exist ==========
    const permissionCodeExists = (content.includes("POST_NOTIFICATIONS") && 
                                 content.includes("Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU") &&
                                 content.includes("window.decorView.post"));
    const permissionImportsExist = content.includes("android.Manifest") && 
                                   content.includes("androidx.core.app.ActivityCompat");

    // Add permission imports if they don't exist
    if (!permissionImportsExist) {
      // Add after package declaration or after first import
      if (content.includes("import android.os.Build")) {
        content = content.replace(
          "import android.os.Build",
          "import android.Manifest\nimport android.content.pm.PackageManager\nimport android.os.Build\nimport androidx.core.app.ActivityCompat\nimport androidx.core.content.ContextCompat"
        );
      } else if (content.includes("import android.os.Bundle")) {
        content = content.replace(
          "import android.os.Bundle",
          "import android.Manifest\nimport android.content.pm.PackageManager\nimport android.os.Build\nimport android.os.Bundle\nimport androidx.core.app.ActivityCompat\nimport androidx.core.content.ContextCompat"
        );
      }
    }

    // ========== STEP 6: Clean ALL permission code and add new safe version ONCE ==========
    // Remove ALL permission code first (both old and new patterns)
    content = content.replace(/\/\/ Request notification permission for Android 13\+[\s\S]*?Build\.VERSION\.SDK_INT >= Build\.VERSION_CODES\.TIRAMISU[\s\S]*?}\s*}\s*}\s*/g, '');
    
    // Add new safe permission code AFTER super.onCreate ONCE
    const permissionCode = `

    // Request notification permission for Android 13+ (API 33+)
    // Note: Request permission AFTER super.onCreate with delay to avoid crashes
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
      if (ContextCompat.checkSelfPermission(this, Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
        // Use Handler with postDelayed to ensure Activity is fully ready
        android.os.Handler(android.os.Looper.getMainLooper()).postDelayed({
          if (!isFinishing && !isDestroyed) {
            try {
              ActivityCompat.requestPermissions(this, arrayOf(Manifest.permission.POST_NOTIFICATIONS), 1001)
            } catch (e: Exception) {
              e.printStackTrace()
            }
          }
        }, 500)
      }
    }`;
    
    // Add permission code AFTER super.onCreate(null) - this is critical to avoid crashes
    if (content.includes("super.onCreate(null)")) {
      content = content.replace(
        /(super\.onCreate\(null\))/,
        `$1${permissionCode}`
      );
    }

    config.modResults.contents = content;
    return config;
  });
};

const modifyMainApplication: ConfigPlugin<RastmobileDengagePluginProps> = (
  config,
  props
) => {
  return withMainApplication(config, async (config) => {
    if (!config.modResults?.contents) {
      return config;
    }

    let content = config.modResults.contents;

    // Check if DengagePackage import already exists
    const importExists = content.includes("import com.reactnativedengage.DengagePackage");
    
    // Check if DengagePackage is already added to packages
    const packageExists = content.includes("DengagePackage()");

    // Only add import if it doesn't exist
    if (!importExists) {
      // Add import after ReactPackage import
      content = content.replace(
        /import com\.facebook\.react\.ReactPackage/g,
        "import com.facebook.react.ReactPackage\nimport com.reactnativedengage.DengagePackage"
      );
    }

    // Only add DengagePackage to packages list if it doesn't exist
    if (!packageExists) {
      // Find the packages list and add DengagePackage
      // Look for the pattern: val packages = PackageList(this).packages
      // and add DengagePackage() after it
      content = content.replace(
        /(val packages = PackageList\(this\)\.packages)/,
        "$1\n            packages.add(DengagePackage())"
      );
    }

    config.modResults.contents = content;
    return config;
  });
};

const modifyAndroidManifestPermissions: ConfigPlugin<RastmobileDengagePluginProps> = (
  config,
  props
) => {
  return withAndroidManifest(config, (config) => {
    const androidManifest = config.modResults;
    const { manifest } = androidManifest;

    // Ensure uses-permission array exists
    if (!manifest["uses-permission"]) {
      manifest["uses-permission"] = [];
    }

    // Check if POST_NOTIFICATIONS permission already exists
    const hasPostNotifications = manifest["uses-permission"].some(
      (permission: any) => permission.$?.["android:name"] === "android.permission.POST_NOTIFICATIONS"
    );

    // Add POST_NOTIFICATIONS permission if it doesn't exist
    if (!hasPostNotifications) {
      manifest["uses-permission"].push({
        $: { "android:name": "android.permission.POST_NOTIFICATIONS" },
      });
    }

    return config;
  });
};

const withRastmobileDengageAndroid: ConfigPlugin<RastmobileDengagePluginProps> = (
  config,
  props
) => {
  config = modifyAndroidManifest(config, props);
  config = modifyMainActivity(config, props);
  config = modifyMainApplication(config, props);
  config = modifyAndroidManifestPermissions(config, props);
  config = withSmallIcons(config, props);
  config = withLargeIcons(config, props);
  return config;
};

export default withRastmobileDengageAndroid;
