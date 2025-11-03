/*
 * rastmobile-expo-dengage
 * created by: Rastmobile Team
 */
import fs from 'fs';
import { DCE_PODFILE_REGEX, DCE_PODFILE_SNIPPET, DNE_PODFILE_REGEX, DNE_PODFILE_SNIPPET } from './iosConstants';
import { FileManager } from './FileManager';
import { RastmobileDengageLog } from './RastmobileDengageLog';
export async function updatePodfile(iosPath) {
    const podfile = await FileManager.readFile(`${iosPath}/Podfile`);
    const matches = podfile.match(DNE_PODFILE_REGEX);
    const matchesD = podfile.match(DCE_PODFILE_REGEX);
    if (matches) {
        RastmobileDengageLog.log("DengageNotificationServiceExtension target already added to Podfile. Skipping...");
    }
    else {
        fs.appendFile(`${iosPath}/Podfile`, DNE_PODFILE_SNIPPET, (err) => {
            if (err) {
                RastmobileDengageLog.error("Error writing to Podfile");
            }
        });
    }
    if (matchesD) {
        RastmobileDengageLog.log("DengageContentExtension target already added to Podfile. Skipping...");
    }
    else {
        fs.appendFile(`${iosPath}/Podfile`, DCE_PODFILE_SNIPPET, (err) => {
            if (err) {
                RastmobileDengageLog.error("Error writing to Podfile");
            }
        });
    }
}
//# sourceMappingURL=updatePodfile.js.map