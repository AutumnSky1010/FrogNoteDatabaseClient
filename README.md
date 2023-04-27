# 概要
このプログラムは、[FrogNoteDataBaseServer](https://github.com/AutumnSky1010/FrogNoteDatabaseServer)を用いた、クライアントアプリです。
実際に運営するサービスではないため、全ソースを公開しています。
Vue.jsの勉強用のリポジトリなので、エラーハンドリングなどは行っていません。

# 動作
<iframe width="560" height="315" src="https://www.youtube.com/embed/PLzB0A175uc" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

# 設計
![設計](/docs/images/DBClient%E3%83%A2%E3%83%87%E3%83%AB.png)

## Entry層
Entry層ではアプリケーションの起動処理（**一度だけ**行う処理）を行います。
そのため、非常に薄いレイヤとなっています。

## UI層
UI層では、コンポーネントやビューを実装しています。図では表現できていませんが、MVVMパターンに倣って実装しています。ViewとView Modelは単一ファイルコンポーネントとして記述しているので、階層にはなっていません。

## Application層
アプリ層では、アプリ単位での状態を保存・取得、ユースケースをまとめたクラスを実装しています。

### ユースケースを実装した理由
UI層が直接インフラ層に依存することで、イベントハンドラ内にUIに関係しない処理が散らばってしまうという問題があります。この問題を解決するために、アプリケーション層内で、ユースケースごとにメソッドを実装することでUIに関連しない処理を外部に隠ぺいするというという方法を採りました。
また、この方法にはもう一つメリットがあり、インフラ層の影響をUI層が直接受けなくなります。

### storeをアプリ層内部においた理由
storeは**アプリケーションの状態**の保存のみに使うこととしました。そのため、Web APIにアクセスするrepositoryとは明確に区別をつけています。
|repository|store|
|---------|-----|
|揮発性がない情報を扱います。|揮発性がある情報を扱います。 |

## Infrastructure層
この層では、Web APIにアクセスし、認証や、データの送受信を行います。

### なぜインフラ層を下位レイヤとしなかったのか
一般に、インフラ層は下位レイヤとして実装します。そのためには、依存性逆転を実現する必要がありますが、そこまでして下位に配置する必要はないと判断しています。
なぜなら、repositoryをテスト用など、使い分ける予定がないからです。そのため、依存性逆転をすることでかえって処理の見通しが悪くなると判断しました。

## Domain層
現状この層はドメインモデルを表現するための層になっています。APIサーバと同様に、「利用者ごとにFrogNoteのバックアップデータを永続化する」という目的なので、今回の場合、「ユーザ」、「バックアップ」がドメインモデルにあたります。