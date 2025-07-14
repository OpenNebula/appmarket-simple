# Simple OpenNebula Marketplace

This is a simple implementation of the OpenNebula Marketplace, without
the need of having the heavyweight OpenNebula installation with the database.
All information about appliances is taken from the set of metadata YAML files,
which are deployed into the `src/data/` directory.

Metadata used by official public OpenNebula Marketplace are in [dedicated repository](https://github.com/OpenNebula/marketplace).

This implementation starts a Ruby API that responses with the data from the marketplace but also serves the Single Page Application files.

## Frontend Development

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