import {
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
import { default as createMiddleware } from './createMiddleware';
import { CONSTANTS } from './constants';

export {
  // user actions
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
  // internals
  onReady,
  onCancel,
  onConnect,
  onError,
  onDisconnect,
  onIncoming,
  onOffline,
  error,
  // base
  CONSTANTS,
  createMiddleware as default,
};
