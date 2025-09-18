# Image Caption & Labeling Service

A TypeScript Express.js service that implements image captioning and labeling functionality using Clean Architecture principles.

## Features

- 📸 Upload images (JPEG/PNG) up to 10MB
- 🏷️ Add captions and labels to images
- 💾 Store metadata in JSON format (extensible to database)
- 🏗️ Clean Architecture implementation
- ✅ Domain-driven design with business rules validation
- 🧪 Unit tests for domain logic

## Quick Start

### Prerequisites

- Node.js 16+ 
- npm

### Installation & Setup

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Start development server
npm run dev

# Run tests
npm test
```

The server will start on `http://localhost:3000`

## API Endpoints

### Upload Image

```http
POST /api/images
Content-Type: multipart/form-data

Form fields:
- image: File (required) - Image file (JPEG/PNG, max 10MB)  
- caption: string (required) - Description of the image
- labels: JSON array (required) - Array of tag strings
```

**Example:**

```bash
curl -X POST \
  -F "image=@photo.jpg" \
  -F "caption=Beautiful sunset over the mountains" \
  -F 'labels=["landscape", "sunset", "mountains"]' \
  http://localhost:3000/api/images
```

**Response:**

```json
{
  "id": "uuid",
  "filename": "photo.jpg", 
  "caption": "Beautiful sunset over the mountains",
  "labels": ["landscape", "sunset", "mountains"],
  "uploadedAt": "2025-09-18T10:00:00.000Z",
  "fileSize": 2048576,
  "mimeType": "image/jpeg"
}
```

### Get All Images

```http
GET /api/images
```

Returns array of all uploaded images with metadata.

### Get Specific Image

```http
GET /api/images/{id}
```

Returns specific image metadata by ID.

### Delete Image

```http
DELETE /api/images/{id}
```

Deletes image and its associated file.

### Health Check

```http
GET /health
```

Returns service status.

## Architecture

This project follows Clean Architecture principles with clear separation of concerns:

```
src/
├── shared/              # Cross-cutting concerns
├── image-editing/       # Image context
    ├── presentation/    # HTTP controllers, routes 
    ├── usecase/        # Business logic, services
    ├── domain/         # Core entities, business rules
    ├── infra/          # External dependencies (file system, JSON storage)
    └── test/           # Unit, integration, E2E tests
```

### Layer Responsibilities

- **Domain**: Core business entities and rules (Image, ImageMetadata)
- **UseCase**: Application services and business workflows (ImageService)
- **Infrastructure**: External concerns (file storage, JSON persistence)  
- **Presentation**: HTTP interface (controllers, routing, validation)

### Dependency Rules

- Inner layers don't depend on outer layers
- Dependencies flow: `presentation → usecase → domain ← infra`
- Domain layer is isolated and contains business logic

## Data Storage

Currently uses JSON file storage (`images.json`) for metadata and local file system for binary images. The design allows easy migration to databases later.

**JSON Structure:**

```json
{
  "images": [{
    "id": "uuid",
    "filename": "original_name.jpg",
    "filePath": "uploads/uuid.jpg", 
    "caption": "Image description",
    "labels": ["tag1", "tag2"],
    "uploadedAt": "ISO datetime",
    "fileSize": 123456,
    "mimeType": "image/jpeg",
    "metadata": {
      "width": 1920,
      "height": 1080
    }
  }]
}
```

## Business Rules

The domain enforces these business rules:

- Only JPEG and PNG images accepted
- Maximum file size: 10MB  
- Caption cannot be empty
- At least one label required
- Image dimensions must be positive numbers
- Automatic filtering of empty/whitespace labels

## Testing

Run the test suite:

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

## Project Structure Details

Key files:

- `src/index.ts` - Application entry point and Express setup
- `src/image-editing/domain/models/Image.ts` - Core Image entity
- `src/image-editing/usecase/services/ImageService.ts` - Business logic
- `src/image-editing/presentation/controllers/ImageController.ts` - HTTP handling
- `src/image-editing/infra/repositories/JsonImageRepository.ts` - Data persistence

## Contributing

This codebase follows Clean Architecture principles. When adding features:

1. Start with domain models and business rules
2. Implement use cases for business workflows  
3. Add infrastructure adapters for external concerns
4. Finally add presentation layer for interfaces
5. Maintain the dependency rule: inner layers don't depend on outer layers