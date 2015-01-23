---
title: Translations and internationalization in PHP projects with Zend\I18n
draft: true
categories:
    - php
    - zf2
tags:
    - i18n
    - translations
    - zf2
    - zend-framework-2

---

Any medium and large project has to deal at some point with the problem of translating the application itself to other languages. There are many tools and standards to do this, but one of my favourite components to do this is [Zend\I18n](http://zf2.readthedocs.org/en/latest/modules/zend.i18n.translating.html).

Everybody who knows me is aware that I love Zend Framework, but unfortunately it's been a while since the last time I worked on a project based on it.

But nowadays that is not a problem. [Composer](/2014/07/19/dependency-management-and-autoloading-in-php-projects-with-composer/) allows you to install any component or library on any project, so I'm indeed constantly using many ZF2 components.

I'm going to explain how to use one of those components, Zend\I18n, to manage application translations.

### Installation

As usual, this component is easily installable with composer.
