import { miniSerializeError, SerializedConnection } from './utils';
import { createAction } from '@reduxjs/toolkit';
import { CONSTANTS } from './constants';

const { DEFAULT_PREFIX } = CONSTANTS;

// Action creators for user dispatched actions. These actions are all optionally
// prefixed.
export const setup = createAction(
  `${DEFAULT_PREFIX}::DEVICE_SETUP`,
  (
    token: string,
    opts?: DeviceConfigOptions,
    deviceId: string = 'default'
  ) => ({
    payload: {
      token,
      opts,
      deviceId,
    },
  })
);
export const destroy = createAction(
  `${DEFAULT_PREFIX}::DEVICE_DESTROY`,
  (deviceId: string = 'default') => ({
    payload: { deviceId },
  })
);

export const setInputDevice = createAction(
  `${DEFAULT_PREFIX}::DEVICE_SET_INPUT_DEVICE`,
  (audioDeviceId: string, deviceId: string = 'default') => ({
    payload: {
      audioDeviceId,
      deviceId,
    },
  })
);
export const setOutputDevice = createAction(
  `${DEFAULT_PREFIX}::DEVICE_SET_OUTPUT_DEVICE`,
  (audioDeviceId: string, deviceId: string = 'default') => ({
    payload: {
      audioDeviceId,
      deviceId,
    },
  })
);
export const testOutputDevice = createAction(
  `${DEFAULT_PREFIX}::DEVICE_TEST_OUTPUT_DEVICE`,
  (audioDeviceId?: string, deviceId: string = 'default') => ({
    payload: { audioDeviceId, deviceId },
  })
);

/**
 * You can optionally specify an audioConstraints object to change the behavior of the local media stream during this call. You can use this to select a specific microphone, or turn off features like auto-gain control. Each web browser implements a different set of MediaTrackConstraints which may be used as audioConstraints, so consult your browser's implementation of getUserMedia for further details.
 * https://www.twilio.com/docs/voice/client/javascript/connection#accept
 *
 * var audioConstraints = {
 * optional: [{ sourceId: 'XXX' }]
 *  };
 */
export const acceptCall = createAction(
  `${DEFAULT_PREFIX}::ACCEPT_CALL`,
  (audioConstraints: MediaTrackConstraints, deviceId: string = 'default') => ({
    payload: { audioConstraints, deviceId },
  })
);
export const rejectCall = createAction(
  `${DEFAULT_PREFIX}::REJECT_CALL`,
  (deviceId: string = 'default') => ({
    payload: { deviceId },
  })
);
export const ignoreCall = createAction(
  `${DEFAULT_PREFIX}::IGNORE_CALL`,
  (deviceId: string = 'default') => ({
    payload: { deviceId },
  })
);

export const setMute = createAction(
  `${DEFAULT_PREFIX}::SET_MUTE`,
  (muted: boolean, deviceId: string = 'default') => ({
    payload: { muted, deviceId },
  })
);
export const toggleMute = createAction(
  `${DEFAULT_PREFIX}::TOGGLE_MUTE`,
  (deviceId: string = 'default') => ({
    payload: { deviceId },
  })
);
export const getMuteStatus = createAction(
  `${DEFAULT_PREFIX}::GET_MUTE_STATUS`,
  (deviceId: string = 'default') => ({
    payload: {
      deviceId,
    },
  })
);
export const getStatus = createAction(
  `${DEFAULT_PREFIX}::GET_STATUS`,
  (deviceId: string = 'default') => ({
    payload: { deviceId },
  })
);
export const sendDigit = createAction(
  `${DEFAULT_PREFIX}::SEND_DIGIT`,
  (digit: string, deviceId: string = 'default') => ({
    payload: { digit, deviceId },
  })
);
export const hangupCall = createAction(
  `${DEFAULT_PREFIX}::HANGUP`,
  (deviceId: string = 'default') => ({
    payload: { deviceId },
  })
);
/**
 * You can use the params passed to the application in .connect() to dynamically generate the right TwiML for your app. For example, you could do the following in your JavaScript code:
 * ```js
 * var number = '5558675309';
 * var connection = Twilio.Device.connect({
 *   phone: number
 * });
 * ```
 * https://www.twilio.com/docs/voice/client/javascript/device#connect
 */
