# ニコニコ動画スナップショット検索API v2

このライブラリは、ニコニコ動画のスナップショット検索API v2を簡単に利用できるように設計されています。  
ESM、CJSに対応しており、TypeScriptでも利用可能です。外部依存関係はありません。

## 特徴

- キーワードから動画情報を検索
- 動画IDからコメント取得
- ESM、CJS、TypeScript 対応
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

// ブラウザで使う場合はCORSサーバーを設定してください
const client = createClient({
  proxyUrl: '<YOUR CORS PROXY URL>',
});

const result = await client.searchVideos({
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
    likeCounter: { min: 24700, max: 99999 },
    startTime: { from: '2021', to: '2025' },
  },
});
```

### JavaScript (CJS)

```javascript
const { createClient } = require('nicovideo-api-v2');

const client = createClient();

// 同様の検索関数を使用
```


### レスポンス例
```json5
// searchVideos
{
  meta: {
    status: 200,
    id: '061ab1eb-930a-4b75-a018-abf3ebc37257',
    totalCount: 1
  },
  data: [
    {
      categoryTags: '音楽',
      channelId: null,
      commentCounter: 14651,
      contentId: 'sm44158937',
      description: 'どうもハチです。<br>久しぶりに作りました。少年漫画っぽいのを目指しました。<br><br>HP →　http://reissuerecords.net/<br>x　→　https://twitter.com/hachi_08<br>マイリスト　→　mylist/12682175',
      genre: '音楽・サウンド',
      lastCommentTime: '2024-11-23T01:24:10+09:00',
      lastResBody: '🍩🍩🍩🍩🍩🍩🍩🍩🍩🍩🍩🍩🍩🍩🍩🍩🍩 🍩🍩🍩🍩🍩🍩🍩🍩🍩🍩🍩🍩🍩🍩🍩🍩🍩🍩🍩🍩🍩🍩🍩🍩🍩🍩🍩🍩🍩🍩🍩🍩🍩 🍩🍩🍩🍩🍩🍩🍩🍩🍩🍩🍩🍩 🍩🍩🍩🍩🍩🍩🍩🍩🍩🍩🍩🍩🍩🍩🍩🍩🍩🍩🍩🍩🍩🍩🍩🍩🍩🍩🍩🍩🍩🍩🍩🍩🍩🍩🍩🍩🍩🍩🍩🍩🍩🍩 🍩🍩🍩🍩 8888888888888...',
      lengthSeconds: 228,
      likeCounter: 26011,
      mylistCounter: 4817,
      startTime: '2024-09-30T10:00:00+09:00',
      tags: '王の帰還 ドーナツホール VOCALOID-PV ハチ VOCALOID ドーナツホール2024 GUMIオリジナル曲 VOCALOID殿堂入り GUMI 伝説のgumiマスター Production_I.G',
      thumbnailUrl: 'https://nicovideo.cdn.nimg.jp/thumbnails/44158937/44158937.69156853',
      title: 'ハチ MV 「ドーナツホール 2024」',
      userId: 380847,
      viewCounter: 814550
    }
  ]
}
```
```json5
// getComments
{
  meta: { status: 200 },
  data: {
    globalComments: [ { id: '1727655904', count: 14694 } ],
    threads: [
      {
        id: '1727655904',
        fork: 'owner',
        commentCount: 0,
        comments: []
      },
      {
        id: '1727655904',
        fork: 'main',
        commentCount: 13170,
        comments: [
          {
            id: '1302078544327573504',
            no: 1500,
            vposMs: 12560,
            body: 'かっこいい',
            commands: [ '184' ],
            userId: 'nvc:QUpBfc_1o_6cEIzdSMWwagUqssQ',
            isPremium: false,
            score: 0,
            postedAt: '2024-11-02T10:15:16+09:00',
            nicoruCount: 0,
            nicoruId: null,
            source: 'trunk',
            isMyPost: false
          },
        ]
      },
      {
        id: '1727655904',
        fork: 'easy',
        commentCount: 1524,
        comments: []
      }
    ]
  }
}
```

## API

### `createClient()`

この関数はニコニコ動画APIクライアントを生成します。生成されたクライアントを使用して動画を検索できます。

#### proxyUrl
ブラウザで使用する場合のCORS回避を行うためのプロパティです。

### `searchVideos(params)`

動画を検索します。

- `params` (object): 検索条件を含むオブジェクト。このオブジェクトには`q`(検索クエリ), `targets`, `fields`, `sort`, `limit`, `jsonFilter`, `filters`などが含まれます。

- パラメーターの詳細はこちら
  - src/docs/api-docs.md

## 貢献

バグ報告や機能リクエストはGitHubのissueを通じて提出してください。

## ライセンス

このプロジェクトはMITライセンスのもとで公開されています。
