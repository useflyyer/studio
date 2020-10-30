# Flayyer Studio

Companion of [@flayyer/cli](https://github.com/flayyer/flayyer-cli)

![screenshot of the UI](./.github/screenshot.png)

## Local server

Clone the repository and install all the dependencies:

```sh
git clone https://github.com/flayyer/flayyer-studio.git
cd flayyer-studio
yarn install
```

Run at [http://localhost:3000](http://localhost:3000):

```sh
yarn build
yarn start
```

## Development

Run on development mode at [http://localhost:3000](http://localhost:3000):

```sh
yarn dev
```

## Deploy to GitHub Pages

```sh
NODE_ENV=production yarn run build && yarn run export && yarn run deploy
```
