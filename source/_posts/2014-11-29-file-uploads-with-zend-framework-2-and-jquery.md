---
title: File uploads with Zend Framework 2 and jQuery
categories:
    - zf2
    - web
tags:
    - zf2
    - zend-framework-2
    - jquery
    - file-uploads
    - ajax
    - html5
    - jquery

---

We are all very used to file uploads in plenty of web applications. From simple image uploads to a social network to multiple file uploads to file management applications like Dropbox.

On this article I'm going to explain how to handle asynchronous multifile uploads from a jQuery powered front-end to a Zend Framework 2 back-end, including HTML5 upload progress and file validation (type, size, and such).

You will need a modern browser to do this, since asynchronous file uploads are not supported by old browsers. 
 
### Installing example project

I have created a project which is fully functional. I'm going to use it across this article so feel free to clone it from here [https://github.com/acelaya-blog/file-uploads](https://github.com/acelaya-blog/file-uploads).

<blockquote>
    <small>Notice that I've simplified the usual Zend Framework 2 project structure. It's enough for this example, but maybe difficult to maintain if your project grows, so better use the <a href="https://github.com/zendframework/ZendSkeletonApplication">Skeleton Application</a> structure in real applications.</small>
</blockquote>

Once you have it, open a terminal, go to the directory and run `php composer.phar selfupdate && php composer.phar install`.

Finally start the PHP built-in web server by running `cd public && php -S localhost:8000`. Access to <a target="_blank" href="http://localhost:8000">localhost:8000</a> in order to see the application.

### The front-end

I assume you are familiar with file uploads in web environments. All we need is a file input with the attribute multiple, wrapped inside a form with enctype multipart/form-data. This will make the browser to send files to the server.

```html
<form name="uploadFiles" id="uploadFiles" method="post"
      action="/upload-files" enctype="multipart/form-data">
    <input type="file" name="files[]" multiple>
    <button type="submit" class="btn btn-primary">Upload files</button>
</form>
```

It's important to add brackets to the name attribute in the file input, so that the content is treated like an array and the server can properly manage all the files.

In this example I captured the form submit with javascript event handlers so that we can track the progress of the upload. It's been set in `public/js/main.js`. In the `acelaya.uploadFiles` function I have defined what has to be done when the form is sent.

```javascript
// [..]

uploadFiles: function ($form) {
    var action = $form.attr('action'),
        method = $form.attr('method');

    $.ajax({
        url: action,
        type: method,
        data: new FormData($form[0]),
        cache: false,
        contentType: false,
        processData: false,
        xhr: function () {
            // This will make the ajax request to use a custom XHR object which will handle the progress
            var myXhr = $.ajaxSettings.xhr();
            if (myXhr.upload) {
                var progressBar = acelaya.createProgressBar($form);

                // Add progress event handler
                myXhr.upload.addEventListener('progress', function(e) {
                    acelaya.handleUploadProgress(e, progressBar);
                }, false);
                myXhr.upload.addEventListener('load', function() {
                    // Firefox does not trigger the 'progress' event when upload is 100%.
                    // This forces progress to end when upload is successful
                    progressBar.find('.progress-bar').css({width : '100%'});
                }, false);
            }

            return myXhr;
        }
    }).done(function (resp) {
        if (resp.code === 'success') {
            acelaya.refreshFilesList();
        } else {
            $form.after(
                '<div class="alert alert-danger alert-dismissable" style="margin-top: 20px">' +
                    '<button type="button" class="close" data-dismiss="alert"><span>&times;</span></button>' +
                    '<div>An error occurred with uploaded files</div>' +
                '</div>'
            )
        }
    });
},

// [..]
```

If you are familiar with `jQuery` you have probably used the `ajax` method.

In this case I've used the HTML5 `FormData` object to encapsulate the form element. This way any information on it will be serialized and sent to the server asynchronously, including files.

By default the `ajax` method creates a `jqXHR` object (a wrapper of the native `XMLHttpRequest` object) with default behavior, but we need to extend that behavior, so we have to create a new one which will handle the upload progress too.

