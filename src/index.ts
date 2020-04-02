import {
  setup,
  destroy,
  setOutputDevice,
  setInputDevice,
  testOutputDevice,
} from './actions';
import { default as createMiddleware, CONSTANTS } from './createMiddleware';

export * from './actionTypes';

export {
  setup,
  destroy,
  setOutputDevice,
  setInputDevice,
  testOutputDevice,
  CONSTANTS,
  createMiddleware as default,
};
