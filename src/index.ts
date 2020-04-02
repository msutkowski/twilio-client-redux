import {
  setup,
  destroy,
  setOutputDevice,
  setInputDevice,
  testOutputDevice,

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
import { default as createMiddleware, CONSTANTS } from './createMiddleware';

export {
  // user actions
  setup,
  destroy,
  setOutputDevice,
  setInputDevice,
  testOutputDevice,
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
