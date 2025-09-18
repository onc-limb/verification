/**
 * 画像ID値オブジェクト
 * 画像を一意に識別するためのIDを管理する
 */
export class ImageId {
  private readonly _value: string;

  constructor(value?: string) {
    if (value) {
      this.validateId(value);
      this._value = value;
    } else {
      this._value = this.generateUuid();
    }
  }

  /**
   * 新しい画像IDを生成する
   */
  static generate(): ImageId {
    return new ImageId();
  }

  /**
   * 既存のIDから画像IDオブジェクトを作成する
   */
  static fromString(value: string): ImageId {
    return new ImageId(value);
  }

  /**
   * IDの値を取得する
   */
  get value(): string {
    return this._value;
  }

  /**
   * 他の画像IDと等しいかどうかを判定する
   */
  equals(other: ImageId): boolean {
    return this._value === other._value;
  }

  /**
   * 文字列表現を取得する
   */
  toString(): string {
    return this._value;
  }

  /**
   * UUID v4を生成する（外部ライブラリを使わない実装）
   */
  private generateUuid(): string {
    const chars = "0123456789abcdef";
    const uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return chars[v];
      }
    );
    return uuid;
  }

  /**
   * IDの形式をバリデーションする
   */
  private validateId(value: string): void {
    if (!value || typeof value !== "string") {
      throw new Error("ImageId must be a non-empty string");
    }

    // UUID形式のバリデーション
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(value)) {
      throw new Error("ImageId must be a valid UUID format");
    }
  }
}
