Misskey Core
============

[![][travis-badge]][travis-link]
[![][dependencies-badge]][dependencies-link]
[![][mit-badge]][mit]

A core server of *Misskey*.

Get started
-----------
Misskeyを運用するにはドメインがふたつ必要です。

* ひとつめのドメインはプライマリドメインと呼んでいて、Misskeyの主要なサービスを提供するために利用されます。
* ふたつめのドメインはセカンダリドメインと呼んでいて、XSSなどの脆弱性を回避するために利用されます。

**セカンダリドメインはプライマリドメインのサブドメインであってはなりません。**

Required
--------
* Node.js
* MongoDB
* Redis
* Elasticsearch
* GraphicsMagick

Build
-----
1. `git clone git://github.com/syuilo/misskey-core.git`
2. `cd misskey-core`
3. `npm install`
4. `npm run build`
5. `npm start`
6. 表示されるウィザードに従って設定ファイルを生成してください。
7. `npm run buildall`

Launch
------
`npm start`

Repositories
------------
* **misskey-core** ... :round_pushpin: This repository
* [misskey-web](https://github.com/syuilo/misskey-web) ... Web client Implementation
* [misskey-text](https://github.com/syuilo/misskey-text) ... Misskey's text parser

License
-------
[MIT](LICENSE)

[mit]:                http://opensource.org/licenses/MIT
[mit-badge]:          https://img.shields.io/badge/license-MIT-444444.svg?style=flat-square
[travis-link]:        https://travis-ci.org/syuilo/misskey-core
[travis-badge]:       http://img.shields.io/travis/syuilo/misskey-core.svg?style=flat-square
[dependencies-link]:  https://gemnasium.com/syuilo/misskey-core
[dependencies-badge]: https://img.shields.io/gemnasium/syuilo/misskey-core.svg?style=flat-square