export const makeCall = createAction(
  `${DEFAULT_PREFIX}::MAKE_CALL`,
  (
    params: Record<string, string>,
    audioConstraints: MediaTrackConstraints,
    deviceId: string = 'default'
  ) => ({
    payload: {
      audioConstraints,
      params,
      deviceId,
    },
  })
);

// Action creators for actions dispatched by twilio-client-redux - tied to Device Events

export const onCancel = createAction(
  `${DEFAULT_PREFIX}::DEVICE_EVENT_CANCEL`,
  (connection: SerializedConnection) => ({
    payload: connection,
  })
);
export const onConnect = createAction(
  `${DEFAULT_PREFIX}::DEVICE_EVENT_CONNECT`,
  (connection: SerializedConnection) => ({
    payload: connection,
  })
);

export const onError = createAction(
  `${DEFAULT_PREFIX}::DEVICE_EVENT_ERROR`,
  (error: object) => ({
    payload: error,
  })
);
export const onDisconnect = createAction(
  `${DEFAULT_PREFIX}::DEVICE_EVENT_DISCONNECT`,
  (connection: SerializedConnection) => ({
    payload: connection,
  })
);
export const onIncoming = createAction(
  `${DEFAULT_PREFIX}::DEVICE_EVENT_INCOMING`,
  (connection: SerializedConnection) => ({
    payload: connection,
  })
);
export const onOffline = createAction(
  `${DEFAULT_PREFIX}::DEVICE_EVENT_OFFLINE`,
  (device: object) => ({
    payload: device,
  })
);
export const onReady = createAction(
  `${DEFAULT_PREFIX}::DEVICE_EVENT_READY`,
  (device: object) => ({
    payload: device,
  })
);

type ConnectionStatus =
  | 'pending'
  | 'connecting'
  | 'ringing'
  | 'open'
  | 'closed';
export const onMuteStatus = createAction(
  `${DEFAULT_PREFIX}::CONNECTION_MUTE_STATUS`,
  (muted: boolean) => ({
    payload: { muted },
  })
);
export const onStatus = createAction(
  `${DEFAULT_PREFIX}::CONNECTION_STATUS`,
  (status: ConnectionStatus) => ({
    payload: { status },
  })
);

export type Action =
  | ReturnType<typeof onCancel>
  | ReturnType<typeof onConnect>
  | ReturnType<typeof onError>
  | ReturnType<typeof onDisconnect>
  | ReturnType<typeof onIncoming>
  | ReturnType<typeof onOffline>
  | ReturnType<typeof onReady>;

export const error = createAction(
  `${DEFAULT_PREFIX}::UNHANDLED_ERROR`,
  (action: Action | null, err: Error) => ({
    error: miniSerializeError(err),
    payload: action,
  })
);

// Twilio Device Options
export enum SoundName {
  Incoming = 'incoming',
  Outgoing = 'outgoing',
  Disconnect = 'disconnect',
  Dtmf0 = 'dtmf0',
  Dtmf1 = 'dtmf1',
  Dtmf2 = 'dtmf2',
  Dtmf3 = 'dtmf3',
  Dtmf4 = 'dtmf4',
  Dtmf5 = 'dtmf5',
  Dtmf6 = 'dtmf6',
  Dtmf7 = 'dtmf7',
  Dtmf8 = 'dtmf8',
  Dtmf9 = 'dtmf9',
  DtmfS = 'dtmfs',
  DtmfH = 'dtmfh',
}
export enum Codec {
  Opus = 'opus',
  PCMU = 'pcmu',
}
export interface DeviceConfigOptions {
  [key: string]: any;
  /**
   * Whether the Device should raise the {@link incomingEvent} event when a new call invite is
   * received while already on an active call. Default behavior is false.
   */
  allowIncomingWhileBusy?: boolean;

