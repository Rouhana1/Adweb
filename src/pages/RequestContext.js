// RequestContext.js
import { createContext } from 'react';

const RequestContext = createContext({
  requests: [],
  setRequests: () => {},
});

export default RequestContext;
