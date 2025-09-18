export interface UploadedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}

export interface CreateImageRequest {
  image: UploadedFile;
  caption: string;
  labels: string[];
}

export interface ImageResponse {
  id: string;
  filename: string;
  caption: string;
  labels: string[];
  uploadedAt: string;
  fileSize: number;
  mimeType: string;
}