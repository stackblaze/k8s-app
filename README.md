# Node.js for stackblaze.com

This template builds a simple application using the Node.js built-in `http` web server. It includes a minimalist application skeleton that demonstrates how to connect to the included MariaDB server, but you are free to alter it as needed.

Node.js is an open-source JavaScript runtime built on Chrome's V8 JavaScript engine.

## Features

* Node.js 14
* MariaDB 10.4
* Automatic TLS certificates
* npm-based build

## Customizations

The following files and additions make the framework work.  If using this project as a reference for your own existing project, replicate the changes below to your project.

* The `.platform.app.yaml`, `.platform/services.yaml`, and `.platform/routes.yaml` files have been added.  These provide Platform.sh-specific configuration and are present in all projects on Platform.sh.  You may customize them as you see fit.
* An additional module, [`config-reader-nodejs`](https://github.com/platformsh/config-reader-nodejs), has been added.  It provides convenience wrappers for accessing the Platform.sh environment variables.
