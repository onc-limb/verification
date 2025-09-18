import { Image } from '../models/Image';

export interface IImageRepository {
  save(image: Image): Promise<void>;
  findById(id: string): Promise<Image | null>;
  findAll(): Promise<Image[]>;
  deleteById(id: string): Promise<boolean>;
}