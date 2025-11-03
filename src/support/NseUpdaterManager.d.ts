export default class NseUpdaterManager {
    private dcePath;
    private dnePath;
    constructor(iosPath: string);
    updateDNEEntitlements(groupIdentifier: string): Promise<void>;
    updateDNEBundleVersion(version: string): Promise<void>;
    updateDNEBundleShortVersion(version: string): Promise<void>;
    updateDCEEntitlements(groupIdentifier: string): Promise<void>;
    updateDCEBundleVersion(version: string): Promise<void>;
    updateDCEBundleShortVersion(version: string): Promise<void>;
}
//# sourceMappingURL=NseUpdaterManager.d.ts.map