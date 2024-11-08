import React, { createContext, useState } from 'react';

const ApiTouchpointsContext = createContext({
  showApiTouchpoints: false,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setShowApiTouchpoints: (show: boolean) => {},
});

function ApiTouchpointsProvider({ children }: { children: React.ReactNode }) {
  // State
  const [showApiTouchpoints, setShowApiTouchpoints] = useState<boolean>(false);

  return (
    <ApiTouchpointsContext.Provider value={{ showApiTouchpoints, setShowApiTouchpoints }}>
      {children}
    </ApiTouchpointsContext.Provider>
  );
}

function useApiTouchpoints() {
  const context = React.useContext(ApiTouchpointsContext);
  if (context === undefined) {
    throw new Error('useApiTouchpoints must be used within an ApiTouchpointsProvider');
  }
  return context;
}

export { ApiTouchpointsProvider, useApiTouchpoints };
