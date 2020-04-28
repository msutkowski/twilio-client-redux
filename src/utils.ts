// Based on https://github.com/reduxjs/redux-toolkit
export interface SerializedError {
  name?: string;
  message?: string;
  stack?: string;
  code?: string;
}
export interface TwilioError {
  causes?: string;
  description?: string;
  explanation?: string[];
  solutions?: string[];
  stack?: string;
  code?: string;
}

const commonProperties: Array<keyof SerializedError> = [
  'name',
  'message',
  'stack',
  'code',
];
const twilioErrorProperties: Array<keyof TwilioError> = [
  'causes',
  'code',
  'description',
  'explanation',
  'solutions',
  'stack',
];
export const miniSerializeError = (
  value: any,
  isTwilioError?: boolean
): SerializedError => {
  if (typeof value === 'object' && value !== null) {
    const simpleError: SerializedError & TwilioError = {};
    let errorProperties = isTwilioError
      ? twilioErrorProperties
      : commonProperties;
    for (const property of errorProperties) {
      if (typeof value[property] === 'string') {
        simpleError[property] = value[property];
      }
    }

    return simpleError;
  }

  return { message: String(value) };
};

export type Codec = 'opus' | 'pcmu';

export interface Parameters {
  From: string;
  CallSid: string;
  To: string;
  AccountSid: string;
}

export interface CallParameters {
  From: string;
  CallSid: string;
  To: string;
  AccountSid: string;
}

export interface Options {
  enableRingingState?: boolean;
  offerSdp: string;
  audioConstraints: boolean;
  codecPreferences: Codec[];
  dscp: boolean;
  enableIceRestart: boolean;
  forceAggressiveIceNomination: boolean;
  callParameters: CallParameters;
}

interface Message {}

interface Options2 {}
interface Pstream {
  options: Options2;
  token: string;
  status: string;
  uri: string;
  gateway: string;
  region: string;
  _eventsCount: number;
}

export interface SerializedConnection {
  direction: string;
  parameters: Parameters;
  _maxListeners: number; // maybe doesn't exist?
  _eventsCount: number;
  _inputVolumeStreak: number;
  _isAnswered: boolean;
  _latestInputVolume: number;
  _latestOutputVolume: number;
  _status: string;
  options: Options;
  sendHangup: boolean;
  message: Message;
  _direction: string;
  outboundConnectionId: string;
  pstream: Pstream;
}

export const getSerializableFromConnection = (
  connection: any
): SerializedConnection => {
  const {
    direction,
    // codec,
    _eventsCount,
    _maxListeners,
    parameters,
    _inputVolumeStreak,
    _isAnswered,
    _latestInputVolume,
    _latestOutputVolume,
    _status,
    options: {
      enableRingingState,
      offerSdp,
      audioConstraints,
      codecPreferences,
      //   dialtonePlayer,
      dscp,
      enableIceRestart,
      forceAggressiveIceNomination,
      callParameters,
    },
    sendHangup,
    message,
    _direction,
    outboundConnectionId,
    pstream: {
      options: { backoffMaxMs },
      token,
      status,
      uri,
      gateway,
      region,
      _eventsCount: pstreamEventsCount,
    },
  } = connection;

  return {
    direction,
    parameters,
    // codec,
    _eventsCount,
    _maxListeners,
    _inputVolumeStreak,
    _isAnswered,
    _latestInputVolume,
    _latestOutputVolume,
    _status,
    options: {
      enableRingingState,
      offerSdp,
      audioConstraints,
      codecPreferences,
      //   dialtonePlayer,
      dscp,
      enableIceRestart,
      forceAggressiveIceNomination,
      callParameters,
    },
    sendHangup,
    message,
    _direction,
    outboundConnectionId,
    pstream: {
      options: { backoffMaxMs },
      token,
      status,
      uri,
      gateway,
      region,
      _eventsCount: pstreamEventsCount,
    },
  };
};

export interface SerializedDevice {
  isInitialized: boolean;
  token: string;
  _region: string;
  _status: string;
  options: {
    allowIncomingWhileBusy: boolean;
    audioConstraints: boolean;
    closeProtection: false;
    codecPreferences: Codec[];
  };
}
export const getSerializableFromDevice = (device: any): SerializedDevice => {
  const {
    isInitialized,
    token,
    _region,
    _status,
    options: {
      allowIncomingWhileBusy,
      audioConstraints,
      closeProtection,
      codecPreferences,
    },
  } = device;

  return {
    isInitialized,
    token,
    _region,
    _status,
    options: {
      allowIncomingWhileBusy,
      audioConstraints,
      closeProtection,
      codecPreferences,
    },
  };
};
