/**
 * 画像拡張子値オブジェクト
 * 画像ファイルの拡張子を管理し、有効性をバリデーションする
 */
export class ImageExtension {
  private readonly _value: string;

  // サポートする画像拡張子
  private static readonly SUPPORTED_EXTENSIONS = [
    "jpg",
    "jpeg",
    "png",
    "gif",
    "bmp",
    "webp",
    "svg",
    "tiff",
    "ico",
  ] as const;

  constructor(value: string) {
    this.validateExtension(value);
    this._value = value.toLowerCase();
  }

  /**
   * 拡張子から画像拡張子オブジェクトを作成する
   */
  static fromString(value: string): ImageExtension {
    return new ImageExtension(value);
  }

  /**
   * ファイル名から拡張子を抽出して画像拡張子オブジェクトを作成する
   */
  static fromFileName(fileName: string): ImageExtension {
    const extension = fileName.split(".").pop();
    if (!extension) {
      throw new Error("ファイル名から拡張子を抽出できませんでした");
    }
    return new ImageExtension(extension);
  }

  /**
   * 拡張子の値を取得する
   */
  get value(): string {
    return this._value;
  }

  /**
   * サポートされている拡張子かどうかを判定する
   */
  isSupported(): boolean {
    return ImageExtension.SUPPORTED_EXTENSIONS.includes(this._value as any);
  }

  /**
   * 他の画像拡張子と等しいかどうかを判定する
   */
  equals(other: ImageExtension): boolean {
    return this._value === other._value;
  }

  /**
   * 文字列表現を取得する
   */
  toString(): string {
    return this._value;
  }

  /**
   * ドット付きの拡張子を取得する
   */
  toStringWithDot(): string {
    return `.${this._value}`;
  }

  /**
   * 拡張子の形式をバリデーションする
   */
  private validateExtension(value: string): void {
    if (!value || typeof value !== "string") {
      throw new Error("拡張子は空でない文字列である必要があります");
    }

    // ドットを除去して正規化
    const normalized = value.replace(/^\./, "").toLowerCase();

    if (normalized.length === 0) {
      throw new Error("拡張子は空でない文字列である必要があります");
    }

    // 英数字のみを許可
    if (!/^[a-z0-9]+$/i.test(normalized)) {
      throw new Error("拡張子は英数字のみを含む必要があります");
    }

    if (!ImageExtension.SUPPORTED_EXTENSIONS.includes(normalized as any)) {
      throw new Error(`サポートされていない拡張子です: ${normalized}`);
    }
  }
}
