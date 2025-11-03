/*
 * rastmobile-expo-dengage
 * created by: Rastmobile Team
 */
import fs from 'fs';
import { DCE_PODFILE_REGEX, DCE_PODFILE_SNIPPET, DNE_PODFILE_REGEX, DNE_PODFILE_SNIPPET } from './iosConstants';
import { FileManager } from './FileManager';
import { RastmobileDengageLog } from './RastmobileDengageLog';

export async function updatePodfile(iosPath: string) {
  const podfile = await FileManager.readFile(`${iosPath}/Podfile`);
  const matches = podfile.match(DNE_PODFILE_REGEX);
  const matchesD = podfile.match(DCE_PODFILE_REGEX);

  if (matches) {
    RastmobileDengageLog.log("DengageNotificationServiceExtension target already added to Podfile. Skipping...");
  } else {
    const podFile = `${iosPath}/Podfile`;
    let podFileR = await FileManager.readFile(podFile);

    /*
     installer.pods_project.targets.each do |target|
      target.build_configurations.each do |config|
        config.build_settings['APPLICATION_EXTENSION_API_ONLY'] = 'NO'
      end
    end
    */
    podFileR = podFileR.replace(
      "installer.target_installation_results.pod_target_installation_results",
      "installer.pods_project.targets.each do |target|\n" +
      " target.build_configurations.each do |config|\n" +
      "  config.build_settings['APPLICATION_EXTENSION_API_ONLY'] = 'NO'\n" +
      " end\n" +
      "end\n" +
      "installer.target_installation_results.pod_target_installation_results"
    );
    await FileManager.writeFile(podFile, podFileR);

    fs.appendFile(`${iosPath}/Podfile`, DNE_PODFILE_SNIPPET, (err) => {
      if (err) {
        RastmobileDengageLog.error("Error writing to Podfile");
      }
    })
  }

  if (matchesD) {
    RastmobileDengageLog.log("DengageContentExtension target already added to Podfile. Skipping...");
  } else {
    fs.appendFile(`${iosPath}/Podfile`, DCE_PODFILE_SNIPPET, (err) => {
      if (err) {
        RastmobileDengageLog.error("Error writing to Podfile");
      }
    })
  }
}
