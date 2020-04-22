// @ts-check

const Indicators = require('../../core/Strategy/Indicators')
const Indicator = require('../../model/Indicator')

/**
 * Function initializes indicators
 * 
 * @returns {Array<typeof import('../../model/Indicator')>}
 */
exports.initIndicators = (indicators) => {
  
  const activeIndicators = []
  
  indicators.forEach(i => {
    let f
  
    switch(i.type) {
      case "Moving Average" : f = Indicators.average(i.timeframe)
        break
      default: throw Error("Undefined indicator!")
    }

    const indicator = new Indicator(i.name, i.timeframe, i.type, f)

    // add new initialized indicator
    activeIndicators.push(indicator)
  })

  return activeIndicators
}