---
title: Translations and internationalization in PHP projects with Zend\I18n
categories:
    - php
    - zf2
tags:
    - i18n
    - translations
    - zf2
    - zend-framework-2
    - zf2-component

---

Any medium and large project has to deal at some point with the problem of translating the application itself to other languages. There are many tools and standards to do this, but one of my favourite components is [Zend\I18n](http://zf2.readthedocs.org/en/latest/modules/zend.i18n.translating.html).

Everybody who knows me is aware that I love Zend Framework, but unfortunately it's been a while since the last time I worked on a project based on it.

But nowadays that is not a problem. [Composer](https://getcomposer.org/) allows you to install any component or library on any project, so I'm indeed constantly using many ZF2 components.

I'm going to explain how to use one of those components, Zend\I18n, to manage application translations, which is a component that internally uses the `intl` PHP extension, so make sure to have it installed.

### Installation

As usual, this component is easily installable with composer by running this command.

    composer require zendframework/zend-i18n:~2.2

If you want, I've created an example project that I'm going to use on this article. You can find it [here](https://github.com/acelaya-blog/internationalization), just clone it and run `composer update`.

Then go to the public directory, run `php -S 0.0.0.0:8000` and navigate to <a href="http://localhost:8000" target="_blank">localhost:8000</a>

<blockquote>
    <small>If you are not familiar with composer, take a look at this <a href="/2014/07/19/dependency-management-and-autoloading-in-php-projects-with-composer/">article</a>.</small>
</blockquote>

### Translation files

The first we need to decide is the way we are going to store translations. There are many supported formats, from plain PHP arrays where we set a translation key and the text in a language, to [gettext](https://www.gnu.org/software/gettext/) files that can be automatically updated with new strings to be translated, but we could also use xml or ini files.

The preferred method when using Zend\I18n is gettext (and it would be also my choice). It is easy to configure, uses super fast binary files in production and we don't need to define translations immediately, we can leave it for then, so that it doesn't break the development flow.

Gettext files are usually handled with an external tool, [poedit](http://poedit.net/), an open source cross-platform application that can inspect our project and find new translations, deleted translations and updated translations, syncing our translation files (usually those with `po` extension) so that we don't need to remember where we added or updated internationalizable texts.

To do this we just need to tell the program the name of the functions we use to translate strings (usually `translate`, `gettext`, `_` and such) and the files it needs to scan for new translations.
 
It also compiles and generates the binary `.mo` files, which are the ones used by the application.

### The translator

Once we have decided the format of the files that are going to store translations, we have to create the main `Zend\I18n\Translator\Translator` object that is going to be used to find translations by consuming certain configuration.

In the example, the `src/translator.php` file generates and returns a `Translator` instance. You will need to register your object in some kind of service container so that you can inject it anywhere. This example is so simple, that I just included the file in the index.php.
 
The `Translator` has a factory method that is able to consume a configuration to generate the instance. It looks like this.

```php
use Zend\I18n\Translator\Translator;

return Translator::factory([
    'locale' => 'en',
    'translation_file_patterns' => [
        [
            'base_dir' => __DIR__ . '/../languages',
            'type'     => 'gettext',
            'pattern'  => '%s.mo',
        ],
        [
            'base_dir' => __DIR__ . '/../more_languages',
            'type'     => 'array',
            'pattern'  => '%s.lang.php',
        ],
    ],
]);
```

In the configuration we have to define the default locale. It can be only one or an array with many of them, so that the translator can load another language if it is not able to find the first one. The locale can be changed later, but it is a good idea to have a language by default.

Then we have to define a list of places to find translation files. Each specification must include the directory which stores the files, the format of the translations in that directory (we can mix gettext with arrays and ini files if we want) and finally the pattern used to find certain translation file. The first mask will be replaced with the locale that is being used at each moment. This way, if we try to translate a message to the locale en, in the first directory, it will look for a file with the name `en.mo`

I have not included it in the example, but we could also set a cache storage to be used with each translations directory under the 'cache' key, but then we will need to install `zendframework/zend-cache` too.

### Translating texts

Our translator is now ready to be used. In the example, the `public/index.php` file makes use of the translator to translate a couple strings.

The translator works this way, when you call the methods `translate` or `translatePlural` with a string, it tries to find the translation in current locale. If it does, it will return it, otherwise it will return the original string.

This way we can use the default language (usually english) for keys and avoid to generate translation files for that language.

I have configured my `po` files so that poedit looks for the usage of the `translate` method inside the public directory, and assume the first argument is the string to be translated.

At the top of the file you will see that I get a `lang` query param to use it as the current locale. If it is not defined or you define one that is invalid, the default locale `en` will be used.

Now you can test it. It has three valid locales, en, es and fr. Use them to see the texts in English, Spanish and French. You can try to use an invalid locale too and you will see the texts in english.

The last string is not included in any translation file, so you will see it always in english.

### Conclusion

This is it. The translator is a simple component to use on any PHP project. It has more power in Zend Framework based applications, since it can be created by using the ServiceManager, and includes view helpers and integration with forms, but even so it can be used in isolation.

I would like to discuss about advanced concpets of the translator, like text domains, plural forms and even some kind of front-end integration to use the same translation files under javascript environments, but that will be done in another article.
