# Gamepad Wrapper 🎮

[![npm version](https://badge.fury.io/js/gamepad-wrapper.svg)](https://badge.fury.io/js/gamepad-wrapper)
[![language](https://badgen.net/badge/icon/typescript?icon=typescript&label)](https://www.typescriptlang.org/)
[![npm download](https://badgen.net/npm/dw/gamepad-wrapper)](https://www.npmjs.com/package/gamepad-wrapper)
[![license](https://badgen.net/github/license/felixtrz/gamepad-wrapper)](/LICENSE.md)

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
import { GamepadWrapper } from 'gamepad-wrapper';
// or import button/axes Enums with it
import { GamepadWrapper, BUTTONS, AXES } from 'gamepad-wrapper';
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
GamepadWrapper( gamepad : Gamepad, options : ConfigOptions | any )
```

ConfigOptions can be used to tune the deadzone for certain input on the gamepad. For example when an old and dusty gamepad cannot reliably register trigger input as 1.0 when fully pressed down, specifying buttonPressValueMax as 0.98 can help resolve the issue. User can also specify buttonClickThreshold as the threshold to register a click event.

```tsx
interface ConfigOptions {
	buttonPressValueMin: number | null;
	buttonPressValueMax: number | null;
	buttonClickThreshold: number | null;
}
```

### Properties

#### .gamepad : Gamepad

The raw gamepad object, data source of the GamepadWrapper instance.

### Methods

#### .getButtonValue

```tsx
getButtonValue( buttonId : string ) : number
```

Returns the value of the button identified by buttonId. Value should range from 0.0 to 1.0.

#### .getButtonValueByIndex

```tsx
getButtonValueByIndex( buttonIdx : number ) : number
```

Bypasses the button id mapping and directly query by gamepad button index. Returns the value of the button identified by buttonId. Value should range from 0.0 to 1.0.

#### .getButton

```tsx
getButton( buttonId : string ) : boolean
```

Returns true while the button identified by buttonId is held down.

#### .getButtonByIndex

```tsx
getButtonByIndex( buttonIdx : number ) : boolean
```

Bypasses the button id mapping and directly query by gamepad button index. Returns true while the button identified by buttonId is held down.

#### .getButtonDown

```tsx
getButtonDown( buttonId : string ) : boolean
```

Returns true during the frame the user pressed down the button identified by buttonId.

#### .getButtonDownByIndex

```tsx
getButtonDownByIndex( buttonIdx : number ) : boolean
```

Bypasses the button id mapping and directly query by gamepad button index. Returns true during the frame the user pressed down the button identified by buttonId.

#### .getButtonUp

```tsx
getButtonUp( buttonId : string ) : boolean
```

Returns true the first frame the user releases the button identified by buttonId.

#### .getButtonUpByIndex

```tsx
getButtonUpByIndex( buttonIdx : number ) : boolean
```

Bypasses the button id mapping and directly query by gamepad button index. Returns true the first frame the user releases the button identified by buttonId.

#### .getButtonClick

```tsx
getButtonClick( buttonId : string ) : boolean
```

Returns true the first frame the user pressed the button identified by buttonId down to a point exceeding the buttonClickThreshold.

#### .getButtonClickByIndex

```tsx
getButtonClickByIndex( buttonIdx : number ) : boolean
```

Bypasses the button id mapping and directly query by gamepad button index. Returns true the first frame the user pressed the button identified by buttonId down to a point exceeding the buttonClickThreshold.

#### .getAxis

```tsx
getAxis( axisId : string ) : number
```

Returns the value of the axis identified by axisId. Value should range from -1.0 to 1.0.

#### .getAxisByIndex

```tsx
getAxisByIndex( axisIdx : number ) : number
```

Bypasses the button id mapping and directly query by gamepad button index. Returns the value of the axis identified by axisId. Value should range from -1.0 to 1.0.

#### .get2DInputAngle

```tsx
get2DInputAngle( buttonId : string ) : number
```

Returns the angle between the input 2D vector and 2D vector (0, 1).

#### .get2DInputValue

```tsx
get2DInputValue( buttonId : string ) : number
```

Returns the Euclidean length of the input 2D vector.

#### .getHapticActuator

```tsx
getHapticActuator( actuatorIdx : number ) : GamepadHapticActuator | never
```

Returns the [GamepadHapticActuator](https://developer.mozilla.org/en-US/docs/Web/API/GamepadHapticActuator) of actuatorIdx, returns null if actuator is not available.

### Input Mapping Enums

- Standard Gamepad Mapping: **[standard-mapping.ts](/src/standard-mapping.ts)**
- XR Standard Gamepad Mapping: **[xr-standard-mapping.ts](/src/xr-standard-mapping.ts)**

Standard Gamepad Mapping

| Button ID                         | Description                     | XBox          |
| --------------------------------- | ------------------------------- | ------------- |
| BUTTONS.STANDARD.RC_BOTTOM        | Bottom button in right cluster  | A             |
| BUTTONS.STANDARD.RC_RIGHT         | Right button in right cluster   | B             |
| BUTTONS.STANDARD.RC_LEFT          | Left button in right cluster    | X             |
| BUTTONS.STANDARD.RC_TOP           | Top button in right cluster     | Y             |
| BUTTONS.STANDARD.BUMPER_LEFT      | Top left front button           | Left Bumper   |
| BUTTONS.STANDARD.BUMPER_RIGHT     | Top right front button          | Right Bumper  |
| BUTTONS.STANDARD.TRIGGER_LEFT     | Bottom left front button        | Left Trigger  |
| BUTTONS.STANDARD.TRIGGER_RIGHT    | Bottom right front button       | Right Trigger |
| BUTTONS.STANDARD.CC_LEFT          | Left button in center cluster   | View Button   |
| BUTTONS.STANDARD.CC_RIGHT         | Right button in center cluster  | Menu Button   |
| BUTTONS.STANDARD.THUMBSTICK_LEFT  | Left stick pressed button       | Left Stick    |
| BUTTONS.STANDARD.THUMBSTICK_RIGHT | Right stick pressed button      | Right Stick   |
| BUTTONS.STANDARD.LC_BOTTOM        | Bottom button in left cluster   | D-pad Down    |
| BUTTONS.STANDARD.LC_RIGHT         | Right button in left cluster    | D-pad Right   |
| BUTTONS.STANDARD.LC_LEFT          | Left button in left cluster     | D-pad Left    |
| BUTTONS.STANDARD.LC_TOP           | Top button in left cluster      | D-pad Up      |
| BUTTONS.STANDARD.CC_CENTER        | Center button in center cluster | Xbox Button   |

## License

[MIT License](/LICENSE.md) © Felix Zhang
