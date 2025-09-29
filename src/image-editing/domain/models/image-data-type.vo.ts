/**
 * 画像データ型値オブジェクト
 * 画像のMIMEタイプを管理し、有効性をバリデーションする
 */
export class ImageDataType {
  private readonly _value: string;

  // サポートする画像MIMEタイプ
  private static readonly SUPPORTED_MIME_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/bmp",
    "image/webp",
    "image/svg+xml",
    "image/tiff",
    "image/x-icon",
    "image/vnd.microsoft.icon",
  ] as const;

  // 拡張子とMIMEタイプのマッピング
  private static readonly EXTENSION_TO_MIME_MAP = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    bmp: "image/bmp",
    webp: "image/webp",
    svg: "image/svg+xml",
    tiff: "image/tiff",
    ico: "image/x-icon",
  } as const;

  constructor(value: string) {
    this.validateMimeType(value);
    this._value = value.toLowerCase();
  }

  /**
   * MIMEタイプから画像データ型オブジェクトを作成する
   */
  static fromMimeType(mimeType: string): ImageDataType {
    return new ImageDataType(mimeType);
  }

  /**
   * 拡張子から画像データ型オブジェクトを作成する
   */
  static fromExtension(extension: string): ImageDataType {
    const normalizedExt = extension.replace(/^\./, "").toLowerCase();
    const mimeType =
      ImageDataType.EXTENSION_TO_MIME_MAP[
        normalizedExt as keyof typeof ImageDataType.EXTENSION_TO_MIME_MAP
      ];

    if (!mimeType) {
      throw new Error(`サポートされていない拡張子です: ${extension}`);
    }

    return new ImageDataType(mimeType);
  }

  /**
   * MIMEタイプの値を取得する
   */
  get value(): string {
    return this._value;
  }

  /**
   * 対応する拡張子を取得する
   */
  getExtension(): string {
    const entry = Object.entries(ImageDataType.EXTENSION_TO_MIME_MAP).find(
      ([, mime]) => mime === this._value
    );

    if (!entry) {
      throw new Error(
        `MIMEタイプ ${this._value} に対応する拡張子が見つかりません`
      );
    }

    return entry[0];
  }

  /**
   * サポートされているMIMEタイプかどうかを判定する
   */
  isSupported(): boolean {
    return ImageDataType.SUPPORTED_MIME_TYPES.includes(this._value as any);
  }

  /**
   * 他の画像データ型と等しいかどうかを判定する
   */
  equals(other: ImageDataType): boolean {
    return this._value === other._value;
  }

  /**
   * 文字列表現を取得する
   */
  toString(): string {
    return this._value;
  }

  /**
   * MIMEタイプの形式をバリデーションする
   */
  private validateMimeType(value: string): void {
    if (!value || typeof value !== "string") {
      throw new Error("MIMEタイプは空でない文字列である必要があります");
    }

    const normalized = value.toLowerCase();

    // MIMEタイプの基本形式をチェック
    if (!normalized.startsWith("image/")) {
      throw new Error('画像のMIMEタイプは "image/" で始まる必要があります');
    }

    if (!ImageDataType.SUPPORTED_MIME_TYPES.includes(normalized as any)) {
      throw new Error(`サポートされていないMIMEタイプです: ${normalized}`);
    }
  }
}
