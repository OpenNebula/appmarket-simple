#Dependencies to generate a build javascript.

-[Nodejs](https://nodejs.org/en/download/)
-[Yarn](https://yarnpkg.com/lang/en/docs/install/#debian-stable)

##Start.

To start with this, need download the javascript dependencies, this is achieved by using the command `yarn` while on the path `public/react`.

###Routing.

All connections of the api are managed by Ruby Server, only the routes `/marketplace/*` are managed by React in the file `public/react/src/routes.js`.

##Testing with proxy.

-Comment line 2 and uncomment line 1 to `public/react/src/constants/endpoints.js`.
-Run in `public/react` path the command `yarn start`.

**NOTE:** All the graphic fonts used in it will fail, only use to prove with the information that is in production.

##Generate a build javascript.

-Validate that line 2 is uncomment and line 1 is comment to `public/react/src/constants/endpoints.js`.
-Run in `public/react` path the command `yarn build`.

##Testing final

Once the build javascript is generated, you only need to use the command  `bundle exec rackup`
