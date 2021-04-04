# [flayyer.github.io/flayyer-studio](https://flayyer.github.io/flayyer-studio)

Companion of [@flayyer/cli](https://github.com/flayyer/flayyer-cli)

[![screenshot of the UI](./.github/screenshot.png)](https://flayyer.github.io/flayyer-studio)

> Photo by Calbert Warner from [Pexels](https://www.pexels.com/photo/woman-above-man-2889943/)

There is no need to run this on your machine, just go to [the deployed site on GitHub](flayyer.github.io/flayyer-studio) to develop and preview your flayyer templates.

```sh
yarn add --dev @flayyer/cli
yarn run flayyer start
# Opens https://flayyer.github.io/flayyer-studio
```

After testing in a couple of browsers **we recommend running this on Firefox**.

---

## Local server

In the case you want to run this locally:

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

> Documentation for the developers at Flayyer

Make sure you are part of the `flayyer` organization, then run:

```sh
NODE_ENV=production yarn run build && yarn run export && yarn run deploy
```
