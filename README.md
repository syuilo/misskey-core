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
4. `npm install gulp bower -g`
5. `npm run dtsm`
6. `gulp build`
7. `npm start`
8. 表示されるウィザードに従って設定ファイルを生成してください。
9. `gulp buildall`

Launch
------
`npm start`

Repositories
------------
* **misskey-core** ... :round_pushpin: This repository
* [misskey-web](https://github.com/syuilo/misskey-web) ... Web client Implementation
* [misskey-file](https://github.com/syuilo/misskey-file) ... Drive file server

License
-------
[MIT](LICENSE)

[mit]:                http://opensource.org/licenses/MIT
[mit-badge]:          https://img.shields.io/badge/license-MIT-444444.svg?style=flat-square
[travis-link]:        https://travis-ci.org/syuilo/misskey-core
[travis-badge]:       http://img.shields.io/travis/syuilo/misskey-core.svg?style=flat-square
[dependencies-link]:  https://gemnasium.com/syuilo/misskey-core
[dependencies-badge]: https://img.shields.io/gemnasium/syuilo/misskey-core.svg?style=flat-square
