#!/bin/sh
set -e

# Delete the old production folder
rm -rf build

# Run grunt tasks
./innode npm install
./innode node_modules/.bin/grunt

# Generate production site
./inphp composer update
./inphp vendor/bin/spress site:build --env=pro
./innode node_modules/.bin/grunt post-generate
git checkout -- src/layouts/default.html.twig

# Deploy blog
blogpath='/home/alejandro/apps/alejandrocelaya/blog'
now=`date +'%Y-%m-%d_%T'`
ssh root@alejandrocelaya.com "mv $blogpath $blogpath-$now"
ssh root@alejandrocelaya.com "mkdir $blogpath"
rsync -avz --no-owner --no-group build/ root@alejandrocelaya.com:${blogpath}
