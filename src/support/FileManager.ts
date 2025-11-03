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
  static async readFile(path: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
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

  static async deleteFile(path: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      fs.unlink(path, (err) => {
        if (err ) {
          RastmobileDengageLog.error("Couldn't delete file:" + path);
          reject(err);
          return;
        }
        resolve("File deleted successfully");
      });
    });
  }

  static async writeFile(path: string, contents: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
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

  static async copyFile(path1: string, path2: string): Promise<void> {
    const fileContents = await FileManager.readFile(path1);
    await FileManager.writeFile(path2, fileContents);
  }

  static dirExists(path: string): boolean {
    return fs.existsSync(path)
  }
}
