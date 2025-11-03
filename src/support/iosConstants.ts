/*
 * rastmobile-expo-dengage
 * created by: Rastmobile Team
 */
export const IPHONEOS_DEPLOYMENT_TARGET = "15.1";
export const TARGETED_DEVICE_FAMILY = `"1,2"`;
export const DENGAGE_VERSION = '5.70.2';


//DNE : DengageNotificationServiceExtension
//DCE : DengageContentExtension

export const GROUP_IDENTIFIER_TEMPLATE_REGEX = /{{GROUP_IDENTIFIER}}/gm;
export const BUNDLE_SHORT_VERSION_TEMPLATE_REGEX = /{{BUNDLE_SHORT_VERSION}}/gm;
export const BUNDLE_VERSION_TEMPLATE_REGEX = /{{BUNDLE_VERSION}}/gm;

export const DEFAULT_BUNDLE_VERSION = "1";
export const DEFAULT_BUNDLE_SHORT_VERSION = "1.0";

export const DNE_PODFILE_SNIPPET = `
target 'DengageNotificationServiceExtension' do
pod 'Dengage' , :git => 'https://github.com/dengage-tech/dengage-ios-sdk.git', :branch => 'version/${DENGAGE_VERSION}'
  use_frameworks! :linkage => podfile_properties['ios.useFrameworks'].to_sym if podfile_properties['ios.useFrameworks']
end`;
export const DNE_PODFILE_REGEX = /target 'DengageNotificationServiceExtension'/;
export const DNE_TARGET_NAME = "DengageNotificationServiceExtension";
export const DNE_SOURCE_FILE = "NotificationService.swift";
export const DNE_EXT_FILES = [
  `${DNE_TARGET_NAME}.entitlements`,
  `${DNE_TARGET_NAME}-Info.plist`,
];

export const DCE_PODFILE_SNIPPET = `
target 'DengageContentExtension' do
pod 'Dengage' , :git => 'https://github.com/dengage-tech/dengage-ios-sdk.git', :branch => 'version/${DENGAGE_VERSION}'
  use_frameworks! :linkage => podfile_properties['ios.useFrameworks'].to_sym if podfile_properties['ios.useFrameworks']
end`;
export const DCE_PODFILE_REGEX = /target 'DengageContentExtension'/;
export const DCE_TARGET_NAME = "DengageContentExtension";
export const DCE_SOURCE_FILE = "DengageNotificationViewController.m";
export const DCEB_SOURCE_FILE = "CarouselNotificationCell.m";
export const DCEC_SOURCE_FILE = "DengageRecievedMessage.m";
export const DCED_SOURCE_FILE = "CarouselNotificationCell.xib";
export const DCEE_SOURCE_FILE = "MainInterface.storyboard";
export const DCE_EXT_FILES = [
  "DengageNotificationViewController.h",
  "CarouselNotificationCell.h",
  "DengageRecievedMessage.h",
  `${DCE_TARGET_NAME}.entitlements`,
  `${DCE_TARGET_NAME}-Info.plist`,
];