  /**
   * Audio Constraints to pass to getUserMedia when making or accepting a Call.
   * This is placed directly under `audio` of the MediaStreamConstraints object.
   */
  audioConstraints?: MediaTrackConstraints | boolean;

  /**
   * Whether to enable close protection, to prevent users from accidentally
   * navigating away from the page during a call. If string, the value will
   * be used as a custom message.
   */
  closeProtection?: boolean | string;
  /**
   * An ordered array of codec names, from most to least preferred.
   */
  codecPreferences?: Codec[];
  /**
   * Whether to enable debug logging.
   */
  debug?: boolean;
  /**
   * Whether AudioContext sounds should be disabled. Useful for trouble shooting sound issues
   * that may be caused by AudioContext-specific sounds. If set to true, will fall back to
   * HTMLAudioElement sounds.
   */
  disableAudioContextSounds?: boolean;

  /**
   * Specifies whether Twilio Client will ask WebRTC to set the Differentiated Services field in the packet headers for all WebRTC traffic. Note: At this time, DSCP is only supported in Google Chrome, and does not work on Windows.
   */
  dscp?: boolean;

  /**
   * When set to true, allows for detecting when media connection fails which will trigger automatic media reconnection, and for detecting when media connection is restored, as well as the Connection#reconnecting and Connection#reconnected` events.
   * Default: false
   */
  enableIceRestart?: boolean;

  /**
   * Whether the ringing state should be enabled on {@link Connection} objects. This is required
   * to enable answerOnBridge functionality.
   * Default: false
   */
  enableRingingState?: boolean;

  /**
   * Whether or not to override the local DTMF sounds with fake dialtones. This won't affect
   * the DTMF tone sent over the connection, but will prevent double-send issues caused by
   * using real DTMF tones for user interface. In 2.0, this will be enabled by default.
   */
  fakeLocalDTMF?: boolean;

  /**
   * An array of custom ICE servers (https://developer.mozilla.org/en-US/docs/Web/API/RTCIceServer/urls) to use to connect media. If you have custom Twilio TURN servers from Twilio NTS, you can specify them here.
   */
  iceServers?: any[];

  /**
   * Experimental feature.
   * Whether to use ICE Aggressive nomination.
   */
  forceAggressiveIceNomination?: boolean;

  /**
   * The maximum average audio bitrate to use, in bits per second (bps) based on
   * [RFC-7587 7.1](https://tools.ietf.org/html/rfc7587#section-7.1). By default, the setting
   * is not used. If you specify 0, then the setting is not used. Any positive integer is allowed,
   * but values outside the range 6000 to 510000 are ignored and treated as 0. The recommended
   * bitrate for speech is between 8000 and 40000 bps as noted in
   * [RFC-7587 3.1.1](https://tools.ietf.org/html/rfc7587#section-3.1.1).
   */
  maxAverageBitrate?: number;

  /**
   * Specifies which Twilio Data Center to use when registering, initiating calls, and receiving calls
   * https://www.twilio.com/docs/api/client/regions#twilio-js-regions
   * Default: gll
   */
  region?: string;

  /**
   * An RTCConfiguration to pass to the RTCPeerConnection constructor.
   */
  rtcConfiguration?: RTCConfiguration;

  /**
   * A mapping of custom sound URLs by sound name.
   * Default: null
   */
  sounds?: Partial<Record<SoundName, string>>;

  /**
   * Whether to enable warn logging. Can be true or false. Set this property to false to disable logging warnings to your browser console. This can be overridden using loglevel APIs. Please see SDK Logger section for details - https://www.twilio.com/docs/voice/client/javascript/device#sdk-logger.
   * Default: true
   */
  warnings?: boolean;
}
