Misskey Core
============

[![][travis-badge]][travis-link]
[![][dependencies-badge]][dependencies-link]
[![][mit-badge]][mit]

A core server of *Misskey*.

Dependencies
------------
* Node.js
* MongoDB
* Redis
* GraphicsMagick

Optional dependencies
---------------------
* Elasticsearch

Get started
-----------
Misskey requires two domains called the primary domain and the secondary domain.

* The primary domain is used to provide main service of Misskey.
* The secondary domain is used to avoid vulnerabilities such as XSS.

**Ensure that the secondary domain is not a subdomain of the primary domain.**

Build
-----
1. `git clone git://github.com/syuilo/misskey-core.git` ... リポジトリをダウンロードします。
2. `cd misskey-core` ... リポジトリに移動します。
3. `npm install` ... 依存関係をインストールします。
4. `git clone git://github.com/syuilo/misskey-web.git` ... Webリソースをダウンロードします。
5. `npm run build` ... ビルドします。

Install
-------
`npm run config` ... Misskeyの設定を行います。

Launch
------
`npm start`

License
-------
[MIT](LICENSE)

[mit]:                http://opensource.org/licenses/MIT
[mit-badge]:          https://img.shields.io/badge/license-MIT-444444.svg?style=flat-square
[travis-link]:        https://travis-ci.org/syuilo/misskey-core
[travis-badge]:       http://img.shields.io/travis/syuilo/misskey-core.svg?style=flat-square
[dependencies-link]:  https://gemnasium.com/syuilo/misskey-core
[dependencies-badge]: https://img.shields.io/gemnasium/syuilo/misskey-core.svg?style=flat-square
