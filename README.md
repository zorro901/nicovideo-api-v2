# ニコニコ動画スナップショット検索API v2

このライブラリは、ニコニコ動画のスナップショット検索API v2を簡単に利用できるように設計されています。  
CJS、EJSに対応しており、TypeScriptでも利用可能です。外部依存関係はありません。

## 特徴

- CJS, EJS, TypeScript 対応
- 外部依存関係なし
- 高度な検索機能のサポート

## インストール

```bash
npm install nicovideo-api-v2
```

## 使い方

### TypeScript / JavaScript (ESM)

```typescript
import { createClient } from 'nicovideo-api-v2';

const nicovideo = createClient();

const result = await nicovideo.searchVideos({
  q: 'ドーナツホール',
  targets: { title: true },
  limit: 3,
  sort: { likeCounter: 'desc' },
  fields: {
    contentId: true, title: true, description: true, userId: true,
    channelId: true, viewCounter: true, mylistCounter: true,
    likeCounter: true, lengthSeconds: true, thumbnailUrl: true,
    startTime: true, lastResBody: true, commentCounter: true,
    lastCommentTime: true, categoryTags: true, tags: true, genre: true,
  },
  jsonFilter: {
    type: 'and',
    filters: [
      { type: 'equal', field: 'tags', value: 'VOCALOID殿堂入り' },
      { type: 'equal', field: 'tags', value: 'ハチ' },
      { type: 'range', field: 'startTime', from: '2020-07-07T00:00:00+09:00', to: '2024-10-01T00:00:00+09:00', include_lower: true },
    ],
  },
  filters: {
    likeCounter: { min: 24700, max: 25000 },
    startTime: { from: '2021', to: '2025' },
  },
});

```

### JavaScript (CJS)

```javascript
const { createClient } = require('nicovideo-api-v2');

const nicovideo = createClient();

// 同様の検索関数を使用
```

## API

### `createClient()`

この関数はニコニコ動画APIクライアントを生成します。生成されたクライアントを使用して動画を検索できます。

### `searchVideos(params)`

動画を検索します。

- `params` (object): 検索条件を含むオブジェクト。このオブジェクトには`q`(検索クエリ), `targets`, `fields`, `sort`, `limit`, `jsonFilter`, `filters`などが含まれます。

## 貢献

バグ報告や機能リクエストはGitHubのissueを通じて提出してください。

## ライセンス

このプロジェクトはMITライセンスのもとで公開されています。
```

このテンプレートには、コードの使用例やライブラリの主要な特徴が記載されています。特に使い方のセクションで、提供されたコードスニペットを説明しています。プロジェクトの仕様に合わせて、必要な情報を追加、削除、または変更してください。