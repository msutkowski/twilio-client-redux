# Twilio Client Redux

## Purpose

This package is intended to be used with [`twilio-client.js`](https://github.com/twilio/twilio-client.js) and to make integrating its event emitters with redux very straightforward. We recommend using it along side [Redux Toolkit](https://github.com/reduxjs/redux-toolkit) for several reasons and all code examples are shown with RTK implementations.

The general implementation of this library is currently very opinionated, but should work for every use case - if you have any specific requests, please open an issue or PR and we'd be happy to include it. Our goal is to track `twilio-client` releases and upgrade as necessary.

> Note: As of right now, Twilio does not export types that are easily consumable in their frontend libraries, but we do our best to give you an accurate representation of the serializable **device** and **connection** when appropriate. This is mostly just for logging purposes as you can't call methods on the serialized `Device` or `Connection` objects.

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

At a high level, the implementation looks like this:

1.  Add the middleware
2.  Create a device instance with your capability token by `dispatch`ing `setup(token, options)`
3.  `dispatch` actions to make calls, control the device, etc etc.
4.  Respond to events in relevant reducers to handle `Device` and/or `Connection` events
5.  Have a phone party!

The middleware accepts the following options:

```ts
export interface MiddlewareOptions {
  storeAudioDevices?: boolean; // default = true. store the payload of setInputDevice/setOutputDevice to localStorage. will automatically try to use the values when setting up a future device.
  connectOnIncoming?: boolean; // default = true. automatically accept incoming connections
  prefix?: string; // default = @tcr. currently unimplemented and may be implemented in the future
}
```

Example implementation:

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

#### Device setup options:

Accepts the standard `twilio-client` `Device` options:

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

#### Device actions:

> Note: All devices actions take an optional parameter of `deviceId`. By default, this is set to 'default'. This allows you to manage multiple devices if your implementation requires that.

```ts
setup(); // initialize a device.
destroy(); // destroy the device instance and disconnect all connections. you will need to call setup again to create a new device.
setOutputDevice(); // if you passed in storeAudioDevices: true to `setup`, this will store in localStorage. it will attempt to be reused when the device initialized in the future
setInputDevice(); // sets the input device and behaves the same as setOutputDevice
testOutputDevice(); // can be used to play a chime on the currently set output device
```

### Managing connections

We provide every method that is available to `twilio-client.js` as exported actions. All methods take an optional `deviceId` parameter.

```ts
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

By default, the middleware creates actions for every `twilio-client` event listener. Depending on your redux setup, you can append `.type` to the end of the action you're looking for to get it's type value (ex: `onReady.type` === `@tcr::DEVICE_READY`).

In a non-`createSlice` implementation, that might look like:

```js
// phoneReducer.js
// ... reducer code
switch (action.type) {
  case onReady.type:
  // Do things when the device is ready
}
```

### Included action types that are created after initializing a Device

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
  extraReducers: builder => {
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
    builder.addCase(makeCall.pending, (state, action) => {
      // set state to ringing when we initiate the API request to start the call
      state.status = 'ringing';
    });
    builder.addCase(makeCall.fulfilled, (state, action) => {
      // Note that action is type safe here and will return a action.payload will be the type of Call from our API
      state.status = 'active';
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
