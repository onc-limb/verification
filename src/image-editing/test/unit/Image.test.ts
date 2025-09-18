import { Image } from '../../domain/models/Image';
import { ImageMetadataValueObject } from '../../domain/models/ImageMetadata';

describe('Image', () => {
  const validMetadata = ImageMetadataValueObject.create(1920, 1080);

  describe('create', () => {
    it('should create a valid image with proper inputs', () => {
      const image = Image.create(
        'test-id',
        'test.jpg',
        '/path/to/test.jpg',
        'Test caption',
        ['label1', 'label2'],
        new Date('2023-01-01'),
        1024,
        'image/jpeg',
        validMetadata
      );

      expect(image.id).toBe('test-id');
      expect(image.filename).toBe('test.jpg');
      expect(image.caption).toBe('Test caption');
      expect(image.labels).toEqual(['label1', 'label2']);
    });

    it('should reject empty filename', () => {
      expect(() => {
        Image.create(
          'test-id',
          '',
          '/path/to/test.jpg',
          'Test caption',
          ['label1'],
          new Date(),
          1024,
          'image/jpeg',
          validMetadata
        );
      }).toThrow('Filename cannot be empty');
    });

    it('should reject files larger than 10MB', () => {
      expect(() => {
        Image.create(
          'test-id',
          'test.jpg',
          '/path/to/test.jpg',
          'Test caption',
          ['label1'],
          new Date(),
          11 * 1024 * 1024, // 11MB
          'image/jpeg',
          validMetadata
        );
      }).toThrow('File size cannot exceed 10MB');
    });

    it('should reject unsupported mime types', () => {
      expect(() => {
        Image.create(
          'test-id',
          'test.gif',
          '/path/to/test.gif',
          'Test caption',
          ['label1'],
          new Date(),
          1024,
          'image/gif',
          validMetadata
        );
      }).toThrow('Only JPEG and PNG images are supported');
    });

    it('should reject empty captions', () => {
      expect(() => {
        Image.create(
          'test-id',
          'test.jpg',
          '/path/to/test.jpg',
          '',
          ['label1'],
          new Date(),
          1024,
          'image/jpeg',
          validMetadata
        );
      }).toThrow('Caption cannot be empty');
    });

    it('should reject empty labels array', () => {
      expect(() => {
        Image.create(
          'test-id',
          'test.jpg',
          '/path/to/test.jpg',
          'Test caption',
          [],
          new Date(),
          1024,
          'image/jpeg',
          validMetadata
        );
      }).toThrow('At least one label must be provided');
    });

    it('should filter out empty labels', () => {
      const image = Image.create(
        'test-id',
        'test.jpg',
        '/path/to/test.jpg',
        'Test caption',
        ['label1', '', 'label2', '   '],
        new Date(),
        1024,
        'image/jpeg',
        validMetadata
      );

      expect(image.labels).toEqual(['label1', 'label2']);
    });
  });
});