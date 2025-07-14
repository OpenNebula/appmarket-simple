# Simple OpenNebula Marketplace

This project provides a lightweight implementation of a Marketplace service for OpenNebula. Appliance information is sourced from a collection of metadata YAML files located in the src/data/ directory. For reference, the metadata format follows the structure used in the [official OpenNebula Marketplace repository](https://github.com/OpenNebula/marketplace).

The service launches a Ruby-based API that serves both the appliance metadata and the static assets for the Single Page Application (SPA) frontend.

## Marketplace architecture

<img width="797" height="447" alt="Marketplace Diagram" src="https://github.com/user-attachments/assets/5b80c698-60fe-47ab-8ffb-9237dc5f689a" />

The marketplace is basically a Ruby server that exposes an API with the following paths:

| Path           | Description                                                  |
| -------------- | ------------------------------------------------------------ |
| /              | Returns the index.html entrypoint for the React app.         |
| /appliance     | Returns a list of JSON with all the information of the appliances defined in src/data. |
| /appliance/:id | Returns a JSON with details of a specific appliance defined in src/data. |

## React Development

Marketplace has a React app in order to expose a GUI to interact with the appliances. This app is stored in /src/public/react folder.

### Local

In order to develop in a local environment, install node version 20 and perform the following steps:
- Change to the path /src/public/react
- Execute `npm install`
- Execute `npm run dev:opennebula`

Frontend uses the Ruby API to get the data of the appliances. Change the variable pathAPIDevelopmentMode in vite.config.ts in order to use a different address for the API.

### Build Production Code

- Change to the path /src/public/react
- Execute `npm install`
- Execute `npm run build:opennebula`

The API requests will be done against the same address where the React code is served.

### Run

The React App always will be served through the Ruby API.
