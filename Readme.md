# Libre UI

This workspace contains all packages related to the Libre DAO app UI - the human centered approach to DAOs.

For more information on the individual packages, please read the respective `Readme.md`.

## Setup

- start by running `yarn install` in the root.
- Compile dependencies
  - cd ui components folder `cd packages/ui-components`
  - Install dependencies `yarn install --pure-lockfile`
  - Build project `yarn build`
  - Link project `yarn link`
- Install app
  - cd `cd packages/web-app`
  - Install dependencies `yarn install --pure-lockfile`
  - Link dependencies `yarn link @aragon/ui-components`
  - Start app `yarn dev`

