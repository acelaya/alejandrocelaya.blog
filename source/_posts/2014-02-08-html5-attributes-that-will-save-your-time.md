---
title: HTML5 attributes that will save your time
tags:
    - attributes
    - html5
    - front-end
categories:
    - web

---

The [HTML5](http://en.wikipedia.org/wiki/HTML5) specification is in process to be a standard. New features are being included but some of them are already supported by major modern browsers.

One of those features is a group of new HTML tag attributes, really useful to solve situations that used to be fixed by using javascript.

### Autofocus

This attribute makes an element to gain focus once te page has been loaded. Can be used with either an `<input>`, a `<textarea>` or a `<button>`

This is a boolean attribute, which means any value assigned to it is a valid value, it only needs to be present. Also, HTML5 specifications allows attributes without values, so it would be only necessary to attach the attribute to the element.

**Usage:**

~~~html
<input type="text" autofocus>
<textarea autofocus></textarea>
<button type="submit" autofocus>Send</button>
~~~

In a page there should be only one element with this attribute, but the last one will gain focus if more than one is present.

This attribute is supported by Google Chrome, Mozilla Firefox, Safari and Internet Explorer 10+.

### Placeholder

The placeholder attribute allows us to define a helper text or default value in text input elements, dropping that value at the moment the user starts writing on the element, and displaying it again once the element gets an empty value. It can be used in both `<input>` and `<textarea>`.

**Usage:**

~~~html
<input type="text" placeholder="Name">
<input type="email" placeholder="Email address">
<input type="password" placeholder="Enter password">
<textarea placeholder="Comments"></textarea>
~~~

This attribute is very useful in <input[type=password]> elements, where the placeholder value will be displayed despite that the user input will be hidden.

Internet Explorer 10+, Google Chrome, Mozilla Firefox, Safari and Opera do support this attribute.

**Example:**

<input type="password" placeholder="Enter your password" class="form-control">

### Spellcheck

Nowadays, many browsers include dictionaries that allows us to see spelling errors in real time.

With spellcheck attribute we can define if certain element should use this feature or we want to disable it. It can be used in both `<input>` and `<textarea>`

Spellcheck accepts values true to enable the feature and false to disable it.

**Usage:**

~~~html
<input type="text" spellcheck="true">
<textarea spellcheck="false"></textarea>
~~~

It is enabled in major browsers by default, so we will only need to disable it if needed.

Spellcheck is supported by Opera, Goocle Chrome and Safari.

### Maxlength

This is also an attribute that can only be used on text input elements. It allows to define the maximum number of characers that can be written on that element.

**Usage:**

~~~html
<input type="text" maxlength="10" placeholder="You can't write more than 10 characters in here">
<textarea maxlength="200"></textarea>
~~~

This attribute is useful to make client-side validation of the length of a field, but make sure to make server-side validation too.

All major browsers support this attribute.

**Example:**

<input type="text" maxlength="10" placeholder="You can't write more than 10 characters in here" class="form-control">

### Start

The start attribute is only used at ordered lists, `<ol>`, and is used to define the first numeric value of the list.

**Usage:**

~~~html
<ol start="6">
    <li>Item nuber six</li>
    <li>Item number seven</li>
    <li>Item number eight</li>
</ol>
~~~

All major browsers support this attribute.

**Example:**

<ol start="6">
    <li>Item nuber six</li>
    <li>Item number seven</li>
    <li>Item number eight</li>
</ol>

### Reversed

As well as the previous attribute, this is only used in ordered lists, `<ol>`, and is used to reverse the numeration of the list, making it start at the length of the list and end at 1.

It is boolean, so its only presence will make the magic.

**Usage:**

~~~html
<ol reversed>
    <li>Item number three</li>
    <li>Item number two</li>
    <li>Item number one</li>
</ol>
~~~

**Example:**

<ol reversed>
    <li>Item number three</li>
    <li>Item number two</li>
    <li>Item number one</li>
</ol>

**Tip of the day!**

Reversed attribute and start attribute can be combined in the same list, making the list go backwards but starting at the number we want to.

**Example:**

<ol start="2" reversed="">
    <li>Item</li>
    <li>Item</li>
    <li>Item</li>
    <li>Item</li>
    <li>Item</li>
</ol>

Unfortunately only Google Chrome supports the reversed attribute.

### Contenteditable

Last but not least. The contenteditable attribute acn be used on any element, making the content of that element editable directly from the browser.

Accepts values _true_ and _false_, enabling or disabling the behavior.

**Usage:**

~~~html
<p contenteditable="true">This content is editable</p>
<div contenteditable="false">This content is NOT editable</div>
~~~

This attribute is compatible with all major browsers.

**Example:**

<p><div contenteditable>This content is editable. Try it!</div></p>