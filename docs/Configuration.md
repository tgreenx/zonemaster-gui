# Configuration

The GUI can be configured by creating the file
`DISTBASE/dist/assets/app.config.json`. "DISTBASE" is where the Zonemaster
Web GUI zip file is installed, which is `/var/www/html/zonemaster-web-gui` by
default installation (see [Installation instructions](Installation.md)).


This file can by created by copying `app.config.sample.json` found in
`DISTBASE/dist/assets`:
```sh
cp app.config.sample.json app.config.json
```


The supported configuration items are the following.

* `"apiEndpoint"`: The URL to use to contact the API, default `"/api"`.
  It could be either a full URL to use an API endpoint not located on the same
  origin as the one serving the GUI or just a path, like the default value, when
  both the API and GUI are served from the same origin.
* `"defaultLanguage"`: The default language of the GUI, defined as a two letters
  code, default `"en"`. The value must be one of the languages listed in
  `"enabledLanguages"`.
* `"enabledLanguages"`: An array of the languages enabled in the GUI, default
  `[ "da", "en", "es", "fi", "fr", "nb", "sv" ]`.
* `"contactAddress"`: The contact email address displayed in the footer, default
  `"contact@zonemaster.net"`.
* `"logo`": The URL to the image displayed in the navigation bar, default
  `"assets/images/zonemaster_logo_2021_color.png"`.
* `"msgBanner"`: A message to display to the user, if empty or undefined no
  banner will be shown. HTML formatting is supported (such as `<a>` tag) and
  some characters such as `&><` need to be written as HTML codes to be properly
  rendered.
* `"pollingInterval"`: Time between each test progress query in millisecond,
  default: `5000` (5 seconds).
