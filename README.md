# Gnome Display Switcher Extension

Display Switcher is an extension for gnome-shell 3.36+ that provides an easy and fast way to switch your display monitors.

  - Fast way to select display monitors.
  - You can choose what you want and not just pressing praying for it.
  - Just press Super + I or configure a custom trigger.

![alt tag](demo.jpg)


### Version 

[2.0 - See changelog](CHANGELOG.md)

### Installation

Installation using Gnome's Extension Website:

[Gnome Extensions Website - Display Switcher](https://extensions.gnome.org/extension/1030/display-switcher/)

Installation from your local terminal: 

```sh
bash -c 'wget -O install-ds.sh https://github.com/iyadkandalaft/gnome-display-switcher/raw/master/install-ds.sh && chmod +x install-ds.sh && ./install-ds.sh'

```

### Development

Want to contribute? Great! Any kind of contribution is valid. See the Contribution Guide for details.

[Contribution Guide](CONTRIBUTING.md)

### Todos

 - Add OSD notification on which display.
 - Auto change configuration based on actual displays.
 - Auto change default audio board in case of HDMI diplays.
 
###	Thanks

This extension was originally developed by Lucas Diedrich and I thank him for his contribution that I relied on for many years.  Lucas has decided to retire the extension but I've decided to continue maintaining it so that other may enjoy it.

This work was inspired by the following:

 - https://github.com/OttoAllmendinger/gnome-shell-imgur/blob/master/src/extension.js#L65
 - https://github.com/simonthechipmunk/turnoffdisplay
 - https://github.com/ithempel/redmine_time_tracker-undef.ch
 - https://github.com/zakkak/workspace-grid-gnome-shell-extension?files=1
 - https://gist.github.com/buzztaiki/1487781#file-gjs-io-sample-js-L26
 - Gnome-shell source code


And "feborges", "Jasper" from gnome-shell IRC.


### License
 ----

[GPL v2](LICENSE)

#### Icons license

Icons made by [Freepik](http://www.freepik.com) and [Flaticon](http://www.flaticon.com), is licensed by [CC 3.0](http://creativecommons.org/licenses/by/3.0/). 

Edited by lucas.diedrich
