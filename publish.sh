#!/bin/sh
Set -e

# Delete the old production folder
sudo rm -rf build

# Run grunt tasks
npm install
grunt

# Generate production site
sudo composer update
sudo vendor/bin/spress site:build --env=pro
grunt post-generate
git checkout -- src/layouts/default.html.twig

# Deploy blog
blogpath='/home/alejandro/apps/alejandrocelaya/blog'
now=`date +'%Y-%m-%d_%T'`
ssh root@alejandrocelaya.com "mv $blogpath $blogpath-$now"
ssh root@alejandrocelaya.com "mkdir $blogpath"
rsync -avz --no-owner --no-group build/ root@alejandrocelaya.com:${blogpath}
