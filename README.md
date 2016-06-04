# Presence tracker
[![NPM][npm-image]][npm-url] [![js-standard-style][standard-image]][standard-url] [![Dependencies][david-image]][david-url] [![devDependencies][david-dev-image]][david-dev-url]

Simple modular presence tracker.

## Installation

    npm install -g presence-tracker

***Note***: Requires Node version 4+ LTS.

### Configure

    curl -o config.json https://raw.githubusercontent.com/matjaz/presence-tracker/master/config.example.json
    # edit providers & paths to json files (should be writeable)
    vi config.json

See [config options][config_options] for detailed explanation.

### Start tracker

    presence-tracker -c config.json

## Providers
Providers are mechanism how to detect device presence. Built-in providers are ARP scan, ping and TCP connect. Additional providers such as arping or even iBeacon can be added.

### Providers API

List active providers

    GET /providers

#### Configuring providers

Each provider can be dynamically configured. Including listing, adding & removing tracked devices.

    GET /providers/:id - list all devices
    GET /providers/:id/:deviceId - show device details
    POST /providers/:id - Add a device
    DELETE /providers/:id/:deviceId - Remove a device

#### Ping (ID: `ping`)

Add new device to check

    curl -v -X POST -H 'Content-Type:application/json' 'http://localhost:3000/providers/ping' -d '{"id":"192.168.1.1"}'

***Note***: You need `ping` binary on system to use ping provider.

#### TCP connect (`tcp-connect`)

Example: Add check if router is accessible

    curl -v -X POST -H 'Content-Type:application/json' 'http://localhost:3000/providers/tcp-connect' -d '{"id":"router","host":"192.168.1.1","port":80}'

#### ARP scan (`arpscan`)

ARP scan [config options][config_options] are passed to [arpscan package][arpscan-package].

***Note***: You need `arp-scan` binary on system to use ARP scan provider.

#### HTTP (ID: `http`)

Mark device as present

    curl -v -X POST http://localhost:3000/providers/http/mydevice/present

Mark device as absent

    curl -v -X DELETE http://localhost:3000/providers/http/mydevice

## Extensible
Tracker supports plugins to extend its functionality. Built-in plugins are REST Server, Webhooks & Storage.

### REST server
All presence data is available through REST API.

    GET /.meta - get metadata
    GET / - returns all present devices
    GET /:id - get device
    GET /:id/data - get custom device data
    PATCH /:id/data - add custom device data

Add custom data with

    curl -v -X PATCH -H 'Content-Type:application/json' 'http://localhost:3000/192.168.1.2/data' -d '{"name":"My phone"}'

To remove data set property to null

    curl -v -X PATCH -H 'Content-Type:application/json' 'http://localhost:3000/192.168.1.2/data' -d '{"name":null}'

### Webhooks
Tracker supports dynamic hooks for `present` and `absent` events. It also supports REST interface managment.

    GET /hooks - return current webhooks
    POST /hooks - dynamically add new webhook
    GET /hooks/:id - return webhook
    DELETE /hooks/:id - remove webhook

Add new present webhook

    curl -v -X POST -H 'Content-Type:application/json' 'http://localhost:3000/hooks' -d '{"event":"present","options":"http://localhost:1337/hooks/present"}'

***Note***: `options` can be URL string or [http.request options][request_options].

### Storage
Storage persists custom device data, when app is restarted.

### Donate

If you like the app, buy me a beer!  
[![Paypal donate][pp-donate-image]][pp-donate-link]

Bitcoin address <a href="bitcoin:1CsnykfypeoemhhUXcr28EbHjv5DViAZfm" title="Bitcoin address 1CsnykfypeoemhhUXcr28EbHjv5DViAZfm">1CsnykfypeoemhhUXcr28EbHjv5DViAZfm</a>

![Bitcoin donate][btc-donate-image]]

[config_options]: https://github.com/matjaz/presence-tracker/wiki/Config-options
[request_options]: https://nodejs.org/api/http.html#http_http_request_options_callback
[arpscan-package]: https://www.npmjs.com/package/arpscan
[npm-image]: https://img.shields.io/npm/v/presence-tracker.svg
[npm-url]: https://www.npmjs.com/package/presence-tracker
[standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg
[standard-url]: http://standardjs.com
[david-image]: https://img.shields.io/david/matjaz/presence-tracker.svg?style=flat
[david-url]: https://david-dm.org/matjaz/presence-tracker
[david-dev-image]: https://img.shields.io/david/dev/matjaz/presence-tracker.svg?style=flat
[david-dev-url]: https://david-dm.org/matjaz/presence-tracker#info=devDependencies
[pp-donate-link]: https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=Y63PX8NDJYVZN&lc=US&item_name=Homey%20app&currency_code=EUR&bn=PP%2dDonationsBF%3abtn_donateCC_LG%2egif%3aNonHosted
[pp-donate-image]: https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif
[btc-donate-image]: https://cloud.githubusercontent.com/assets/10425/15658693/d84c9018-26bf-11e6-9128-ce426a1ead43.png
