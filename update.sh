#!/bin/sh
git pull
npm install
cd misskey-web
git pull
npm install
cd ../
npm run build
