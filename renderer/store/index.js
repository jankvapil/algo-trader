import React from "react"
import useGlobalHook from "use-global-hook"
import * as actions from "../actions"

const initialState = {
  client: "Not Connected"
}

const useGlobal = useGlobalHook(React, initialState, actions)

export default useGlobal
