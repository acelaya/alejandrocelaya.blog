---
layout: post
title: "Released shlink-web-client v3.0.0"
categories: [web,oss]
tags: [shlink,ui,js,javascript,react,reactjs]
---

Two days ago I released the first major version in almost 2 years for [shlink-web-client](https://github.com/shlinkio/shlink-web-client), a web UI for [shlink](https://shlink.io), my self-hosted URL shortener.

This new version introduces several improvements to the project, and I thought it was worth writing a post to explain all of them in depth.

### New design

The project has been using the same design almost since the beginning. It was clean, but it laked a bit of contrast and consistency in many sections.

Now the main background is light-gray, with components composed in white cards with a slight shadow, that makes them easier to spot inside th app.

Also, the main area has now a max-width that prevents components from stretching too much on wide screens.

<div class="row">
    <div class="col-md-6">
        <img alt="Shlink web client design - Before" src="/assets/img/shlink-web-client-3/design-before.png">
        <p class="text-center"><small>Before</small></p>
    </div>
    <div class="col-md-6">
        <img alt="Shlink web client design - After" src="/assets/img/shlink-web-client-3/design-after.png">
        <p class="text-center"><small>After</small></p>
    </div>
</div>

### Overview page

Up until now, after connecting to a Shlink server, you went directly to the list of short URLs.

With this new version, you can see an overview page first, which displays some general stats, a quick short URL creation form, and the latest 5 short URLs.

From there, you can navigate to the full list of short URLs, with filtering capabilities, or go to the advanced short URL creation form.

<div class="row">
    <div class="col-md-8 col-md-offset-2">
        <img alt="Shlink web client overview" src="/assets/img/shlink-web-client-3/overview.png">
        <p class="text-center"><small>Overview</small></p>
    </div>
</div>

### Improved short URL creation form

One of the sections with more room for improvement was the short URL creation form. It had all the inputs mixed, displaying just the "long url" one, with the option to un-collapsing the rest at will.

The new design groups the inputs by context, which makes it more clear. It also displays all the components from the beginning, since the "quick form" is now in the overview page.

<div class="row">
    <div class="col-md-6">
        <img alt="Shlink web client creation form - Before" src="/assets/img/shlink-web-client-3/creation-form-before.png">
        <p class="text-center"><small>Before</small></p>
    </div>
    <div class="col-md-6">
        <img alt="Shlink web client creation form - After" src="/assets/img/shlink-web-client-3/creation-form-after.png">
        <p class="text-center"><small>After</small></p>
    </div>
</div>

### Enhanced visits page

### Result and loading messages

### Other improvements

* Domain selector
* Date range selector
* Dropped support for Shlink v1

### Next steps

Of course this doesn't end here, and I have a lot of ideas to improve it even further.

* Dark theme
* Shlink dashboard
* Filtering in lists added to URL
