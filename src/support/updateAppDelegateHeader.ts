/*
 * rastmobile-expo-dengage
 * created by: Rastmobile Team
 */

import { FileManager } from "./FileManager";
import { IOSConfig } from "expo/config-plugins";

export async function updateAppDelegageHeader(delegatePath: string) {

  let fileR = await FileManager.readFile(delegatePath);

  fileR = fileR.replace(
    "@interface AppDelegate : EXAppDelegateWrapper",
    "#import <UserNotifications/UserNotifications.h>\n\n" +
      "@interface AppDelegate : EXAppDelegateWrapper<UNUserNotificationCenterDelegate>"
  );

  await FileManager.writeFile(delegatePath, fileR);
}