What we do is to add a `progress` event listener which will increase a [bootstrap styled](http://getbootstrap.com/components/#progress) progress bar as long as the content is sent to the server. The method `acelaya.createProgressBar` will create that progress bar and add it to the DOM.

```javascript
handleUploadProgress: function (e, progressBar) {
    if (! e.lengthComputable) {
        return;
    }

    var percent = e.total > 0 ? e.loaded * 100 / e.total : 100;
    progressBar.find('.progress-bar').css({width : percent + '%'});
    progressBar.find('.progress-bar').text(parseInt(percent) + '%');
},
```

The method attached to the `progress` listener will be called by the browser for every chunk of data sent to the server. The number of times it is called dependes on the browser. For example, Firefox will call it more frequently than Chrome.

The event object contains the total size of the data and the size that has been already sent, but also it has a boolean property lengthComputable that tells if size could be calculated.

In the method `acelaya.handleUploadProgress` we calculate the percentage of the data that has been sent to display it in the progress bar.

<blockquote>
    <small>When you test this application, make sure to use big files, at least 1 GB in total, since you are going to "upload" them to your local machine, which is pretty fast. I already managed the server side to allow up to 1.5GB of POST data.</small>
</blockquote>

Once files are uploaded, if the server returns a success response, we refresh the list of files, otherwise an error message is displayed.

And this is everything for the front-end, but this is not enough to make a usable application since files uplaoded will be discarded at the end of the request if the server does nothing with them.

### The back-end

Zend Framework 2 has some mechanisms to deal with uploaded files. Once we have defined our routes and controllers, we have to get those files and move them to its final location, which is pretty simple with the `Params` controller plugin.

```php
public function uploadAction()
{
    $files = $this->params()->fromFiles('files');
    $code = $this->filesService->persistFiles($files);
    return new JsonModel([
        'code' => $code
    ]);
}
```

I have created a FilesService (`src/Service/FilesService.php` in the project) which gets injected in the controller to handle operations with files. In this case I call the method `persistFiles`, which should store the files in a folder and return a status code which is in turn returned to the client in a JSON response. This is what the method `persistFiles` does.

```php
public function persistFiles(array $files)
{
    foreach ($files as $file) {
        move_uploaded_file($file['tmp_name'], $this->options->getBasePath() . '/' . $file['name']);
    }
    return self::CODE_SUCCESS;
}
```

As you can see, it is pretty simple. It just iterates the list of files and performs a `move_uploaded_file` over each one of them. The options object wrapps the base path, which can be set at `config/config.php` by changing the `files.base_path` directive, and it is the `files` directory by default.

This is functional, but we could need to validate something, like filesizes, mimetypes and such. We could even want to apply a hash to ensure an uploaded file's integrity or check an uploaded image resolution.

Zend Framework 2 comes with a full set of file validators that we can use on this example. 

### Filtering and validation

Let's imagine we don't want to allow files greater than 1.5GB (which is actually the maximum I've set by php configuration, but they don't need to coincide) and that a file with the same name doesn't exist yet. We are also going to ensure the file has been uploaded.

We need now to define an `InputFilter` object that the `FileService` will apply to all the files. If any one of them fails validation, an error will be returned.

```php
<?php
namespace Acelaya\Files;

use Zend\Filter\File\RenameUpload;
use Zend\InputFilter\FileInput;
use Zend\InputFilter\InputFilter;
use Zend\Validator\File\Size;

class FilesInputFilter extends InputFilter
{
    const FILE = 'file';

    public function __construct(FilesOptions $options)
    {
        $input = new FileInput(self::FILE);
        $input->getValidatorChain()->attach(new Size(['max' => $options->getMaxSize()]));
        $input->getFilterChain()->attach(new RenameUpload([
            'overwrite'         => false,
            'use_upload_name'   => true,
            'target'            => $options->getBasePath()
        ]));

        $this->add($input);
    }
}
```

This filter will check each file has a file size no greater than what we defined in our configuration by using the `Size` validator.

Also, the `RenameUpload` filter will try to move the file to our previously defined base path by calling the `move_uploaded_file` function, which will only work with uploaded files, and throw an exception if we try to override an existing file.

We just need to adapt our `FilesService::persistFiles` method to use this `InputFilter`.

```php
public function persistFiles(array $files)
{
    foreach ($files as $file) {
        $filter = clone $this->getInputFilter();
        $filter->setData([FilesInputFilter::FILE => $file]);
        try {
            if (! $filter->isValid()) {
                return self::CODE_ERROR;
            }
            $data = $filter->getValues();
        } catch (InvalidArgumentException $e) {
            return self::CODE_ERROR;
        }
    }
    return self::CODE_SUCCESS;
}
```

The `getInputFilter()` method returns an instance of our `FilesInputFilter`. After that we apply validation and if no exception is thrown and the method `isValid()` returns true, then everything worked and we can continue with the next file. If an error occurred we return the ERROR code.

It is **important** to call `$filter->getValues()` even if we are not going to use them, because that is what makes the function `move_uploaded_file` to be called, otherwise we won't get the files moved to their final directory.

Now the application keeps working, but our uploaded files are filtered and validated.

Zend Framework 2 has other [filters](http://zf2.readthedocs.org/en/latest/modules/zend.filter.file.html) and [validators](http://zf2.readthedocs.org/en/latest/modules/zend.validator.file.html) you can use with files. Take a look at them.

And this is it. We have our fully functional file uploading application.
