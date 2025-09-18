import { ImageId } from "./image-id.vo";
import { ImageExtension } from "./image-extension.vo";
import { ImageDataType } from "./image-data-type.vo";
import { ImageData } from "./image-data.vo";

/**
 * 画像集約エンティティ
 * 画像に関する全ての情報を統合して管理する
 */
export class ImageEntity {
  private readonly _id: ImageId;
  private readonly _data: ImageData;
  private readonly _extension: ImageExtension;
  private readonly _dataType: ImageDataType;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  constructor(
    id: ImageId,
    data: ImageData,
    extension: ImageExtension,
    dataType: ImageDataType,
    createdAt?: Date
  ) {
    this.validateConsistency(extension, dataType);

    this._id = id;
    this._data = data;
    this._extension = extension;
    this._dataType = dataType;
    this._createdAt = createdAt || new Date();
    this._updatedAt = new Date();
  }

  /**
   * 新しい画像エンティティを作成する
   */
  static create(
    data: ImageData,
    extension: ImageExtension,
    dataType: ImageDataType
  ): ImageEntity {
    const id = ImageId.generate();
    return new ImageEntity(id, data, extension, dataType);
  }

  /**
   * ファイル名とデータから画像エンティティを作成する
   */
  static createFromFile(fileName: string, data: ImageData): ImageEntity {
    const extension = ImageExtension.fromFileName(fileName);
    const dataType = ImageDataType.fromExtension(extension.value);
    return ImageEntity.create(data, extension, dataType);
  }

  /**
   * 既存のデータから画像エンティティを復元する
   */
  static reconstruct(
    id: string,
    data: ImageData,
    extension: string,
    dataType: string,
    createdAt: Date,
    updatedAt: Date
  ): ImageEntity {
    const imageId = ImageId.fromString(id);
    const imageExtension = ImageExtension.fromString(extension);
    const imageDataType = ImageDataType.fromMimeType(dataType);

    const entity = new ImageEntity(
      imageId,
      data,
      imageExtension,
      imageDataType,
      createdAt
    );
    entity._updatedAt = updatedAt;
    return entity;
  }

  /**
   * 画像IDを取得する
   */
  get id(): ImageId {
    return this._id;
  }

  /**
   * 画像データを取得する
   */
  get data(): ImageData {
    return this._data;
  }

  /**
   * 拡張子を取得する
   */
  get extension(): ImageExtension {
    return this._extension;
  }

  /**
   * データ型を取得する
   */
  get dataType(): ImageDataType {
    return this._dataType;
  }

  /**
   * 作成日時を取得する
   */
  get createdAt(): Date {
    return this._createdAt;
  }

  /**
   * 更新日時を取得する
   */
  get updatedAt(): Date {
    return this._updatedAt;
  }

  /**
   * ファイル名を生成する
   */
  generateFileName(): string {
    return `${this._id.value}${this._extension.toStringWithDot()}`;
  }

  /**
   * 画像のサイズ（バイト数）を取得する
   */
  getSize(): number {
    return this._data.getSize();
  }

  /**
   * 画像が空かどうかを判定する
   */
  isEmpty(): boolean {
    return this._data.isEmpty();
  }

  /**
   * サイズ制限をチェックする
   */
  validateSize(maxSizeInBytes: number = 10 * 1024 * 1024): boolean {
    return this._data.validateSize(maxSizeInBytes);
  }

  /**
   * 画像の基本情報を取得する
   */
  getInfo(): {
    id: string;
    extension: string;
    dataType: string;
    size: number;
    fileName: string;
    createdAt: Date;
    updatedAt: Date;
  } {
    return {
      id: this._id.value,
      extension: this._extension.value,
      dataType: this._dataType.value,
      size: this.getSize(),
      fileName: this.generateFileName(),
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }

  /**
   * 他の画像エンティティと等しいかどうかを判定する
   */
  equals(other: ImageEntity): boolean {
    return this._id.equals(other._id);
  }

  /**
   * エンティティの整合性を更新する（内部で使用）
   */
  protected touch(): void {
    this._updatedAt = new Date();
  }

  /**
   * 拡張子とデータ型の整合性をバリデーションする
   */
  private validateConsistency(
    extension: ImageExtension,
    dataType: ImageDataType
  ): void {
    try {
      const expectedDataType = ImageDataType.fromExtension(extension.value);
      if (!expectedDataType.equals(dataType)) {
        throw new Error(
          `拡張子 ${extension.value} とMIMEタイプ ${dataType.value} が一致しません`
        );
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new Error(
        `拡張子とMIMEタイプの整合性チェックに失敗しました: ${errorMessage}`
      );
    }
  }
}
