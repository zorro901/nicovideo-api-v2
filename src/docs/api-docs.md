# ニコニコ動画 『スナップショット検索API v2』 ガイド

ニコニコ動画のコンテンツを解析する目的で検索/取得する際に利用できます。

## 告知

- FQDNがapi.search.nicovideo.jpからsnapshot.search.nicovideo.jpに変更になります
- 2024/3/1から変更先にアクセスできます。
- 2024/4/1から変更元のアクセスができなくなる予定です。

## はじめに

- キーワードやフィルタ条件を指定して、動画を検索できます。
- 当APIの検索結果は、毎日AM5:00に更新される動画検索インデックスから返されます。

### APIエンドポイント

- [https://snapshot.search.nicovideo.jp/api/v2/snapshot/video/contents/search](https://snapshot.search.nicovideo.jp/api/v2/snapshot/video/contents/search)

### ヘッダー

User-Agentにサービス名またはアプリケーション名を指定してください。

### クエリパラメータ

以下のパラメータを GET のクエリパラメータで与えます。

| パラメータ名 | 型 | 省略可能か | デフォルト値 | 例 | 説明 |
|--------------|----|------------|--------------|----|------|
| q | string | no | - | ゲーム | 検索キーワードです。 書式の詳細は＊1を参照してください。 |
| targets | string | no | - | title,description,tags | 検索対象のフィールド（複数可、カンマ区切り）です。キーワード検索の場合、title,description,tagsを指定してください。タグ検索（キーワードに完全一致するタグがあるコンテンツをヒット）の場合、tagsExactを指定してください。キーワード無し検索の場合は省略できます。 |
| fields | string | yes | - | contentId,title,description,tags | レスポンスに含みたいヒットしたコンテンツのフィールド（複数可、カンマ区切り）です。フィールド名は＊2を参照してください。 |
| filters | string | yes | - | - | 検索結果をフィルタの条件にマッチするコンテンツだけに絞ります。フィルタの書式には＊3を参照してください。空文字はnull扱いになります。 |
| jsonFilter | string | yes | - | - | OR や AND の入れ子など複雑なフィルター条件を使う場合のみに使用します。 OR / AND / NOT 単体で使用する場合は `filters` を使ってください。フィルタの書式には＊4を参照してください。 |
| _sort | string | no | - | -viewCounter | ソート順をソートの方向の記号とフィールド名を連結したもので指定します。ソートの方向は昇順または降順かを'+'か'-'で指定し、ない場合はデフォルトとして'-'となります。使用できるフィールドは＊2を参考にしてください。nullになっているコンテンツはソートの方向に関わらず最後になります。 |
| _offset | integer | yes | 0 | 10 | 返ってくるコンテンツの取得オフセット。最大:100,000 |
| _limit | integer | yes | 10 | 10 | 返ってくるコンテンツの最大数。最大:100 |
| _context | string | no | - | apiguide | サービスまたはアプリケーション名。最大:40文字 |

#### ＊1 クエリ文字列仕様

| 機能名 | 書式 | 例 | 説明 | 備考 |
|--------|------|----|------|------|
| AND検索 | 空白（半角）で区切る | ミク ボーカル | "ミク" かつ "ボーカル"を含むコンテンツ |  |
| OR検索 | ORで区切る | ミク OR ボーカル | "ミク"または"ボーカル"を含むコンテンツ | ORの前後には空白を入れてください。 |
| - | - | ミク OR ボーカル OR ヴォーカル | "ミク"または"ボーカル"または"ヴォーカル"を含むコンテンツ |  |
| AND・OR検索 | - | ボーカル OR 歌ってみた ミク | ("ボーカル" または"歌ってみた") でかつ "ミク" を含むコンテンツ | ANDとORを組み合わせる場合OR検索を先に書きます。 |
| フレーズ検索 | ダブルクオート" で囲む | "ミク ボーカル" | 空白を含む "ミク ボーカル" を含むコンテンツ | ダブルクオートで囲むことで空白や演算子も含めて検索できます。 |
| NOT検索 | 単語の前に-をつける | ミク -ボーカル | "ミク"を含んでボーカルを含まないコンテンツ。 |  |
| - | - | ミク - ボーカル | "ミク" かつ "-" かつ "ボーカル"を含むコンテンツ | - と単語の間に空白をいれないでください。 |
| - | - | -ボーカル | エラー | NOT検索だけ実行することはできません。 |
| キーワード無し検索 | 空文字を指定する | search?q=&fields=... | キーワードを使用せずに検索します。 | q=自体の省略はできません。負荷の高い検索となりますので、filtersと併用しヒット件数を10万件以内に絞り込んだ上でご利用ください。 |

#### ＊2 フィールド仕様

すべてのフィールドで値が入ってないなどの理由でnullが返ってくる場合があります。


| フィールド名 | 説明 | 型 | fieldsで取得可能か | _sortに指定可能か | filtersに指定可能か |
|---|---|---|---|---|---|
| contentId | コンテンツID。[https://nico.ms/](https://nico.ms/) の後に連結することでコンテンツへのURLになります。 | string | o | - | o |
| title | タイトル | string | o | - | - |
| description | コンテンツの説明文。 | string | o | - | - |
| userId | ユーザー投稿動画の場合、投稿者のユーザーID | integer | o | - | - |
| channelId | チャンネル動画の場合、チャンネルID | integer | o | - | - |
| viewCounter | 再生数 | integer | o | o | o |
| mylistCounter | マイリスト数またはお気に入り数。 | integer | o | o | o |
| likeCounter | いいね！数 | integer | o | o | o |
| lengthSeconds | 再生時間(秒) | integer | o | o | o |
| thumbnailUrl | サムネイルのURL | string | o | - | - |
| startTime | コンテンツの投稿時間。 | string (ISO8601形式) | o | o | o |
| lastResBody | 最新のコメント | string | o | - | - |
| commentCounter | コメント数 | integer | o | o | o |
| lastCommentTime | 最終コメント時間 | string (ISO8601形式) | o | o | o |
| categoryTags | カテゴリタグ | string | o | - | o |
| tags | タグ(空白区切り) | string | o | - | o |
| tagsExact | タグ完全一致(空白区切り) | string | - | - | o |
| genre | ジャンル | string | o | - | o |
| genre.keyword | ジャンル完全一致 | string | - | - | o |

#### ＊3 フィルタ指定仕様

フィールド field0 が val0 または val1 ... の値のいずれかに一致するコンテンツだけにフィルタリングする場合、以下のようにURLパラメータを指定します。

```
filters[field0][0]=val0&filters[field0][1]=val1
```

フィールド field1 が val0 〜 val1 の範囲（val0,val1含まず）に一致するコンテンツだけにフィルタリングする場合、以下のようにURLパラメータを指定します。

```
filters[field1][gt]=val0&filters[field1][lt]=val1
```

範囲の値も含めたい場合gteとlteを使用します。

フィルタにはinteger、またはstring(日付)のフィールドを利用できます。詳しくは＊2のフィールド仕様を参考にしてください。

例

- 再生数が100万のフィルタ

```
filters[viewCounter][0]=1000000
```

- マイリスト数が1000以上かつコメント数が1000以上のフィルタ

```
filters[mylistCounter][gte]=1000&filters[commentCounter][gte]=1000
```

- 2014年に投稿されたコンテンツでフィルタ（日時はISO 8601形式のうち、YYYY-MM-DDThh:mm:ss±hh:mmのフォーマットで指定してください）

```
filters[startTime][gte]=2014-01-01T00:00:00+09:00&filters[startTime][lt]=2015-01-01T00:00:00+09:00
```

- ジャンルがゲームのフィルタ

```
filters[genre][0]=ゲーム
```

#### ＊4 JSONフィルタ指定仕様

実際に使用する際はエンコードする必要があります。


|  | キー | 説明 |
|---|---|---|
| 共通 | type | `equal,range,or,and,not`のいずれか |
| type == equal | field | equal で対象にしたいフィールド |
|  | value | equal で対象にしたい値 |
| type == range | field | range で対象にしたいフィールド |
|  | from | 範囲の始点の値 |
|  | to | 範囲の終点の値 |
|  | include_lower | fromの値を範囲に含めるか |
|  | include_upper | toの値を範囲に含めるか |
| type == or | filters | JSONフィルターの配列 |
| type == and | filters | JSONフィルターの配列 |
| type == not | filter | JSONフィルター |

- 2016年と2017年で 7月7日に投稿されたコンテンツのみフィルタ（日時はISO 8601形式のうち、YYYY-MM-DDThh:mm:ss±hh:mmのフォーマットで指定してください）

```json
{
  "type": "or",
  "filters": [
    {
      "type": "range",
      "field": "startTime",
      "from": "2017-07-07T00:00:00+09:00",
      "to": "2017-07-08T00:00:00+09:00",
      "include_lower": true
    },
    {
      "type": "range",
      "field": "startTime",
      "from": "2016-07-07T00:00:00+09:00",
      "to": "2016-07-08T00:00:00+09:00",
      "include_lower": true
    }
  ]
}
```

#### ＊5 _offsetの上限を越えてデータを取得したい場合

システムの制限により、巨大な_offsetを指定することはできません。制限を越えた件数のデータが必要な場合は、filtersを使って範囲をずらしていくことで取得できます。

- filtersにstartTimeを使う場合

```
# 2019年1月分を取得
filters[startTime][gte]=2019-01-01T00:00:00+09:00&filters[startTime][lt]=2019-02-01T00:00:00+09:00

# 2019年2月分を取得
filters[startTime][gte]=2019-02-01T00:00:00+09:00&filters[startTime][lt]=2019-03-01T00:00:00+09:00
```

---

## レスポンス

以下のJSONが返ってきます。

### 正常な場合

| フィールド名 | 型 | 例 | 説明 |
|--------------|----|----|------|
| meta | object | - | レスポンスのメタ情報フィールド |
| meta.status | integer | 200 | HTTPステータス（成功の場合200） |
| meta.id | string | 594513df-85ea-4122-9859-f4ec2701cacf | リクエストID |
| meta.totalCount | integer | 12673 | ヒット件数 |
| data | array | - | ヒットしたコンテンツ。要素の内容はパラメータfieldsによって異なります |

例

```json
{
  "meta": {
    "status": 200,
    "totalCount": 1,
    "id": "594513df-85ea-4122-9859-f4ec2701cacf"
  },
  "data": [
    {
      "contentId": "sm9",
      "title": "テスト",
      "description": "テスト",
      "startTime": "2016-11-03T02:09:11+09:00",
      "viewCounter": 1
    }
  ]
}
```

### エラーの場合

| フィールド名 | 型 | 例 | 説明 |
|--------------|----|----|------|
| meta | object | - | レスポンスのメタ情報フィールド |
| meta.status | integer | 400 | HTTPステータス（エラーの場合200以外） |
| meta.errorCode | string | QUERY_PARSE_ERROR | エラーコード |
| meta.errorMessage | string | query parse error | エラー内容 |

#### status: 400
不正なパラメータです。

```json
{
  "meta": {
    "status": 400,
    "errorCode": "QUERY_PARSE_ERROR",
    "errorMessage": "query parse error"
  }
}
```

#### status: 500
検索サーバの異常です。

```json
{
  "meta": {
    "status": 500,
    "errorCode": "INTERNAL_SERVER_ERROR",
    "errorMessage": "please retry later."
  }
}
```

#### status: 503
サービスがメンテナンス中です。メンテナンス終了までお待ち下さい。

```json
{
  "meta": {
    "status": 503,
    "errorCode": "MAINTENANCE",
    "errorMessage": "please retry later."
  }
}
```

## サンプルクエリと実行例

ここでは、以下のような条件の検索クエリを例示します。

- タイトルに「初音ミク」が含まれている動画
- 再生数が10000以上
- 取得する情報はコンテンツID・タイトル・再生数
- 再生数の多い順でソートした上位3件

#### URL

- 実行環境によっては，昇順を表す `+` は `%2B`にエンコードするなどの対応が必要になることがあります。

```
https://snapshot.search.nicovideo.jp/api/v2/snapshot/video/contents/search?q=%E5%88%9D%E9%9F%B3%E3%83%9F%E3%82%AF&targets=title&fields=contentId,title,viewCounter&filters[viewCounter][gte]=10000&_sort=-viewCounter&_offset=0&_limit=3&_context=apiguide
```

#### curl での実行例

```
curl -A 'apiguide application' 'https://snapshot.search.nicovideo.jp/api/v2/snapshot/video/contents/search?targets=title&fields=contentId,title,viewCounter&_sort=-viewCounter&_offset=0&_limit=3&_context=apiguide_application' --data-urlencode "q=初音ミク" --data-urlencode "filters[viewCounter][gte]=10000"
```

#### レスポンス

```json
{
  "meta": {
    "status": 200,
    "totalCount": 12673,
    "id": "0554268c-c0f3-4436-9098-7b9e07885623"
  },
  "data": [
    {
      "contentId": "sm1097445",
      "title": "【初音ミク】みくみくにしてあげる♪【してやんよ】",
      "viewCounter": 11904784
    },
    {
      "contentId": "sm1715919",
      "title": "初音ミク　が　オリジナル曲を歌ってくれたよ「メルト」",
      "viewCounter": 10230124
    },
    {
      "contentId": "sm15630734",
      "title": "『初音ミク』千本桜『オリジナル曲PV』",
      "viewCounter": 9557201
    }
  ]
}
```

---

## データの更新について

更新は一日に一回行われます。  
当APIで参照できるデータは、AM5:00時点(日本標準時)でのデータですが、参照できる状態になるまでデータの更新作業が行われます。

以下のエンドポイントから、現在参照しているデータの切り替え日時を取得することができます。

#### 切り替え日時の取得のエンドポイント

[https://snapshot.search.nicovideo.jp/api/v2/snapshot/version](https://snapshot.search.nicovideo.jp/api/v2/snapshot/version)

#### レスポンス(JSON)

```json
{
  "last_modified" : "yyyy-MM-ddTHH:mm:ss+09:00"
}
```