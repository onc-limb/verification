# 画像キャプション・ラベリング機能の実装

## 概要

TypeScript + Express.js を使用して、画像をバイナリで受け取り、キャプションとラベルを付与してデータベースに保存する機能を実装する。

## 使用技術

- **言語**: TypeScript
- **フレームワーク**: Express.js
- **アーキテクチャ**: クリーンアーキテクチャ
- **データストレージ**: JSON 形式（暫定）

## 機能要件

### 1. 画像アップロード機能

- [ ] 画像ファイルをバイナリ形式で受信
- [ ] サポートする画像形式: JPEG, PNG
- [ ] ファイルサイズ制限: 10MB

### 2. 画像メタデータ管理

- [ ] 画像に対するキャプション（説明文）の付与
- [ ] 画像に対するラベル（タグ）の付与
- [ ] ドメイン知識としてのメタデータ管理

### 3. データ永続化

- [ ] `image.json` ファイルへの保存（暫定実装）
- [ ] 画像バイナリデータと メタデータの関連付け

## 技術仕様

### API エンドポイント

```
POST /api/images
Content-Type: multipart/form-data

Request Body:
- image: File (画像ファイル)
- caption: string (キャプション)
- labels: string[] (ラベル配列)

Response:
{
  "id": "string",
  "filename": "string",
  "caption": "string",
  "labels": ["string"],
  "uploadedAt": "ISO 8601 datetime",
  "fileSize": number,
  "mimeType": "string"
}
```

### データ構造（image.json）

```json
{
  "images": [
    {
      "id": "uuid",
      "filename": "original_filename.jpg",
      "filePath": "path/to/stored/image",
      "caption": "画像の説明文",
      "labels": ["ラベル1", "ラベル2"],
      "uploadedAt": "2025-09-18T10:00:00.000Z",
      "fileSize": 1024000,
      "mimeType": "image/jpeg",
      "metadata": {
        "width": 1920,
        "height": 1080
      }
    }
  ]
}
```

## アーキテクチャ設計

### ディレクトリ構成

```
src/
├── shared/
│   ├── utils/
│   ├── types/
│   └── constants/
└── image-editing/
    ├── presentation/
    │   ├── controllers/
    │   │   └── ImageController.ts
    │   └── routes/
    │       └── imageRoutes.ts
    ├── usecase/
    │   ├── services/
    │   │   └── ImageService.ts
    │   └── interfaces/
    │       ├── IImageRepository.ts
    │       └── IImageService.ts
    ├── domain/
    │   ├── models/
    │   │   ├── Image.ts
    │   │   └── ImageMetadata.ts
    │   └── repositories/
    │       └── IImageRepository.ts
    ├── infra/
    │   ├── repositories/
    │   │   └── JsonImageRepository.ts
    │   └── storage/
    │       └── FileStorage.ts
    └── test/
        ├── unit/
        ├── integration/
        └── e2e/
```

### レイヤー責務

- **Presentation 層**: HTTP リクエストの処理、バリデーション
- **UseCase 層**: 画像処理ビジネスロジック、ファイル保存の制御
- **Domain 層**: 画像エンティティ、ビジネスルール
- **Infrastructure 層**: JSON ファイル操作、ファイルシステムアクセス

## 実装タスク

### Phase 1: 基盤実装

- [ ] プロジェクト構成のセットアップ
- [ ] TypeScript + Express.js の環境構築
- [ ] クリーンアーキテクチャに基づくディレクトリ構造作成

### Phase 2: ドメイン層実装

- [ ] `Image` エンティティの作成
- [ ] `ImageMetadata` 値オブジェクトの作成
- [ ] `IImageRepository` インターフェースの定義

### Phase 3: Infrastructure 層実装

- [ ] `JsonImageRepository` の実装
- [ ] ファイルストレージの実装
- [ ] 画像ファイルのバイナリ保存機能

### Phase 4: UseCase 層実装

- [ ] `ImageService` の実装
- [ ] 画像アップロード処理の実装
- [ ] メタデータ管理ロジックの実装

### Phase 5: Presentation 層実装

- [ ] `ImageController` の実装
- [ ] Express.js ルーティングの設定
- [ ] multipart/form-data のハンドリング

### Phase 6: テスト実装

- [ ] 単体テストの作成
- [ ] 統合テストの作成
- [ ] E2E テストの作成

## 受け入れ条件

- [ ] 画像ファイルをアップロードできる
- [ ] キャプションとラベルを設定できる
- [ ] `image.json` に正しくデータが保存される
- [ ] エラーハンドリングが適切に実装されている
- [ ] クリーンアーキテクチャの原則に従っている
- [ ] テストカバレッジ 80% 以上

## 注意事項

- 依存関係の方向: presentation → usecase → domain ← infra
- ドメイン層は他の層に依存してはならない
- 将来的には JSON ファイルからデータベースへの移行を予定

## 関連ドキュメント

- [コーディングルール](../AGENTS.md)
- クリーンアーキテクチャガイドライン
