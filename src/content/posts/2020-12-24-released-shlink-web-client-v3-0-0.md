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

The visits page had a problem, it was trying to display too much information in a single place.

* Visits over time
* Visits from every platform
* Visits from every location
* A list of visits as a table

The new approach splits those in subsections with their own sub-route (`/by-location`, `/by-context`, etc). This helps to render a smaller amount of charts at once, since they are a bit CPU greedy.

Also, only the visits from the last 30 days are loaded by default, making it load way faster for URLs with a lot of visits.

<div class="row">
    <div class="col-md-6">
        <img alt="Shlink web client visits - Before" src="/assets/img/shlink-web-client-3/visits-before.png">
        <p class="text-center"><small>Before</small></p>
    </div>
    <div class="col-md-6">
        <img alt="Shlink web client visits - After" src="/assets/img/shlink-web-client-3/visits-after.png">
        <p class="text-center"><small>After</small></p>
    </div>
</div>

### Date range selector

A new component allows selecting date ranges either by relative time ranges (last 30 days, last 90 days...) or by selecting absolute start and end dates.

This component is used both to filter short URL lists and visits lists.

<div class="row">
    <div class="col-lg-6 col-lg-offset-3 col-md-8 col-md-offset-2">
        <img alt="Shlink web client date range selector" src="/assets/img/shlink-web-client-3/date-range-selector.png">
        <p class="text-center"><small>Date range selector</small></p>
    </div>
</div>

### Domain selector

Shlink has had multi-domain support for some versions, but changing the domain from the web client required to set the value manually, which is prone to typos.

This version introduces a new component which allows selecting from domains already used in the past (which is what you will want in most of the cases), preventing accidental typos.

It also allows setting new values in case you want to use a new domain that you never used in the past. This domain will then appear in the list the next time.

<div class="row">
    <div class="col-md-6">
        <img alt="Shlink web client domains - existing" src="/assets/img/shlink-web-client-3/domains-existing.png">
        <p class="text-center"><small>Existing domains</small></p>
    </div>
    <div class="col-md-6">
        <img alt="Shlink web client domains - new" src="/assets/img/shlink-web-client-3/domains-new.png">
        <p class="text-center"><small>New domain</small></p>
    </div>
</div>


### Other improvements

Those were the major changes, but v3.0.0 includes some other minor improvements.

* Result and loading messages
* Dropped support for Shlink v1

### Next steps

Of course this doesn't end here, and I have a lot of ideas to improve it even further.

* Dark theme
* Shlink dashboard
* Filtering in lists added to URL
