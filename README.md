# Simple OpenNebula Marketplace

This is a simple implementation of the OpenNebula Marketplace, without
the need of having the heavyweight OpenNebula installation with the database.
All information about appliances is taken from the set of metadata YAML files,
which are deployed into the `src/data/` directory.

Metadata used by official public OpenNebula Marketplace are in [dedicated repository](https://github.com/OpenNebula/marketplace).

## Development

### Frontend

Dependencies:

- [Nodejs](https://nodejs.org/en/download/)
- [Yarn](https://yarnpkg.com/lang/en/docs/install/#debian-stable)

To start, you need to download the JavaScript dependencies. This can be achieved achieved by running the command `yarn` inside the directory `src/public/react`.

Most requests on the API are managed by the Ruby backend, only the routes `/marketplace/*` are managed by React in the file `src/public/react/src/routes.js`.

### Testing with Proxy

- Comment line 2 and uncomment line 1 to `src/public/react/src/constants/endpoints.js`.
- Run in `src/public/react` path the command `yarn start`.

**NOTE:** All the graphic fonts used in it will fail, only use to prove with the information that is in production.

### Build Production Code

- Validate that line 2 is uncomment and line 1 is comment to `src/public/react/src/constants/endpoints.js`.
- Run in `src/public/react` path the command `yarn build`.

### Testing

Once the production build is created, you only need to run

```
$ bundle exec rackup
```