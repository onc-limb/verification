export interface ImageMetadata {
  width: number;
  height: number;
}

export class ImageMetadataValueObject {
  private constructor(
    public readonly width: number,
    public readonly height: number
  ) {}

  static create(width: number, height: number): ImageMetadataValueObject {
    if (width <= 0 || height <= 0) {
      throw new Error('Image dimensions must be positive numbers');
    }
    return new ImageMetadataValueObject(width, height);
  }

  toJSON(): ImageMetadata {
    return {
      width: this.width,
      height: this.height
    };
  }
}