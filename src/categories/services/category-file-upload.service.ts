import { Injectable, BadRequestException } from '@nestjs/common';
import { promises as fs } from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

@Injectable()
export class CategoryFileUploadService {
  private readonly uploadPath = path.join(process.cwd(), 'uploads', 'categories');
  private readonly allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
  private readonly maxFileSize = 5 * 1024 * 1024; // 5MB

  constructor() {
    this.ensureUploadDirectory();
  }

  private async ensureUploadDirectory(): Promise<void> {
    try {
      await fs.access(this.uploadPath);
    } catch {
      await fs.mkdir(this.uploadPath, { recursive: true });
    }
  }

  private generateUniqueFileName(originalName: string): string {
    const timestamp = Date.now();
    const randomString = crypto.randomBytes(8).toString('hex');
    const extension = path.extname(originalName);
    const baseName = path.basename(originalName, extension);

    return `${timestamp}-${randomString}-${baseName}${extension}`;
  }

  private validateFile(file: Express.Multer.File): void {
    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `Invalid file type. Allowed types: ${this.allowedMimeTypes.join(', ')}`,
      );
    }

    if (file.size > this.maxFileSize) {
      throw new BadRequestException(
        `File size too large. Maximum size: ${this.maxFileSize / (1024 * 1024)}MB`,
      );
    }
  }

  async saveFiles(files: Express.Multer.File[]): Promise<string[]> {
    if (!files || files.length === 0) {
      return [];
    }

    const savedPaths: string[] = [];

    for (const file of files) {
      this.validateFile(file);

      const uniqueFileName = this.generateUniqueFileName(file.originalname);
      const filePath = path.join(this.uploadPath, uniqueFileName);

      await fs.writeFile(filePath, file.buffer);

      // Return relative path for database storage
      const relativePath = `/uploads/categories/${uniqueFileName}`;
      savedPaths.push(relativePath);
    }

    return savedPaths;
  }

  async deleteFile(filePath: string): Promise<void> {
    try {
      // Extract filename from path (handle both relative and absolute paths)
      const fileName = path.basename(filePath);
      const fullPath = path.join(this.uploadPath, fileName);

      await fs.unlink(fullPath);
    } catch (error) {
      // Ignore file not found errors
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }
  }

  async deleteMultipleFiles(filePaths: string[]): Promise<void> {
    const deletePromises = filePaths.map((filePath) =>
      this.deleteFile(filePath),
    );
    await Promise.all(deletePromises);
  }

  async deleteFilesFromCategory(images: string[]): Promise<void> {
    if (!images || images.length === 0) {
      return;
    }

    await this.deleteMultipleFiles(images);
  }
}

