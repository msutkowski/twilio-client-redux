# Twilio Client Redux

## Purpose

This package is intended to be used with [`twilio-client.js`](https://github.com/twilio/twilio-client.js) and make integrating it's event emitters with redux very straightforward. We recommend using it along side [Redux Toolkit](https://github.com/reduxjs/redux-toolkit) for type safety and all code examples are shown with RTK implementations.

Note: As of right now, Twilio does not export types that are easily consumable in their frontend libraries, but we do our best to give you an accurate representation of the serializable **device** and **connection** when appropriate. This is mostly just for logging purposes as you can't call methods on the serialized `Device` or `Connection` objects.

## Installation

Using `npm`:

```
npm i twilio-client-redux
```

Using `yarn`:

```
yarn add twilio-client-redux
```

## Usage

### Add the middleware

```ts
// store.ts

import { configureStore, Action, getDefaultMiddleware } from '@reduxjs/toolkit';
import TwilioClientRedux from 'twilio-client-redux';

import rootReducer, { RootState } from './rootReducer';

const store = configureStore({
  reducer: rootReducer,
  middleware: [...getDefaultMiddleware(), TwilioClientRedux()],
});

export type AppDispatch = typeof store.dispatch;

export default store;
```

### Initialize a device

```ts
// MyPhoneApp.ts
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setup } from "twilio-client-redux";

export const MyPhoneApp = () => {

const dispatch = useDispatch();

useEffect(() => {
  // You could fetch a token here, or pass it in as a prop, or whatever makes sense for your app
    dispatch(setup(token, { debug: true }));
}, [token])
});

return (<PhoneUI />);

};
```

Device setup options:

```ts
declare interface DeviceConfigOptions {
  allowIncomingWhileBusy?: boolean;
  audioConstraints?: MediaTrackConstraints | boolean;
  closeProtection?: boolean | string;
  codecPreferences?: Codec[];
  debug?: boolean;
  disableAudioContextSounds?: boolean;
  dscp?: boolean;
  enableIceRestart?: boolean;
  enableRingingState?: boolean;
  fakeLocalDTMF?: boolean;
  forceAggressiveIceNomination?: boolean;
  maxAverageBitrate?: number;
  region?: string;
  rtcConfiguration?: RTCConfiguration;
  sounds?: Partial<Record<SoundName, string>>;
  warnings?: boolean;
}
```

### Managing connections

We provide every method that is available to `twilio-client.js` as exported actions. Note that you can include a `deviceId` - if you do not, it will be set as 'default'. This allows you to manage multiple devices.

```ts
setOutputDevice(); // if you passed in storeAudioDevices: true to `setup`, this will store in localStorage. it will attempt to be reused when the device initialized in the future
setInputDevice(); // sets the input device and behaves the same as setOutputDevice
testOutputDevice(); // can be used to play a chime on the currently set output device

makeCall();
hangupCall();
sendDigit(); // sends a digit to the active connection

setMute(); // mute the current connection on the device
toggleMute(); // toggles the mute state
getMuteStatus(); // returns `{ muted: value }`

getStatus(); // returns the status of the active connection

acceptCall();
rejectCall();
ignoreCall();
```

## Responding to middleware-generated actions in a reducer

By default, the middleware creates actions for every `twilio-client` event listener. Depending on your redux setup, you can append `.type` to the end of the action you're looking for to get it's type value (ex: `onReady.type` === `@tcr::DEVICE_READY`)

### Included actions that are created after initializing a Device

```ts
onReady;
onCancel;
onConnect;
onError;
onDisconnect;
onIncoming;
onOffline;
```

Example slice responding to common use cases:

```ts
// phoneSlice.ts

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  onReady,
  onConnect,
  onDisconnect,
  getMuteStatus,
} from 'twilio-client-redux';
import { RootState } from 'src/store/rootReducer';
import { apiRequest } from 'src/utils';

// in this case, we make an API request to our server to initiate a call. being that
// the default value in the middleware is to automatically accept incoming connections
// our call will be bridged immediately. your implementation will vary.
export const makeCall = createAsyncThunk(
  'phone/makeCall',
  async (phone: string) => {
    const {
      data: { data },
    } = await apiRequest.post<Call>(`agent/calls`, { phone });
    return data;
  }
);

const initialState = {
  call: {},
  muted: false,
  status: 'idle',
};

const slice = createSlice({
  name: 'phone',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(onReady, (state, action) => {
      // Note that action is type safe here and will return a serialized `Device`
      state.status = 'idle';
    });
    builder.addCase(onConnect, (state, action) => {
      // Note that action is type safe here and will return a serialized `Connection`
      state.status = 'active';
    });
    builder.addCase(onDisconnect, (state, action) => {
      // Note that action is type safe here and will return a serialized `Device`
      return initialState;
    });
    builder.addCase(makeCall.fulfilled, (state, action) => {
      // Note that action is type safe here and will return a call from our API
      state.status = 'ringing';
      state.call = action.payload;
    });
    builder.addCase(getMuteStatus, (state, action) => {
      state.muted = action.payload.muted;
    });
  },
});

export default slice.reducer;

export const selectIsMuted = (state: RootState) => state.phone.muted;
```
