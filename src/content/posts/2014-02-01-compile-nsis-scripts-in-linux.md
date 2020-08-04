---
layout: post
title: Compile NSIS scripts in Linux
tags:
    - building
    - continuous-integration
    - deployment
    - installer
    - linux
    - nsis
    - nullsoft
categories:
    - tools

---

[NSIS](http://nsis.sourceforge.net/Main_Page) is a well known system used to create Windows installers for any type of application based on scripts.

It is good system. Once we have defined our script we can automatically build it to create application installers in minutes, including creation of Windows register entries, installation folders, application shortcuts, etc

The problem is that only Windows binaries are officially provided to compile this kind of scripts. This can be a problem in a [continuous integration](https://en.wikipedia.org/wiki/Continuous_integration) environment, where continuous integration servers use to be Linux based.

At this article I am going to explain how to compile NSIS source code in Linux to get it working there and allow it to be invoked from automated tasks run in a continuous integration server.

### Download NSIS

The first step is to download the windows distributable zip file and the source code. Both of them can be downloaded from their Sourceforge project: https://sourceforge.net/projects/nsis/files/?source=navbar.

At the moment of writing this article the last stable version is NSIS 2.46, so we will need to download nsis-2.46.zip and nsis-2.46-src.tar.bz2. We will put them in a folder were users who are going to need it are allowed to access. I am going to put it at `/home/alejandro/nsis`

Now that we have downloaded both windwos distributable package and source code we are going to decompress them creating two folders, nsis-2.46 and nsis-2.46-src.

### System requirements

NSIS official documentation says we need this tools to compile it:

* Python, version 1.6 or higher. I am using Python 2.7.3
* Scons version 0.96.93 or higher. This application can be downloaded from their official website http://www.scons.org/download.php
* A C compiler, in our case `gcc` and `g++`

All of this tools can be easily installed from repository, and probably we already have some of them.

The scons installer downloaded from their website comes in RPM format which could be a problem for systems not based in Ubuntu. For Debian I used the alien [`aptitude install alien`] tool, which converts RPM packages into DEB packages by running this command: `alien -k filename.rpm`

Anyway, I uploaded the DEB resultant package for you to [download](https://alejandrocelaya.blog/assets/downloads/scons_2.3.0-1_all.deb_.zip) it.

### Compile NSIS

Once all the requirements are clear we are going to compile the NSIS binary that is responsible for interpreting the scripts, the so called `makensis`.

We have to be at the source code directory, in my case `/home/alejandro/nsis/nsis-2.46-src`, and we execute this command.

```
scons SKIPSTUBS=all SKIPPLUGINS=all SKIPUTILS=all SKIPMISC=all NSIS_CONFIG_CONST_DATA=no PREFIX=/path/where/distributable/was/extracted install-compiler
```

Notice that _install-compiler_ is an argument of the command that is placed at the end, and is not part of the distributable path.

In my case, using my real path, the resulting command would be this:

```
scons SKIPSTUBS=all SKIPPLUGINS=all SKIPUTILS=all SKIPMISC=all NSIS_CONFIG_CONST_DATA=no PREFIX=/home/alejandro/nsis/nsis-2.46 install-compiler
```

The execution of this command will compile the code, generating the `makensis` binary at the bin directory inside the distributable  package folder, in my case `/home/alejandro/nsis/nsis-2.46/bin`.

### Test makensis and create an installer

Now that we have makensis created its a good idea to make it available from anywhere, for example adding it to a bin directory, and make sure it can be executed.

Using the paths from our example, running this commands will make the job.

```
chmod +x /home/alejandro/nsis/nsis-2.46/bin/makensis
ln -s /home/alejandro/nsis/nsis-2.46/bin/makensis /usr/local/bin/makensis
```

Now it is time to test the command. Running `makensis` from anywhere should output something like this.

![Nsis help](https://alejandrocelaya.blog/assets/img/nsis.png)

If we have an nsis script, runing the command makensis /path/to/script.nsi will compile the script, creating the installer. The syntax is the same used in windows.

**Atention!** While running this command there could be this error.

```
Error: opening stub "/home/alejandro/nsis/nsis-2.46/share/nsis/Stubs/zlib
Error initalizing CEXEBuild: error setting default stub
```

This could happen because of a path error, but solving it is very simple, just go to the NSIS distributable folder, `/home/alejandro/nsis/nsis-2.46` in my case, and create the folder share [`mkdir share`], go to that folder an create a symbolic link running ln -s `/home/alejandro/nsis/nsis-2.46 nsis`.

That should fix the problem.

With this easy steps we have now a NSIS compilation system under a Linux machine ready to build and deploy Windows installers.
