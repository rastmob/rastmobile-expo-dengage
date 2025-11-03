/*
 * rastmobile-expo-dengage
 * created by: Rastmobile Team
 */
import * as fs from 'fs';
import { RastmobileDengageLog } from './RastmobileDengageLog';
/**
 * FileManager contains static *awaitable* file-system functions
 */
export class FileManager {
    static async readFile(path) {
        return new Promise((resolve, reject) => {
            fs.readFile(path, 'utf8', (err, data) => {
                if (err || !data) {
                    RastmobileDengageLog.error("Couldn't read file:" + path);
                    reject(err);
                    return;
                }
                resolve(data);
            });
        });
    }
    static async writeFile(path, contents) {
        return new Promise((resolve, reject) => {
            fs.writeFile(path, contents, 'utf8', (err) => {
                if (err) {
                    RastmobileDengageLog.error("Couldn't write file:" + path);
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }
    static async copyFile(path1, path2) {
        const fileContents = await FileManager.readFile(path1);
        await FileManager.writeFile(path2, fileContents);
    }
    static dirExists(path) {
        return fs.existsSync(path);
    }
}
//# sourceMappingURL=FileManager.js.map