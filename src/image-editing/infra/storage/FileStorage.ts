import * as fs from 'fs/promises';
import * as path from 'path';
import { UPLOAD_DIR } from '../../../shared/constants';

export class FileStorage {
  private uploadDir: string;

  constructor(uploadDir: string = UPLOAD_DIR) {
    this.uploadDir = uploadDir;
  }

  async ensureUploadDir(): Promise<void> {
    try {
      await fs.access(this.uploadDir);
    } catch {
      await fs.mkdir(this.uploadDir, { recursive: true });
    }
  }

  async saveFile(fileName: string, buffer: Buffer): Promise<string> {
    await this.ensureUploadDir();
    const filePath = path.join(this.uploadDir, fileName);
    await fs.writeFile(filePath, buffer);
    return filePath;
  }

  async deleteFile(filePath: string): Promise<boolean> {
    try {
      await fs.unlink(filePath);
      return true;
    } catch {
      return false;
    }
  }

  async fileExists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }
}