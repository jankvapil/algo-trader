// @ts-check

/**
   * @param {typeof import('../core/Indicators')} indicators
   */
export const setIndicators = (store, indicators) => {
  store.setState({ indicators })
}

/**
   * @param {typeof import('../core/Client')} client
   */
export const setClient = (store, client) => {
  store.setState({ client })
}

/**
   * @param {Boolean} connected
   */
export const setConnected = (store, connected) => {
  store.setState({ connected })
}

