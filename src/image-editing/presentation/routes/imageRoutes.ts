import { Router } from "express";
import multer from "multer";
import { ImageController } from "../controllers/ImageController";

const SUPPORTED_MIME_TYPES = ["image/jpeg", "image/png"] as const;

// Configure multer for multipart/form-data handling
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB limit
  },
  fileFilter: (req, file, cb) => {
    if (SUPPORTED_MIME_TYPES.includes(file.mimetype as any)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPEG and PNG images are allowed"));
    }
  },
});

export function createImageRoutes(imageController: ImageController): Router {
  const router = Router();

  // POST /api/images - Upload new image with caption and labels
  router.post("/", upload.single("image"), imageController.uploadImage);

  // GET /api/images/:id - Get specific image by ID
  router.get("/:id", imageController.getImage);

  // DELETE /api/images/:id - Delete specific image
  router.delete("/:id", imageController.deleteImage);

  return router;
}
