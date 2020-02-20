# Algorithmic Trader V2 (Bachelor Thesis) 

- Cross-platform desktop trading application based on [Proton][prot]
- Connects to [MetaTrader 4][mt4] via [ZMQ][zmq] Library
- User definable Strategies represented as Final State Machines

#### 1. Strategy definition

##### Moving Average Example

- predicate defines when strategy should change state and execute order

```javascript
  {
    name: "SELL",
    predicate: (price, profit, indicators) => price < indicators.get("ma100")
  },
  {
    name: "BUY",
    predicate: (price, profit, indicators) => price >= indicators.get("ma100")
  }
```

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
