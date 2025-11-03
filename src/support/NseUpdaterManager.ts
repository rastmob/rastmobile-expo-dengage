/*
 * rastmobile-expo-dengage
 * created by: Rastmobile Team
 */

import { FileManager } from './FileManager';
import {
  BUNDLE_SHORT_VERSION_TEMPLATE_REGEX,
  BUNDLE_VERSION_TEMPLATE_REGEX,
  GROUP_IDENTIFIER_TEMPLATE_REGEX,
  DNE_TARGET_NAME,
  DCE_TARGET_NAME,
} from './iosConstants';

const entitlementsFileName = `DengageNotificationServiceExtension.entitlements`;
const plistFileName = `DengageNotificationServiceExtension-Info.plist`;

const entitlementsFileNameD = `DengageContentExtension.entitlements`;
const plistFileNameD = `DengageContentExtension-Info.plist`;

export default class NseUpdaterManager {
  private dcePath = '';
  private dnePath = '';

  constructor(iosPath: string) {
    this.dnePath = `${iosPath}/${DNE_TARGET_NAME}`;
    this.dcePath = `${iosPath}/${DCE_TARGET_NAME}`;
  }



  async updateDNEEntitlements(groupIdentifier: string): Promise<void> {
    const entitlementsFilePath = `${this.dnePath}/${entitlementsFileName}`;
    let entitlementsFile = await FileManager.readFile(entitlementsFilePath);

    entitlementsFile = entitlementsFile.replace(GROUP_IDENTIFIER_TEMPLATE_REGEX, groupIdentifier);
    await FileManager.writeFile(entitlementsFilePath, entitlementsFile);
  }

  async updateDNEBundleVersion(version: string): Promise<void> {
    const plistFilePath = `${this.dnePath}/${plistFileName}`;
    let plistFile = await FileManager.readFile(plistFilePath);
    plistFile = plistFile.replace(BUNDLE_VERSION_TEMPLATE_REGEX, version);
    await FileManager.writeFile(plistFilePath, plistFile);
  }

  async updateDNEBundleShortVersion(version: string): Promise<void> {
    const plistFilePath = `${this.dnePath}/${plistFileName}`;
    let plistFile = await FileManager.readFile(plistFilePath);
    plistFile = plistFile.replace(BUNDLE_SHORT_VERSION_TEMPLATE_REGEX, version);
    await FileManager.writeFile(plistFilePath, plistFile);
  }

  async updateDCEEntitlements(groupIdentifier: string): Promise<void> {
    const entitlementsFilePathD = `${this.dcePath}/${entitlementsFileNameD}`;
    let entitlementsFileD = await FileManager.readFile(entitlementsFilePathD);

    entitlementsFileD = entitlementsFileD.replace(GROUP_IDENTIFIER_TEMPLATE_REGEX, groupIdentifier);
    await FileManager.writeFile(entitlementsFilePathD, entitlementsFileD);
  }

  async updateDCEBundleVersion(version: string): Promise<void> {
    const plistFilePathD = `${this.dcePath}/${plistFileNameD}`;
    let plistFileD = await FileManager.readFile(plistFilePathD);
    plistFileD = plistFileD.replace(BUNDLE_VERSION_TEMPLATE_REGEX, version);
    await FileManager.writeFile(plistFilePathD, plistFileD);
  }

  async updateDCEBundleShortVersion(version: string): Promise<void> {

    const plistFilePathD = `${this.dcePath}/${plistFileNameD}`;
    let plistFileD = await FileManager.readFile(plistFilePathD);
    plistFileD = plistFileD.replace(BUNDLE_SHORT_VERSION_TEMPLATE_REGEX, version);
    await FileManager.writeFile(plistFilePathD, plistFileD);
  }
}
