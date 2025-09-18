import * as fs from 'fs/promises';
import * as path from 'path';
import { IImageRepository } from '../../domain/repositories/IImageRepository';
import { Image } from '../../domain/models/Image';
import { ImageMetadataValueObject } from '../../domain/models/ImageMetadata';
import { IMAGES_JSON_FILE } from '../../../shared/constants';

interface StoredImageData {
  images: any[];
}

export class JsonImageRepository implements IImageRepository {
  private filePath: string;

  constructor(filePath: string = IMAGES_JSON_FILE) {
    this.filePath = filePath;
  }

  private async loadData(): Promise<StoredImageData> {
    try {
      const fileContent = await fs.readFile(this.filePath, 'utf-8');
      return JSON.parse(fileContent);
    } catch (error) {
      // File doesn't exist or is corrupted, return empty structure
      return { images: [] };
    }
  }

  private async saveData(data: StoredImageData): Promise<void> {
    const content = JSON.stringify(data, null, 2);
    await fs.writeFile(this.filePath, content, 'utf-8');
  }

  private deserializeImage(data: any): Image {
    const metadata = ImageMetadataValueObject.create(
      data.metadata.width,
      data.metadata.height
    );

    return Image.create(
      data.id,
      data.filename,
      data.filePath,
      data.caption,
      data.labels,
      new Date(data.uploadedAt),
      data.fileSize,
      data.mimeType,
      metadata
    );
  }

  async save(image: Image): Promise<void> {
    const data = await this.loadData();
    
    // Remove existing image with same ID if it exists
    data.images = data.images.filter(img => img.id !== image.id);
    
    // Add new image
    data.images.push(image.toJSON());
    
    await this.saveData(data);
  }

  async findById(id: string): Promise<Image | null> {
    const data = await this.loadData();
    const imageData = data.images.find(img => img.id === id);
    
    if (!imageData) {
      return null;
    }
    
    return this.deserializeImage(imageData);
  }

  async findAll(): Promise<Image[]> {
    const data = await this.loadData();
    return data.images.map(imgData => this.deserializeImage(imgData));
  }

  async deleteById(id: string): Promise<boolean> {
    const data = await this.loadData();
    const originalLength = data.images.length;
    
    data.images = data.images.filter(img => img.id !== id);
    
    if (data.images.length === originalLength) {
      return false; // No image was deleted
    }
    
    await this.saveData(data);
    return true;
  }
}