import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';
import * as path from 'path';
import { IImageService } from '../interfaces/IImageService';
import { IImageRepository } from '../../domain/repositories/IImageRepository';
import { FileStorage } from '../../infra/storage/FileStorage';
import { Image } from '../../domain/models/Image';
import { ImageMetadataValueObject } from '../../domain/models/ImageMetadata';
import { CreateImageRequest, ImageResponse } from '../../../shared/types';

export class ImageService implements IImageService {
  constructor(
    private imageRepository: IImageRepository,
    private fileStorage: FileStorage
  ) {}

  async uploadImage(request: CreateImageRequest): Promise<ImageResponse> {
    const { image, caption, labels } = request;
    
    // Generate unique ID and filename
    const id = uuidv4();
    const fileExtension = this.getFileExtension(image.mimetype);
    const fileName = `${id}${fileExtension}`;
    
    // Get image metadata using sharp
    const metadata = await sharp(image.buffer).metadata();
    if (!metadata.width || !metadata.height) {
      throw new Error('Unable to read image dimensions');
    }
    
    const imageMetadata = ImageMetadataValueObject.create(
      metadata.width,
      metadata.height
    );
    
    // Save file to storage
    const filePath = await this.fileStorage.saveFile(fileName, image.buffer);
    
    // Create domain entity
    const imageEntity = Image.create(
      id,
      image.originalname,
      filePath,
      caption,
      labels,
      new Date(),
      image.size,
      image.mimetype,
      imageMetadata
    );
    
    // Save to repository
    await this.imageRepository.save(imageEntity);
    
    return this.mapToResponse(imageEntity);
  }

  async getImage(id: string): Promise<ImageResponse | null> {
    const image = await this.imageRepository.findById(id);
    return image ? this.mapToResponse(image) : null;
  }

  async getAllImages(): Promise<ImageResponse[]> {
    const images = await this.imageRepository.findAll();
    return images.map(image => this.mapToResponse(image));
  }

  async deleteImage(id: string): Promise<boolean> {
    const image = await this.imageRepository.findById(id);
    if (!image) {
      return false;
    }
    
    // Delete physical file
    await this.fileStorage.deleteFile(image.filePath);
    
    // Delete from repository
    return await this.imageRepository.deleteById(id);
  }

  private getFileExtension(mimeType: string): string {
    switch (mimeType) {
      case 'image/jpeg':
        return '.jpg';
      case 'image/png':
        return '.png';
      default:
        throw new Error(`Unsupported mime type: ${mimeType}`);
    }
  }

  private mapToResponse(image: Image): ImageResponse {
    return {
      id: image.id,
      filename: image.filename,
      caption: image.caption,
      labels: image.labels,
      uploadedAt: image.uploadedAt.toISOString(),
      fileSize: image.fileSize,
      mimeType: image.mimeType
    };
  }
}