# Fr0ntierX Wallet API Test

This is a simple Next.js app that will help you generate an OIDC from Google in order to try out the Fr0ntierX Wallet API.

## Setting up Sign in with Google

You will need to setup Sign in with Google before you can start the app. You can create a new Google OAuth client following this guide: [https://support.google.com/cloud/answer/6158849?hl=en](https://support.google.com/cloud/answer/6158849?hl=en).

Since this app is meant to only be run locally, configure `localhost:3000` as an authorized domain.

After you have created the OAuth client, you will need to add the client ID and client secret to the `.env.local` file. You can copy the `.env.local.example` file and fill in the values.

## Running the app

To run the app, you will need to install the dependencies first:

```bash
yarn install
```

Then you can run the app:

```bash
yarn dev
```

The app will be available at [http://localhost:3000](http://localhost:3000). You can use it to sign in with Google and get a valid OIDC token.

> Note: you will need to register your Google client ID with Fr0ntierX first to obtain an API key.
