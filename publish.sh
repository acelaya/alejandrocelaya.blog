#!/bin/sh

# Delete the old production folder
rm -rf output_prod

# Run pre-generate grunt tasks
npm install
grunt

# Generate production site
sculpin generate --env=prod

# Undo change sin the layout made by grunt
git checkout -- source/_views/default.html.twig

# Run post-generate grunt tasks
grunt postgenerate

# Deploy blog

