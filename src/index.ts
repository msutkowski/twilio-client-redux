import { default as createMiddleware } from './createMiddleware';

export {
  setup,
  destroy,
  setOutputDevice,
  setInputDevice,
  testOutputDevice,
  sendDigit,
  hangupCall,
  makeCall,
  getStatus,
  getMuteStatus,
  toggleMute,
  setMute,
  ignoreCall,
  rejectCall,
  acceptCall,
  //  Internals, exported for type safety
  onCancel,
  onConnect,
  onError,
  onDisconnect,
  onIncoming,
  onOffline,
  onReady,
  error,
} from './actions';
export { CONSTANTS } from './constants';

export default createMiddleware;
