import { Middleware, MiddlewareAPI } from 'redux';
import Twilio from 'twilio-client';

import {
  setup,
  onReady,
  onConnect,
  onError,
  onDisconnect,
  onIncoming,
  onOffline,
  onCancel,
  destroy,
  setInputDevice,
  setOutputDevice,
  testOutputDevice,
  error,
  Action,
  setMute,
  toggleMute,
  acceptCall,
  rejectCall,
  ignoreCall,
  hangupCall,
  getMuteStatus,
  onMuteStatus,
  onStatus,
  getStatus,
  makeCall,
} from './actions';
import {
  getSerializableFromConnection,
  getSerializableFromDevice,
  miniSerializeError,
} from './utils';

export const CONSTANTS = {
  DEFAULT_PREFIX: '@@tcr',
  TCR_INPUT_DEVICE_KEY: 'tcr_input_device',
  TCR_OUTPUT_DEVICE_KEY: 'tcr_output_device',
};

/**
 * Default middleware opts
 * @private
 */
const defaultOptions = {
  storeAudioDevices: true,
  connectOnIncoming: true,
  prefix: CONSTANTS.DEFAULT_PREFIX,
};

/**
 * Create the middleware.
 *
 * @param {Options} opts
 *
 * @returns {Middleware}
 */
