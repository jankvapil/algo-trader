# Algorithmic Trader V2 (Bachelor Thesis) 

- Cross-platform desktop trading application based on [Proton][prot]
- Connects to [MetaTrader 4][mt4] via [ZMQ][zmq] Library
- User definable Strategies represented as Final State Machines


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

```console
git clone https://github.com/jkvapil6/bc
cd bc
npm install
npm start
```

### Documentation

```console
npm run doc
```

[prot]: https://github.com/kusti8/proton-native/
[mt4]: https://www.metatrader4.com/en
[zmq]: https://zeromq.org/
[dwx]: https://github.com/darwinex/DarwinexLabs/tree/master/tools/dwx_zeromq_connector
