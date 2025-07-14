# Simple OpenNebula Marketplace

This is a simple implementation of the OpenNebula Marketplace, without the need of having the heavyweight OpenNebula installation with the database.
All information about appliances is taken from the set of metadata YAML files, which are deployed into the `src/data/` directory. To check the metadata used by official public OpenNebula Marketplace, check the following [dedicated repository](https://github.com/OpenNebula/marketplace).

This implementation starts a Ruby API that responses with the data from the marketplace but also serves the Single Page Application files.



## Marketplace architecture

![image-20250714140633415](/home/david/.config/Typora/typora-user-images/image-20250714140633415.png)

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