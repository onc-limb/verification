import { Request, Response } from 'express';
import { IImageService } from '../../usecase/interfaces/IImageService';
import { CreateImageRequest } from '../../../shared/types';

export class ImageController {
  constructor(private imageService: IImageService) {}

  uploadImage = async (req: Request, res: Response): Promise<void> => {
    try {
      // Validate multipart data
      if (!req.file) {
        res.status(400).json({ error: 'No image file provided' });
        return;
      }

      const { caption, labels } = req.body;

      // Validate required fields
      if (!caption || typeof caption !== 'string') {
        res.status(400).json({ error: 'Caption is required and must be a string' });
        return;
      }

      // Parse labels (can be sent as JSON string or array)
      let parsedLabels: string[];
      try {
        if (typeof labels === 'string') {
          parsedLabels = JSON.parse(labels);
        } else if (Array.isArray(labels)) {
          parsedLabels = labels;
        } else {
          throw new Error('Labels must be an array or JSON string');
        }
      } catch (error) {
        res.status(400).json({ error: 'Invalid labels format. Expected array of strings.' });
        return;
      }

      // Create request object
      const createRequest: CreateImageRequest = {
        image: {
          fieldname: req.file.fieldname,
          originalname: req.file.originalname,
          encoding: req.file.encoding,
          mimetype: req.file.mimetype,
          buffer: req.file.buffer,
          size: req.file.size
        },
        caption,
        labels: parsedLabels
      };

      // Process upload
      const result = await this.imageService.uploadImage(createRequest);
      
      res.status(201).json(result);
    } catch (error) {
      console.error('Error uploading image:', error);
      
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  };

  getImage = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      
      if (!id) {
        res.status(400).json({ error: 'Image ID is required' });
        return;
      }

      const image = await this.imageService.getImage(id);
      
      if (!image) {
        res.status(404).json({ error: 'Image not found' });
        return;
      }

      res.json(image);
    } catch (error) {
      console.error('Error getting image:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  getAllImages = async (req: Request, res: Response): Promise<void> => {
    try {
      const images = await this.imageService.getAllImages();
      res.json(images);
    } catch (error) {
      console.error('Error getting all images:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  deleteImage = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      
      if (!id) {
        res.status(400).json({ error: 'Image ID is required' });
        return;
      }

      const deleted = await this.imageService.deleteImage(id);
      
      if (!deleted) {
        res.status(404).json({ error: 'Image not found' });
        return;
      }

      res.status(204).send();
    } catch (error) {
      console.error('Error deleting image:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
}