# Gamepad Wrapper 🎮

A **Game-Loop-Based**, Non-Event-Driven, **Lightweight** [Gamepad](https://www.w3.org/TR/gamepad/) and [WebXR Gamepad](https://immersive-web.github.io/webxr-gamepads-module/#dom-xrinputsource-gamepad) Wrapper

## Table of contents

**[Key features](#key-features)** |
**[Installation](#installation)** |
**[Usage](#usage)** |
**[API](#api)** |
**[License](#license)**

## Key features

- Supports both [Gamepad API](https://www.w3.org/TR/gamepad/) and the derived [WebXR Gamepad API](https://immersive-web.github.io/webxr-gamepads-module/#dom-xrinputsource-gamepad)
- Auto detects and applies [gamepad mapping type](https://www.w3.org/TR/gamepad/#gamepadmappingtype-enum)
- Built-in support for standard and xr-standard button mapping, no more remembering button index
- Supports threshold tuning for analog input (specify deadzone by defining min/max input value)
- Has Typescript types!

## Installation

To install and set up the library, run:

```sh
$ npm install gamepad-wrapper
```

Or if you prefer using Yarn:

```sh
$ yarn add gamepad-wrapper
```

## Usage

To properly import GameWrapper:

```js
// import just the GamepadWrapper class
import GamepadWrapper from 'gamepad-wrapper';
// or import button/axes Enums with it
import GamepadWrapper, { BUTTONS, AXES } from 'gamepad-wrapper';
```

To register and update gamepads with GameWrapper:

```js
let gamepadWrapper;

// get standard gamepad object from gamepadconnected event
window.addEventListener('gamepadconnected', (event) => {
	gamepadWrapper = new GamepadWrapper(event.gamepad);
});

// get xr-standard gamepad object from XRInputSource
// 3D engines like Three.js or Babylon.js usually have
// their higher-level API to get gamepad
for (const source of frame.session.inputSources) {
	gamepadWrapper = new GamepadWrapper(source.gamepad);
}

// make sure to update the gamepadWrapper before other
// interactive game logic to get the latest results
function gameLoop() {
	gamepadWrapper.update();
	// do other stuff
}
```

To check button states (including linear inputs like triggers):

```js
// the trigger of a WebXR gamdpad is pressed down in current frame
const triggerIsCurrentlyDown = gamepadWrapper.getButton(
	BUTTONS.XR_STANDARD.TRIGGER,
);

// the trigger is down in current frame but not in previous frame
const triggerWasJustPressedDown = gamepadWrapper.getButtonDown(
	BUTTONS.XR_STANDARD.TRIGGER,
);

// the trigger was down in previous frame but not in current frame
const triggerWasJustReleased = gamepadWrapper.getButtonUp(
	BUTTONS.XR_STANDARD.TRIGGER,
);
```

To check thumbstick states:

```js
// the left thumbstick x-axis value (between 0 to 1.0)
const thumbstickValueX = gamepadWrapper.getAxis(
	AXES.STANDARD.THUMBSTICK_LEFT_X,
);

// 2D vector length from x-axis and y-axis value of the left thumbstick
const thumbstickValue = gamepadWrapper.get2DInputValue(
	BUTTONS.STANDARD.THUMBSTICK_LEFT,
);
```

## API

### Constructor

```tsx
GamepadWrapper(gamepad: Gamepad, options: ConfigOptions | null)
```

ConfigOptions can be used to tune the deadzone for certain input on the gamepad. For example when an old and dusty gamepad cannot reliably register trigger input as 1.0 when fully pressed down, specifying buttonPressValueMax as 0.98 can help resolve the issue.

```tsx
interface ConfigOptions {
	buttonPressValueMin: number | null;
	buttonPressValueMax: number | null;
}
```

### Properties

<span style="font-weight: bold; font-size: 1.3em"><span style="color:#049EF4">.gamepad</span>&nbsp;:&nbsp;<span style="color:grey">Gamepad</span></span>
The raw gamepad object, data source of the GamepadWrapper instance.

### Methods

<span style="font-weight: bold; font-size: 1.3em"><span style="color:#049EF4">.getButtonValue</span>&nbsp;(&nbsp;buttonId&nbsp;:&nbsp;<span style="color:grey">string</span>&nbsp;)&nbsp;:&nbsp;<span style="color:grey">number</span></span>
Returns the value of the button identified by buttonId. Value should range from 0.0 to 1.0.

<span style="font-weight: bold; font-size: 1.3em"><span style="color:#049EF4">.getButton</span>&nbsp;(&nbsp;buttonId&nbsp;:&nbsp;<span style="color:grey">string</span>&nbsp;)&nbsp;:&nbsp;<span style="color:grey">boolean</span></span>
Returns true while the button identified by buttonId is held down.

<span style="font-weight: bold; font-size: 1.3em"><span style="color:#049EF4">.getButtonDown</span>&nbsp;(&nbsp;buttonId&nbsp;:&nbsp;<span style="color:grey">string</span>&nbsp;)&nbsp;:&nbsp;<span style="color:grey">boolean</span></span>
Returns true during the frame the user pressed down the button identified by buttonId.

<span style="font-weight: bold; font-size: 1.3em"><span style="color:#049EF4">.getButtonUp</span>&nbsp;(&nbsp;buttonId&nbsp;:&nbsp;<span style="color:grey">string</span>&nbsp;)&nbsp;:&nbsp;<span style="color:grey">boolean</span></span>
Returns true the first frame the user releases the button identified by buttonId.

<span style="font-weight: bold; font-size: 1.3em"><span style="color:#049EF4">.getAxis</span>&nbsp;(&nbsp;axisId&nbsp;:&nbsp;<span style="color:grey">string</span>&nbsp;)&nbsp;:&nbsp;<span style="color:grey">number</span></span>
Returns the value of the axis identified by axisId. Value should range from -1.0 to 1.0.

<span style="font-weight: bold; font-size: 1.3em"><span style="color:#049EF4">.get2DInputAngle</span>&nbsp;(&nbsp;buttonId&nbsp;:&nbsp;<span style="color:grey">string</span>&nbsp;)&nbsp;:&nbsp;<span style="color:grey">number</span></span>
Returns the angle between the input 2D vector and 2D vector (0, 1).

<span style="font-weight: bold; font-size: 1.3em"><span style="color:#049EF4">.get2DInputValue</span>&nbsp;(&nbsp;buttonId&nbsp;:&nbsp;<span style="color:grey">string</span>&nbsp;)&nbsp;:&nbsp;<span style="color:grey">number</span></span>
Returns the Euclidean length of the input 2D vector.

<span style="font-weight: bold; font-size: 1.3em"><span style="color:#049EF4">.getHapticActuator</span>&nbsp;(&nbsp;actuatorIdx&nbsp;:&nbsp;<span style="color:grey">number</span>&nbsp;)&nbsp;:&nbsp;<span style="color:grey">GamepadHapticActuator?</span></span>
Returns the [GamepadHapticActuator](https://developer.mozilla.org/en-US/docs/Web/API/GamepadHapticActuator) of actuatorIdx, returns null if actuator is not available.

### Input Mapping Enums

- Standard Gamepad Mapping: **[standard-mapping.ts](/src/standard-mapping.ts)**
- XR Standard Gamepad Mapping: **[xr-standard-mapping.ts](/src/xr-standard-mapping.ts)**

## License

[MIT License](/LICENSE.md) © Felix Zhang
