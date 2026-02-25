### ドキュメント作成時のルール
- paths内にファイルを作成すること。（コンポーネントなどは作らない） 
- エンドポイントの処理がREST系であればそれぞれファイルは以下の命名にすること。
```bash
# 例はpostsリソースの場合
posts
├── index.yaml # GET /posts
├── show.yaml # GET /posts/:postId
├── store.yaml # POST /posts
├── update.yaml # PATCH /posts/:postId
└── destroy.yaml # DELETE /posts/:postId
```
- ファイルには以下の項目のみを記述すること
```bash
summary: file名
operationId: resource名+file名（キャメルケース）
requestBody: 内容に応じて変更
# 以下はどちらかのみ
responses."200".content: 内容に応じて変更（基本はJSONのみ）
responses."201".content: 内容に応じて変更（基本はNoContent）
```
