/*
 * rastmobile-expo-dengage
 * created by: Rastmobile Team
 */
import { FileManager } from './FileManager';
import { BUNDLE_SHORT_VERSION_TEMPLATE_REGEX, BUNDLE_VERSION_TEMPLATE_REGEX, GROUP_IDENTIFIER_TEMPLATE_REGEX, DNE_TARGET_NAME, DCE_TARGET_NAME, } from './iosConstants';
const entitlementsFileName = `DengageNotificationService.entitlements`;
const plistFileName = `DengageNotificationService-Info.plist`;
const entitlementsFileNameD = `DengageContentExtension.entitlements`;
const plistFileNameD = `DengageContentExtension-Info.plist`;
export default class NseUpdaterManager {
    dcePath = '';
    dnePath = '';
    constructor(iosPath) {
        this.dnePath = `${iosPath}/${DNE_TARGET_NAME}`;
        this.dcePath = `${iosPath}/${DCE_TARGET_NAME}`;
    }
    async updateDNEEntitlements(groupIdentifier) {
        const entitlementsFilePath = `${this.dnePath}/${entitlementsFileName}`;
        let entitlementsFile = await FileManager.readFile(entitlementsFilePath);
        entitlementsFile = entitlementsFile.replace(GROUP_IDENTIFIER_TEMPLATE_REGEX, groupIdentifier);
        await FileManager.writeFile(entitlementsFilePath, entitlementsFile);
    }
    async updateDNEBundleVersion(version) {
        const plistFilePath = `${this.dnePath}/${plistFileName}`;
        let plistFile = await FileManager.readFile(plistFilePath);
        plistFile = plistFile.replace(BUNDLE_VERSION_TEMPLATE_REGEX, version);
        await FileManager.writeFile(plistFilePath, plistFile);
    }
    async updateDNEBundleShortVersion(version) {
        const plistFilePath = `${this.dnePath}/${plistFileName}`;
        let plistFile = await FileManager.readFile(plistFilePath);
        plistFile = plistFile.replace(BUNDLE_SHORT_VERSION_TEMPLATE_REGEX, version);
        await FileManager.writeFile(plistFilePath, plistFile);
    }
    async updateDCEEntitlements(groupIdentifier) {
        const entitlementsFilePathD = `${this.dcePath}/${entitlementsFileNameD}`;
        let entitlementsFileD = await FileManager.readFile(entitlementsFilePathD);
        entitlementsFileD = entitlementsFileD.replace(GROUP_IDENTIFIER_TEMPLATE_REGEX, groupIdentifier);
        await FileManager.writeFile(entitlementsFilePathD, entitlementsFileD);
    }
    async updateDCEBundleVersion(version) {
        const plistFilePathD = `${this.dcePath}/${plistFileNameD}`;
        let plistFileD = await FileManager.readFile(plistFilePathD);
        plistFileD = plistFileD.replace(BUNDLE_VERSION_TEMPLATE_REGEX, version);
        await FileManager.writeFile(plistFilePathD, plistFileD);
    }
    async updateDCEBundleShortVersion(version) {
        const plistFilePathD = `${this.dcePath}/${plistFileNameD}`;
        let plistFileD = await FileManager.readFile(plistFilePathD);
        plistFileD = plistFileD.replace(BUNDLE_SHORT_VERSION_TEMPLATE_REGEX, version);
        await FileManager.writeFile(plistFilePathD, plistFileD);
    }
}
//# sourceMappingURL=NseUpdaterManager.js.map