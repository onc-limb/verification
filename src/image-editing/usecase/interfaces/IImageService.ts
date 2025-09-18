import { Image } from '../../domain/models/Image';
import { CreateImageRequest, ImageResponse } from '../../../shared/types';

export interface IImageService {
  uploadImage(request: CreateImageRequest): Promise<ImageResponse>;
  getImage(id: string): Promise<ImageResponse | null>;
  getAllImages(): Promise<ImageResponse[]>;
  deleteImage(id: string): Promise<boolean>;
}