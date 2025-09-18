import express from 'express';
import { JsonImageRepository } from './image-editing/infra/repositories/JsonImageRepository';
import { FileStorage } from './image-editing/infra/storage/FileStorage';
import { ImageService } from './image-editing/usecase/services/ImageService';
import { ImageController } from './image-editing/presentation/controllers/ImageController';
import { createImageRoutes } from './image-editing/presentation/routes/imageRoutes';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Dependency injection - following Clean Architecture
const imageRepository = new JsonImageRepository();
const fileStorage = new FileStorage();
const imageService = new ImageService(imageRepository, fileStorage);
const imageController = new ImageController(imageService);

// Routes
app.use('/api/images', createImageRoutes(imageController));

// Basic health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'Image Caption & Labeling Service' });
});

// Global error handler
app.use((error: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', error);
  
  if (error.message.includes('File too large')) {
    res.status(400).json({ error: 'File size exceeds 10MB limit' });
  } else if (error.message.includes('Only JPEG and PNG')) {
    res.status(400).json({ error: error.message });
  } else {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Image Caption & Labeling Service running on port ${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/health`);
  console.log(`📤 Upload endpoint: POST http://localhost:${PORT}/api/images`);
});

export default app;