export interface MiddlewareOptions {
  storeAudioDevices?: boolean;
  connectOnIncoming?: boolean;
  prefix?: string;
}
export default (opts?: MiddlewareOptions): Middleware => {
  const options = { ...defaultOptions, ...opts };
  const { prefix } = options;
  const actionPrefixExp = RegExp(`^${prefix}::`);

  // Support multiple devices
  let devices: {
    [key: string]: typeof Twilio.Device;
  } = {};

  const getAudioConstraints = () => {
    let audioConstraints = {};
    if (localStorage.getItem(CONSTANTS.TCR_INPUT_DEVICE_KEY)) {
      audioConstraints = {
        optional: [
          { sourceId: localStorage.getItem(CONSTANTS.TCR_INPUT_DEVICE_KEY) },
        ],
      };
    }
    return audioConstraints;
  };

  // Define the list of handlers, now that we have an instance of ReduxWebSocket.
  const handlers = {
    [setup.type]: (
      { dispatch }: MiddlewareAPI,
      { payload: { token, opts, deviceId } }: ReturnType<typeof setup>
    ) => {
      // Create a device
      if (!devices[deviceId]) {
        devices[deviceId] = new Twilio.Device();
      } else {
        return; // TODO: should we tear down the device and recreate if they try to reinitialize?
      }

      devices[deviceId].setup(token, opts);

      // Register the listeners and dispatch their actions
      devices[deviceId].on('cancel', (connection: any) =>
        dispatch(onCancel(getSerializableFromConnection(connection)))
      );
      devices[deviceId].on('connect', (connection: any) => {
        dispatch(onConnect(getSerializableFromConnection(connection)));
      });
      // Serialize the twilioError if it exists
      devices[deviceId].on('error', (error: any) =>
        dispatch(
          onError({
            ...error,
            ...(error.twilioError
              ? { twilioError: miniSerializeError(error.twilioError) }
              : {}),
          })
        )
      );
      devices[deviceId].on('disconnect', (connection: any) =>
        dispatch(onDisconnect(getSerializableFromConnection(connection)))
      );
      devices[deviceId].on('incoming', (connection: any) => {
        if (options.connectOnIncoming) {
          connection.accept(getAudioConstraints());
        }
        dispatch(onIncoming(getSerializableFromConnection(connection)));
      });
      devices[deviceId].on('offline', (device: any) =>
        dispatch(onOffline(getSerializableFromDevice(device)))
      );
      devices[deviceId].on('ready', (device: any) => {
        // TODO: handle missing device
        if (localStorage.getItem(CONSTANTS.TCR_OUTPUT_DEVICE_KEY)) {
          device.audio.speakerDevices.set(
            localStorage.getItem(CONSTANTS.TCR_OUTPUT_DEVICE_KEY)
          );
          device.audio.speakerDevices.test();
        }
        dispatch(onReady(getSerializableFromDevice(device)));
      });
    },
    [destroy.type]: (
      { dispatch }: MiddlewareAPI,
      { payload: { deviceId } }: ReturnType<typeof destroy>
    ) => {
      if (deviceId && devices[deviceId]) {
        devices[deviceId].device.destroy();
      } else {
        console.error(`Device ${deviceId} not found or already destroyed`);
      }
    },
    [makeCall.type]: (
      _: MiddlewareAPI,
      {
        payload: { deviceId, params, audioConstraints },
      }: ReturnType<typeof makeCall>
    ) => {
      devices[deviceId].connect(params, audioConstraints);
    },
    [acceptCall.type]: (
      _: MiddlewareAPI,
      { payload: { deviceId, audioConstraints } }: ReturnType<typeof acceptCall>
    ) => {
      devices[deviceId].activeConnection().accept(audioConstraints);
    },
    [rejectCall.type]: (
      _: MiddlewareAPI,
      { payload: { deviceId } }: ReturnType<typeof rejectCall>
    ) => {
      devices[deviceId].activeConnection().reject();
    },
    [ignoreCall.type]: (
      _: MiddlewareAPI,
      { payload: { deviceId } }: ReturnType<typeof ignoreCall>
    ) => {
      devices[deviceId].activeConnection().ignore();
    },
    [hangupCall.type]: (
      _: MiddlewareAPI,
      { payload: { deviceId } }: ReturnType<typeof ignoreCall>
    ) => {
      devices[deviceId].activeConnection().disconnect();
    },
    [setMute.type]: (
      _: MiddlewareAPI,
      { payload: { deviceId, muted } }: ReturnType<typeof setMute>
    ) => {
      devices[deviceId].activeConnection().mute(muted);
    },
    [toggleMute.type]: (
      _: MiddlewareAPI,
      { payload: { deviceId } }: ReturnType<typeof toggleMute>
    ) => {
      devices[deviceId]
        .activeConnection()
        .mute(!devices[deviceId].activeConnection().isMuted());
    },
    [getMuteStatus.type]: (
      { dispatch }: MiddlewareAPI,
      { payload: { deviceId } }: ReturnType<typeof getMuteStatus>
    ) => {
      dispatch(onMuteStatus(devices[deviceId].activeConnection().isMuted()));
    },
    [getStatus.type]: (
      { dispatch }: MiddlewareAPI,
      { payload: { deviceId } }: ReturnType<typeof getStatus>
    ) => {
      dispatch(onStatus(devices[deviceId].activeConnection().status()));
    },
    [setInputDevice.type]: (
      _: MiddlewareAPI,
      { payload }: ReturnType<typeof setInputDevice>
    ) => {
      let storageType = sessionStorage;
      if (options.storeAudioDevices) {
        storageType = localStorage;
      }
      storageType.setItem(
        CONSTANTS.TCR_INPUT_DEVICE_KEY,
        payload.audioDeviceId
      );
    },
    [setOutputDevice.type]: (
      _: MiddlewareAPI,
      { payload }: ReturnType<typeof setOutputDevice>
    ) => {
      let storageType = sessionStorage;
      if (options.storeAudioDevices) {
        storageType = localStorage;
      }
      storageType.setItem(
        CONSTANTS.TCR_OUTPUT_DEVICE_KEY,
        payload.audioDeviceId
      );
    },
    [testOutputDevice.type]: (
      _: MiddlewareAPI,
      { payload }: ReturnType<typeof testOutputDevice>
    ) => {
      devices[payload.deviceId].audio.speakerDevices.test();
    },
  };

  // Middleware function.
  return (store: MiddlewareAPI) => next => (action: Action) => {
    const { dispatch } = store;
    const { type: actionType } = action;

    // Check if action type matches prefix
    if (actionType && actionType.match(actionPrefixExp)) {
      const handler = Reflect.get(handlers, actionType);

      if (handler) {
        try {
          handler(store, action);
        } catch (err) {
          dispatch(error(action, err));
        }
      }
    }

    return next(action);
  };
};
