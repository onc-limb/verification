import { Router } from 'express';
import multer from 'multer';
import { ImageController } from '../controllers/ImageController';
import { SUPPORTED_MIME_TYPES, MAX_FILE_SIZE } from '../../../shared/constants';

// Configure multer for multipart/form-data handling
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE
  },
  fileFilter: (req, file, cb) => {
    if (SUPPORTED_MIME_TYPES.includes(file.mimetype as any)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG and PNG images are allowed'));
    }
  }
});

export function createImageRoutes(imageController: ImageController): Router {
  const router = Router();

  // POST /api/images - Upload new image with caption and labels
  router.post('/', upload.single('image'), imageController.uploadImage);

  // GET /api/images - Get all images
  router.get('/', imageController.getAllImages);

  // GET /api/images/:id - Get specific image by ID
  router.get('/:id', imageController.getImage);

  // DELETE /api/images/:id - Delete specific image
  router.delete('/:id', imageController.deleteImage);

  return router;
}