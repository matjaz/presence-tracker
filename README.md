# Presence tracker
Simple modular presence tracker.

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
    DELETE /providers/:id - Remove a device

#### Ping (ID: `ping`)

Add new device to check

    curl -v -X POST -H 'Content-Type:application/json' 'http://localhost:3000/providers/ping' -d '{"id":"192.168.1.1"}'

#### TCP connect (`tcp-connect`)

Example: Add check if router is accesible

    curl -v -X POST -H 'Content-Type:application/json' 'http://localhost:3000/providers/tcp-connect' -d '{"id":"router","host":"192.168.1.1","port":80}'

#### ARP scan (`arpscan`)

ARP scan does not support any configuration.

***Note***: You need `arp-scan` binary on system to use ARP scan provider.

## Extensible
Tracker supports plugins to extend its functionality. Built-in plugins are REST Server, Webhooks & Storage.

### REST server
All presence data is available through REST API.

    GET / - returns all present devices
    GET /:id - get device
    GET /:id/data - get custom device data
    PATCH /:id/data - add custom device data
    GET /.meta - get metadata

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
Storage persists custom device data.

# Setup

    cp config.example.json config.json
    # edit config
    npm install

# Run server

    npm start

[request_options]: https://nodejs.org/api/http.html#http_http_request_options_callback
