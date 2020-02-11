# Algorithmic Trader (Bachelor Thesis)

- Cross-platform desktop trading application based on [Electron][elec]
- Connects to [MetaTrader 4][mt4] via [ZMQ][zmq] Library

### Installation

#### 1. MetaTrader Setup

- [Darwinex][dwx]

#### 2. Electron App

```console
git clone https://github.com/jkvapil6/bc
cd bc
npm install
npm start
```

##### If error occurs

..compiled against a different Node.js version using NODE_MODULE_VERSION 72...

```console
npm install --save-dev electron-rebuild
```

Every time you run "npm install", run this:

```console
./node_modules/.bin/electron-rebuild
```

### Documentation

```console
npm run doc
```

[elec]: https://electronjs.org/
[mt4]: https://www.metatrader4.com/en
[zmq]: https://zeromq.org/
[dwx]: https://github.com/darwinex/DarwinexLabs/tree/master/tools/dwx_zeromq_connector
