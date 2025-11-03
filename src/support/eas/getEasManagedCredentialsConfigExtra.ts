import { DCE_TARGET_NAME, DNE_TARGET_NAME } from '../iosConstants';
import { ExpoConfig } from '@expo/config-types';

export default function getEasManagedCredentialsConfigExtra(config: ExpoConfig): {[k: string]: any} {
  return {
    ...config.extra,
    eas: {
      ...config.extra?.eas,
      build: {
        ...config.extra?.eas?.build,
        experimental: {
          ...config.extra?.eas?.build?.experimental,
          ios: {
            ...config.extra?.eas?.build?.experimental?.ios,
            appExtensions: [
              ...(config.extra?.eas?.build?.experimental?.ios?.appExtensions ?? []),
              {
                // keep in sync with native changes in NSE
                targetName: DCE_TARGET_NAME,
                bundleIdentifier: `${config?.ios?.bundleIdentifier}.${DCE_TARGET_NAME}`,
                entitlements: {
                  'com.apple.security.application-groups': [
                    `group.${config?.ios?.bundleIdentifier}`
                  ]
                },
              },
              {
                // keep in sync with native changes in NSE
                targetName: DNE_TARGET_NAME,
                bundleIdentifier: `${config?.ios?.bundleIdentifier}.${DNE_TARGET_NAME}`,
                entitlements: {
                  'com.apple.security.application-groups': [
                    `group.${config?.ios?.bundleIdentifier}`
                  ]
                },
              },
            ]
          }
        }
      }
    }
  }
}
