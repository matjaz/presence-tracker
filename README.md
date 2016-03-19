# Presence tracker
Simple modular presence tracker.

## Providers
Providers are mechanism how to detect device presence. Built-in providers are ARP scan and ping. Additional providers such as HTTP, arping or even IBeacon can be added.

## Extensible
Tracker supports plugins to extend its functionality. Built-in plugins are REST Server, Webhooks & Storage.

### REST server
All presence data is available through REST API.

    GET / - returns all present devices.
    GET /:id - get device
    GET /:id/data - get custom device data
    PATCH /:id/data - add custom device data

### Webhooks
Tracker supports dynamic hooks for `present` and `absent` events. It also supports REST interface managment.

    GET /hooks - return current webhooks
    POST /hooks - dynamically add new webhook. Body JSON: {"event":"present","options":"http://localhost:1337/hooks/present"}. options can be URL string or [http.request options][request_options]
    GET /hooks/:id - return webhook
    DELETE /hooks/:id - remove webhook

### Storage
Storage persists custom device data.

# Setup

    cp config.example.json config.json
    # edit config
    npm install

# Run server

    npm start

[request_options]: https://nodejs.org/api/http.html#http_http_request_options_callback
