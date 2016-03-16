# Presence tracker
Simple modular presence tracker.

## Providers
Providers are mechanism how to detect device presence. Built-in providers are ARP scan and ping. Additional providers such as HTTP, arping or even IBeacon can be added.

## Extensible
Tracker supports plugins to extend its functionality. Built-in plugins are REST Server, Webhooks & Storage.

### REST server
All presence data is available through REST API.

### Webhooks
Tracker supports dynamic hooks for `present` and `absent` events. It also supports REST interface managment.

### Storage
Storage persists custom device data.

# Run server

    npm install
    npm start
