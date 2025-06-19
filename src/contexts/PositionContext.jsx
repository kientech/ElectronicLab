import React, { createContext, useContext, useState } from "react";

const PositionContext = createContext(null);

export const usePosition = () => {
  return useContext(PositionContext);
};

export const PositionProvider = ({ children }) => {
  const [currentPosition, setCurrentPosition] = useState(null);

  return (
    <PositionContext.Provider value={{ currentPosition, setCurrentPosition }}>
      {children}
    </PositionContext.Provider>
  );
};
