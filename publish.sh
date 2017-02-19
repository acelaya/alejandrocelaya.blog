#!/bin/sh

# Delete the old production folder
rm -rf build

# Generate production site
composer update
vendor/bin/spress site:build --env=dev

# Run grunt tasks
npm install
grunt

# Deploy blog
blogpath='/home/alejandro/apps/alejandrocelaya/blog'
now=`date +'%Y-%m-%d_%T'`
ssh root@alejandrocelaya.com "mv $blogpath $blogpath-$now"
ssh root@alejandrocelaya.com "mkdir $blogpath"
rsync -avz --no-owner --no-group build/ root@alejandrocelaya.com:${blogpath}
