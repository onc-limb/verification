import { ImageMetadataValueObject } from './ImageMetadata';

export class Image {
  private constructor(
    public readonly id: string,
    public readonly filename: string,
    public readonly filePath: string,
    public readonly caption: string,
    public readonly labels: string[],
    public readonly uploadedAt: Date,
    public readonly fileSize: number,
    public readonly mimeType: string,
    public readonly metadata: ImageMetadataValueObject
  ) {}

  static create(
    id: string,
    filename: string,
    filePath: string,
    caption: string,
    labels: string[],
    uploadedAt: Date,
    fileSize: number,
    mimeType: string,
    metadata: ImageMetadataValueObject
  ): Image {
    // Business rules validation
    if (!filename || filename.trim().length === 0) {
      throw new Error('Filename cannot be empty');
    }

    if (fileSize <= 0) {
      throw new Error('File size must be positive');
    }

    if (fileSize > 10 * 1024 * 1024) { // 10MB limit
      throw new Error('File size cannot exceed 10MB');
    }

    if (!['image/jpeg', 'image/png'].includes(mimeType)) {
      throw new Error('Only JPEG and PNG images are supported');
    }

    if (!caption || caption.trim().length === 0) {
      throw new Error('Caption cannot be empty');
    }

    if (!labels || labels.length === 0) {
      throw new Error('At least one label must be provided');
    }

    return new Image(
      id,
      filename,
      filePath,
      caption.trim(),
      labels.filter(label => label.trim().length > 0),
      uploadedAt,
      fileSize,
      mimeType,
      metadata
    );
  }

  toJSON() {
    return {
      id: this.id,
      filename: this.filename,
      filePath: this.filePath,
      caption: this.caption,
      labels: this.labels,
      uploadedAt: this.uploadedAt.toISOString(),
      fileSize: this.fileSize,
      mimeType: this.mimeType,
      metadata: this.metadata.toJSON()
    };
  }
}