
import React, { createContext, useState, useEffect } from "react";

const StoreContext = createContext();
const { Consumer, Provider } = StoreContext

const initialStore = {
  activeCategory: ''
}

const StoreProvider = ({ children }) => {
  const [store, setStore] = useState(initialStore)
  return (
    <Provider value={{ ...store, setStore }}>
      {children}
    </Provider>
  )
}

export default {
  StoreContext,
  StoreConsumer: Consumer,
  StoreProvider
}