import React from "react"
import useGlobalHook from "use-global-hook"
import * as actions from "../actions"

const initialState = {
  client: null,
  connected: false,
  symbol: "EURUSD",
  indicators: [],
  strategies: [],
  activeStrategy: []
}

const useGlobal = useGlobalHook(React, initialState, actions)

export default useGlobal
