![Hashind Logo](https://www.hashind.com/static/media/logo.0ca02ebd1e244b9bdcc52a0e24d6e287.svg)

# Hashind CRM

This is a CRM for Hashind. It is built using the [T3 Stack](https://create.t3.gg/).

## Tech Stack

- [Next.js](https://nextjs.org/) frontend and backend.
- [Mantine](https://mantine.dev/) UI library.
- [TypeScript](https://www.typescriptlang.org/) main language.
- [MongoDB](https://www.mongodb.com/) database.
- [Mongoose](https://mongoosejs.com/) ODM.
- [Trpc](https://trpc.io/) RPC framework.
- [Redux Toolkit](https://redux-toolkit.js.org/) state management.
- [Zod](https://zod.dev/) schema validation.

## Installation

1. Clone the repository
2. Run `yarn install`
3. Run `yarn dev`

## Setup

1. Create a `.env` file in the root directory
2. Add the following environment variables:

   ```
   MONGODB_URI=''
   NODE_ENV=development
   JWT_SECRET=''
   JWT_EXPIRE=''
   AWS_ACCESS_KEY_ID=''
   AWS_SECRET_ACCESS_KEY=''
   AWS_BUCKET_NAME=""
   SUPER_ADMIN_EMAIL="superadmin@gmail.com"
   SUPER_ADMIN_PASSWORD="superadmin"
   ```

3. Run `yarn dev`

## Folder Structure

```.
    ├── ...
    ├── public
    │   ├── locales
    │   │   │  ├── en
    │   │   │  │   ├── common.json
    │   │   │  │   └── ...
    │   │   │  └── ...
    │   │   └── ...
    │   └── ...
    ├── src
    │   ├── components
    │   │   ├── ...
    │   │   └── ...
    │   ├── constants
    │   │   ├── ...
    │   │   └── index.ts
    │   ├── env
    │   │   ├── client.mjs
    │   │   ├── schema.mjs
    │   │   └── server.mjs
    │   ├── models
    │   │   ├── ...
    │   │   └── ...
    │   ├── pages
    │   │   ├── api
    │   │   │   ├── trpc
    │   │   │   │   └── [trpc].ts
    │   │   │   └── ...
    │   │   ├── _app.tsx
    │   │   └── ...
    │   ├── server
    │   │   ├── common
    │   │   │   ├── ...
    │   │   │   └── ...
    │   │   ├── db
    │   │   │   └── index.ts
    │   │   └── index.ts trpc
    │   │       ├── context.ts
    │   │       ├── router
    │   │       │   ├── ...
    │   │       │   └── ...
    │   │       └── trpc.ts
    │   ├── store
    │   │   ├── clientSlice.ts
    │   │   └── index.ts
    │   ├── styles
    │   │   ├── ...
    │   │   └── ...
    │   ├── types
    │   │   ├── ...
    │   │   └── ...
    │   ├── utils
    │   │   ├── ...
    │   │   └── ...
    │   └── zobjs
    │       ├── ...
    │       └── ...
    ├── next-i18next.config.js
    └── ...
```

<!-- folder strucutre explain nation -->

### `public`

This folder contains all the public files.

### `public/locales`

This folder contains all the translation files.

### `components`

This folder contains all the components used in the project.

### `constants`

This folder contains all the constants used in the project.

### `env`

This folder contains 3 files for the environment variables.

1. `client.mjs` - This file contains the environment variables that are used in the client side.
2. `schema.mjs` - This file contains the zod schema for the environment variables.
3. `server.mjs` - This file contains the environment variables that are used in the server side.

### `models`

This folder contains all the models used in the project. Each model has its own file.

### `pages`

This folder contains all the pages used in the project. Each page has its own folder with the page file and its styles.

### `server`

This folder contains all the server side code.

1. `common` - This folder contains all the common code used in the server side.
2. `db` - This folder contains the database connection.
3. `trpc` - This folder contains the trpc router and context. It also contains the trpc router handlers.

### `store`

This folder contains the redux store.

### `styles`

This folder contains all the styles used in the project.

### `types`

This folder contains some utility types and types for the project.

### `utils`

This folder contains all the utility functions used in the project.

### `zobjs`

This folder contains all the zod objects used in the project.

### `next-i18next.config.js`

This file contains the configuration for next-i18next.

## Deployment

For deployment, use this [guide](https://create.t3.gg/en/deployment/).
