import {
  onCancel,
  onConnect,
  onError,
  onDisconnect,
  onIncoming,
  onOffline,
  onReady,
} from 'actions';
import {
  DEVICE_EVENT_CANCEL,
  DEVICE_EVENT_ERROR,
  DEVICE_EVENT_CONNECT,
  DEVICE_EVENT_DISCONNECT,
  DEVICE_EVENT_INCOMING,
  DEVICE_EVENT_OFFLINE,
  DEVICE_EVENT_READY,
} from 'actionTypes';

type ActionType =
  | typeof DEVICE_EVENT_CANCEL
  | typeof DEVICE_EVENT_ERROR
  | typeof DEVICE_EVENT_CONNECT
  | typeof DEVICE_EVENT_DISCONNECT
  | typeof DEVICE_EVENT_INCOMING
  | typeof DEVICE_EVENT_READY
  | typeof DEVICE_EVENT_OFFLINE;

type Action =
  | ReturnType<typeof onCancel>
  | ReturnType<typeof onConnect>
  | ReturnType<typeof onError>
  | ReturnType<typeof onDisconnect>
  | ReturnType<typeof onIncoming>
  | ReturnType<typeof onOffline>
  | ReturnType<typeof onReady>;

type Options = {
  prefix?: string;
};

export { Action, ActionType, Options };
