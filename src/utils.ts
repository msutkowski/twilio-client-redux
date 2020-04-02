// Borrowed from https://github.com/reduxjs/redux-toolkit
export interface SerializedError {
  name?: string;
  message?: string;
  stack?: string;
  code?: string;
}

const commonProperties: Array<keyof SerializedError> = [
  'name',
  'message',
  'stack',
  'code',
];
export const miniSerializeError = (value: any): SerializedError => {
  if (typeof value === 'object' && value !== null) {
    const simpleError: SerializedError = {};
    for (const property of commonProperties) {
      if (typeof value[property] === 'string') {
        simpleError[property] = value[property];
      }
    }

    return simpleError;
  }

  return { message: String(value) };
};

export const getSerializableFromConnection = (connection: any) => {
  if (Object.keys(connection).length === 0) {
    return { error: 'Missing connection' };
  }
  const {
    direction,
    codec,
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
      dialtonePlayer,
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
    codec,
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
      dialtonePlayer,
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
export const getSerializableFromDevice = (device: any) => {
  if (Object.keys(device).length === 0) {
    return { error: 'Missing device' };
  }
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
