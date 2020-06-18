

# Algorithmic Trader (Bachelor Thesis) 

- Cross-platform desktop trading application based on [Nextron][next]
- Connects to [MetaTrader 4][mt4] via [ZMQ][zmq] Library
- User definable Strategies represented as Final State Machines

[![VIDEO PRESENTATION]()](https://youtu.be/H4JH7WbqcAA)

#### 1. Indicator definition

- define your indicators by selecting indicator type (Moving Average), setting its period and defining unique name

#### 2. Strategy definition

- use your defined indicators in strategy definition
- predicate defines when strategy should change state and execute order

```javascript

  // SELL predicate  
  price < indicators.get("ma100")

```

```javascript

  // BUY predicate
  price >= indicators.get("ma100")

```

#### 3. Connect to MetaTrader and start automatic trading

- via ZMQ tcp socket
- select appropriate timeframe (> 500ms)

### Installation

#### 1. MetaTrader Setup

- [Darwinex][dwx]

#### 2. MT Client

```zsh
# development mode
$ yarn dev (or `npm run dev` or `pnpm run dev`)

# production build
$ yarn build (or `npm run build` or `pnpm run build`)
```

### Global Hook Error

If occurs error Unexpected token export: 
Just change "export default" useStore to "module.exports = useStore;" in node_modules

### Documentation

```console
npm run doc
```

[next]: https://github.com/saltyshiomix/nextron
[mt4]: https://www.metatrader4.com/en
[zmq]: https://zeromq.org/
[dwx]: https://github.com/darwinex/DarwinexLabs/tree/master/tools/dwx_zeromq_connector


