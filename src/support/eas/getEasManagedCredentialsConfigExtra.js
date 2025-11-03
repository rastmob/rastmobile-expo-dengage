import { DCE_TARGET_NAME } from "../iosConstants";
export default function getEasManagedCredentialsConfigExtra(config) {
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
                            }
                        ]
                    }
                }
            }
        }
    };
}
//# sourceMappingURL=getEasManagedCredentialsConfigExtra.js.map