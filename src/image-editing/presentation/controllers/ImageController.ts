import type { Request, Response } from "express";
const fs = require("fs").promises;
const path = require("path");

export class ImageController {
  constructor() {}

  uploadImage = async (req: Request, res: Response): Promise<void> => {
    try {
      // Validate multipart data
      if (!req.file) {
        res.status(400).json({ error: "No image file provided" });
        return;
      }

      const { caption, labels } = req.body;

      // Validate required fields
      if (!caption || typeof caption !== "string") {
        res
          .status(400)
          .json({ error: "Caption is required and must be a string" });
        return;
      }

      // Parse labels (can be sent as JSON string or array)
      let parsedLabels: string[];
      try {
        if (typeof labels === "string") {
          parsedLabels = JSON.parse(labels);
        } else if (Array.isArray(labels)) {
          parsedLabels = labels;
        } else {
          throw new Error("Labels must be an array or JSON string");
        }
      } catch (error) {
        res
          .status(400)
          .json({ error: "Invalid labels format. Expected array of strings." });
        return;
      }

      // Create request object
      const createRequest = {
        image: {
          fieldname: req.file.fieldname,
          originalname: req.file.originalname,
          encoding: req.file.encoding,
          mimetype: req.file.mimetype,
          buffer: req.file.buffer,
          size: req.file.size,
        },
        caption,
        labels: parsedLabels,
      };

      // Process upload
      // Save to image.json file

      const imageData = {
        id: Date.now().toString(),
        ...createRequest,
        uploadedAt: new Date().toISOString(),
      };

      const jsonFilePath = path.join(__dirname, "../../../image.json");

      try {
        // Read existing data
        let existingData = [];
        try {
          const fileContent = await fs.readFile(jsonFilePath, "utf8");
          existingData = JSON.parse(fileContent);
        } catch (error) {
          // File doesn't exist or is empty, start with empty array
        }

        // Add new image data
        existingData.push(imageData);

        // Write back to file
        await fs.writeFile(jsonFilePath, JSON.stringify(existingData, null, 2));

        const result = { success: true, id: imageData.id };
        res.status(201).json(result);
      } catch (fileError) {
        throw new Error(`Failed to save to image.json: ${fileError}`);
      }
    } catch (error) {
      console.error("Error uploading image:", error);

      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  };

  getImage = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({ error: "Image ID is required" });
        return;
      }

      // Read from image.json file
      const jsonFilePath = path.join(__dirname, "../../../image.json");

      let existingData = [];
      try {
        const fileContent = await fs.readFile(jsonFilePath, "utf8");
        existingData = JSON.parse(fileContent);
      } catch (error) {
        // File doesn't exist or is empty
        res.status(404).json({ error: "Image not found" });
        return;
      }

      const image = existingData.find((img: any) => img.id === id);

      if (!image) {
        res.status(404).json({ error: "Image not found" });
        return;
      }

      res.json(image);
    } catch (error) {
      console.error("Error getting image:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  deleteImage = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({ error: "Image ID is required" });
        return;
      }

      // Read from image.json file
      const jsonFilePath = path.join(__dirname, "../../../image.json");

      let existingData = [];
      try {
        const fileContent = await fs.readFile(jsonFilePath, "utf8");
        existingData = JSON.parse(fileContent);
      } catch (error) {
        // File doesn't exist or is empty
        res.status(404).json({ error: "Image not found" });
        return;
      }

      // Find and remove the image
      const imageIndex = existingData.findIndex((img: any) => img.id === id);
      let deleted = false;

      if (imageIndex !== -1) {
        existingData.splice(imageIndex, 1);
        deleted = true;

        // Write back to file
        await fs.writeFile(jsonFilePath, JSON.stringify(existingData, null, 2));
      }

      if (!deleted) {
        res.status(404).json({ error: "Image not found" });
        return;
      }

      res.status(204).send();
    } catch (error) {
      console.error("Error deleting image:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
}
