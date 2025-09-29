/**
 * 画像データ値オブジェクト
 * 実際の画像データ（Base64またはBuffer）を管理する
 */
export class ImageData {
  private readonly _data: string | Buffer;
  private readonly _format: "base64" | "buffer";

  constructor(data: string | Buffer) {
    this.validateData(data);
    this._data = data;
    this._format = typeof data === "string" ? "base64" : "buffer";
  }

  /**
   * Base64文字列から画像データオブジェクトを作成する
   */
  static fromBase64(base64Data: string): ImageData {
    return new ImageData(base64Data);
  }

  /**
   * Bufferから画像データオブジェクトを作成する
   */
  static fromBuffer(buffer: Buffer): ImageData {
    return new ImageData(buffer);
  }

  /**
   * ファイルパスから画像データオブジェクトを作成する（非同期）
   * 注意: この実装はinfra層で行うべきですが、参考として記載
   */
  static async fromFilePath(filePath: string): Promise<ImageData> {
    // 実際の実装はinfra層のFileSystemRepositoryなどで行う
    throw new Error("fromFilePathはinfra層で実装してください");
  }

  /**
   * データの形式を取得する
   */
  get format(): "base64" | "buffer" {
    return this._format;
  }

  /**
   * 生データを取得する
   */
  get rawData(): string | Buffer {
    return this._data;
  }

  /**
   * Base64形式でデータを取得する
   */
  toBase64(): string {
    if (this._format === "base64") {
      return this._data as string;
    } else {
      return (this._data as Buffer).toString("base64");
    }
  }

  /**
   * Buffer形式でデータを取得する
   */
  toBuffer(): Buffer {
    if (this._format === "buffer") {
      return this._data as Buffer;
    } else {
      return Buffer.from(this._data as string, "base64");
    }
  }

  /**
   * データのサイズ（バイト数）を取得する
   */
  getSize(): number {
    if (this._format === "buffer") {
      return (this._data as Buffer).length;
    } else {
      // Base64の場合、実際のサイズを計算
      const base64 = this._data as string;
      const padding = (base64.match(/=/g) || []).length;
      return Math.floor((base64.length * 3) / 4) - padding;
    }
  }

  /**
   * データが空かどうかを判定する
   */
  isEmpty(): boolean {
    if (this._format === "buffer") {
      return (this._data as Buffer).length === 0;
    } else {
      return (this._data as string).length === 0;
    }
  }

  /**
   * 他の画像データと等しいかどうかを判定する
   */
  equals(other: ImageData): boolean {
    if (this._format !== other._format) {
      // 形式が違う場合はBase64で比較
      return this.toBase64() === other.toBase64();
    }

    if (this._format === "buffer") {
      return Buffer.compare(this._data as Buffer, other._data as Buffer) === 0;
    } else {
      return this._data === other._data;
    }
  }

  /**
   * データサイズの制限チェック（例: 10MB制限）
   */
  validateSize(maxSizeInBytes: number = 10 * 1024 * 1024): boolean {
    return this.getSize() <= maxSizeInBytes;
  }

  /**
   * データの有効性をバリデーションする
   */
  private validateData(data: string | Buffer): void {
    if (!data) {
      throw new Error("画像データは空であってはいけません");
    }

    if (typeof data === "string") {
      // Base64形式のバリデーション
      if (data.length === 0) {
        throw new Error("Base64データは空であってはいけません");
      }

      // Base64の基本的な形式チェック
      const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
      if (!base64Regex.test(data)) {
        throw new Error("無効なBase64形式です");
      }
    } else if (Buffer.isBuffer(data)) {
      // Bufferのバリデーション
      if (data.length === 0) {
        throw new Error("Bufferデータは空であってはいけません");
      }
    } else {
      throw new Error(
        "画像データはstring（Base64）またはBufferである必要があります"
      );
    }
  }
}
