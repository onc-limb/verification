## 原則

このルールを適用している場合、対応は必ず日本語で行うこと。
このルールを適用している場合、「AGENTS.md を参照しています」と最初に記載すること。

## コーディングルール

### 依存関係の原則

- クリーンアーキテクチャに従った依存関係を保つ
- 内側の層（domain）は外側の層（infra, usecase）に依存してはならない
- 依存関係の方向: presentation → usecase → domain ← infra
- infra は domain の interface を実装する形で依存性逆転の原則を適用

### レイヤー別責務

- **presentation**: UI 層、コントローラー、ビューモデル
- **usecase**: ビジネスロジック、アプリケーションサービス
- **domain**: ドメインモデル、ビジネスルール、リポジトリインター face
- **infra**: 外部依存、データベース、API 通信、リポジトリ実装

### テスト戦略

- 各コンテキストの test ディレクトリにテストを配置
- 単体テスト、統合テスト、E2E テストを適切に分離
- ドメインロジックの高いテストカバレッジを維持

## ディレクトリ構成

```
src/
├── shared/                    # コンテキスト横断で使用するツール・ユーティリティ
│   ├── utils/
│   ├── types/
│   └── constants/
├── image-editing/             # 画像編集コンテキスト
│   ├── presentation/          # UI層、コントローラー
│   │   ├── controllers/
│   │   ├── views/
│   │   └── viewmodels/
│   ├── usecase/              # ビジネスロジック
│   │   ├── services/
│   │   └── interfaces/
│   ├── domain/               # ドメインモデル、ビジネスルール
│   │   ├── models/
│   │   ├── repositories/
│   │   └── services/
│   ├── infra/                # 外部依存、データアクセス
│   │   ├── repositories/
│   │   ├── external/
│   │   └── config/
│   └── test/                 # テストコード
│       ├── unit/
│       ├── integration/
│       └── e2e/
└── record-post/              # 記録投稿コンテキスト
    ├── presentation/         # UI層、コントローラー
    │   ├── controllers/
    │   ├── views/
    │   └── viewmodels/
    ├── usecase/             # ビジネスロジック
    │   ├── services/
    │   └── interfaces/
    ├── domain/              # ドメインモデル、ビジネスルール
    │   ├── models/
    │   ├── repositories/
    │   └── services/
    ├── infra/               # 外部依存、データアクセス
    │   ├── repositories/
    │   ├── external/
    │   └── config/
    └── test/                # テストコード
        ├── unit/
        ├── integration/
        └── e2e/
```
