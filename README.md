Misskey Core
============

[![][travis-badge]][travis-link]
[![][dependencies-badge]][dependencies-link]
[![][mit-badge]][mit]

A core server of *Misskey*.

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
4. `npm run dtsm`
5. `npm run build`

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
