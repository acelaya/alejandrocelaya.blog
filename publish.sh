#!/bin/sh

# Delete the old production folder
rm -rf output_prod

# Run pre-generate grunt tasks
npm install
grunt

# Install composer dependencies
composer update

# Generate production site
vendor/bin/sculpin generate --env=prod

# Undo change sin the layout made by grunt
git checkout -- source/_views/default.html.twig

# Run post-generate grunt tasks
grunt postgenerate

# Deploy blog
blogpath='/home/alejandro/apps/alejandrocelaya/blog'
now=`date +'%Y-%m-%d_%T'`
ssh root@alejandrocelaya.com "mv $blogpath $blogpath-$now"
ssh root@alejandrocelaya.com "mkdir $blogpath"
rsync -avz --no-owner --no-group output_prod/ root@alejandrocelaya.com:${blogpath}
