import { ImageMetadataValueObject } from '../../domain/models/ImageMetadata';

describe('ImageMetadataValueObject', () => {
  describe('create', () => {
    it('should create valid metadata with positive dimensions', () => {
      const metadata = ImageMetadataValueObject.create(1920, 1080);
      
      expect(metadata.width).toBe(1920);
      expect(metadata.height).toBe(1080);
    });

    it('should reject zero width', () => {
      expect(() => {
        ImageMetadataValueObject.create(0, 1080);
      }).toThrow('Image dimensions must be positive numbers');
    });

    it('should reject zero height', () => {
      expect(() => {
        ImageMetadataValueObject.create(1920, 0);
      }).toThrow('Image dimensions must be positive numbers');
    });

    it('should reject negative dimensions', () => {
      expect(() => {
        ImageMetadataValueObject.create(-100, 200);
      }).toThrow('Image dimensions must be positive numbers');
    });
  });

  describe('toJSON', () => {
    it('should convert to JSON correctly', () => {
      const metadata = ImageMetadataValueObject.create(800, 600);
      const json = metadata.toJSON();
      
      expect(json).toEqual({
        width: 800,
        height: 600
      });
    });
  });
});