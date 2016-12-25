# Misskey Core

[![][travis-badge]][travis-link]
[![][dependencies-badge]][dependencies-link]
[![][mit-badge]][mit]

A core server of *Misskey*.

## Dependencies
* Node.js
* MongoDB
* Redis
* GraphicsMagick

## Optional dependencies
* Elasticsearch

## Get started
Misskey requires two domains called the primary domain and the secondary domain.

* The primary domain is used to provide main service of Misskey.
* The secondary domain is used to avoid vulnerabilities such as XSS.

**Ensure that the secondary domain is not a subdomain of the primary domain.**

## Build
1. `git clone git://github.com/syuilo/misskey-core.git` ... Download the source code of misskey-core
2. `cd misskey-core` ... Enter the repository
3. `npm install` ... Install npm dependecies
4. `npm run config` ... Create configuration file
5. `git clone git://github.com/syuilo/misskey-web.git` ... Download the source code of misskey-web
6. `npm run build` ... Start building

## Launch
`npm start`

## Docs for API users
### Unofficial articles
* [【2016年12月版】Misskey APIの叩き方](http://blog.surume.tk/misskey-api-call-2016-12/)

## License
[MIT](LICENSE)

[mit]:                http://opensource.org/licenses/MIT
[mit-badge]:          https://img.shields.io/badge/license-MIT-444444.svg?style=flat-square
[travis-link]:        https://travis-ci.org/syuilo/misskey-core
[travis-badge]:       http://img.shields.io/travis/syuilo/misskey-core.svg?style=flat-square
[dependencies-link]:  https://gemnasium.com/syuilo/misskey-core
[dependencies-badge]: https://img.shields.io/gemnasium/syuilo/misskey-core.svg?style=flat-square
