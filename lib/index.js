"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AXES = exports.BUTTONS = void 0;
const standard_mapping_1 = require("./standard-mapping");
const xr_standard_mapping_1 = require("./xr-standard-mapping");
class GamepadWrapper {
    _gamepad;
    _buttons = [];
    _buttonPressValueMin;
    _buttonPressValueMax;
    constructor(gamepad, options = { buttonPressValueMin: 0, buttonPressValueMax: 1 }) {
        this._gamepad = gamepad;
        this._buttonPressValueMin = options.buttonPressValueMin ?? 0;
        this._buttonPressValueMax = options.buttonPressValueMax ?? 1;
        for (let buttonIdx = 0; buttonIdx < this._gamepad.buttons.length; buttonIdx++) {
            this._buttons[buttonIdx] = {
                currFrame: {
                    value: 0,
                    touched: false,
                },
                prevFrame: {
                    value: 0,
                    touched: false,
                },
                pressedSince: 0,
            };
        }
    }
    update() {
        for (let buttonIdx = 0; buttonIdx < this._gamepad.buttons.length; buttonIdx++) {
            this._buttons[buttonIdx].prevFrame = this._buttons[buttonIdx].currFrame;
            this._buttons[buttonIdx].currFrame = {
                value: this._gamepad.buttons[buttonIdx].value,
                touched: this._gamepad.buttons[buttonIdx].touched,
            };
        }
    }
    get gamepad() {
        return this._gamepad;
    }
    getButtonIdx(buttonId) {
        const buttonIdx = this._gamepad.mapping == 'standard'
            ? standard_mapping_1.STANDARD_BUTTON_MAPPING[buttonId]
            : this._gamepad.mapping == 'xr-standard'
                ? xr_standard_mapping_1.XR_STANDARD_BUTTON_MAPPING[buttonId]
                : null;
        if (buttonIdx == null) {
            throw `Button "${buttonId}" does not exist in layout "${this._gamepad.mapping}"`;
        }
        else {
            return buttonIdx;
        }
    }
    getAxisIdx(axisId) {
        const axisIdx = this._gamepad.mapping == 'standard'
            ? standard_mapping_1.STANDARD_AXES_MAPPING[axisId]
            : this._gamepad.mapping == 'xr-standard'
                ? xr_standard_mapping_1.XR_STANDARD_AXES_MAPPING[axisId]
                : null;
        if (axisIdx == null) {
            throw `Axis "${axisId}" does not exist in layout "${this._gamepad.mapping}"`;
        }
        else {
            return axisIdx;
        }
    }
    getButtonValue(buttonId) {
        const buttonIdx = this.getButtonIdx(buttonId);
        return this._buttons[buttonIdx].currFrame.value;
    }
    getButton(buttonId) {
        const buttonIdx = this.getButtonIdx(buttonId);
        return this._buttons[buttonIdx].currFrame.value > this._buttonPressValueMin;
    }
    getButtonDown(buttonId) {
        const buttonIdx = this.getButtonIdx(buttonId);
        return (this._buttons[buttonIdx].prevFrame.value <= this._buttonPressValueMin &&
            this._buttons[buttonIdx].currFrame.value > this._buttonPressValueMin);
    }
    getButtonUp(buttonId) {
        const buttonIdx = this.getButtonIdx(buttonId);
        return (this._buttons[buttonIdx].prevFrame.value >= this._buttonPressValueMax &&
            this._buttons[buttonIdx].currFrame.value < this._buttonPressValueMax);
    }
    getAxis(axisId) {
        const axisIdx = this.getAxisIdx(axisId);
        return this._gamepad.axes[axisIdx];
    }
    get2DInputAngle(buttonId) {
        const axisX = this.getAxis(buttonId + '_X');
        const axisY = this.getAxis(buttonId + '_Y');
        let rad = Math.atan(axisX / axisY);
        if (axisX == 0 && axisY == 0) {
            return NaN;
        }
        if (axisX >= 0) {
            if (axisY < 0) {
                rad *= -1;
            }
            else if (axisY > 0) {
                rad = Math.PI - rad;
            }
            else if (axisY == 0) {
                rad = Math.PI / 2;
            }
        }
        else {
            if (axisY < 0) {
                rad *= -1;
            }
            else if (axisY > 0) {
                rad = -Math.PI - rad;
            }
            else if (axisY == 0) {
                rad = -Math.PI / 2;
            }
        }
        return rad;
    }
    get2DInputValue(buttonId) {
        const axisX = this.getAxis(buttonId + '_X');
        const axisY = this.getAxis(buttonId + '_Y');
        return Math.sqrt(axisX * axisX + axisY * axisY);
    }
    getHapticActuator(actuatorIdx) {
        const hapticActuator = this._gamepad.hapticActuators[actuatorIdx];
        if (!hapticActuator) {
            throw 'Requested haptic actuator does not exist in gamepad';
        }
        else {
            return hapticActuator;
        }
    }
}
exports.default = GamepadWrapper;
exports.BUTTONS = {
    STANDARD: standard_mapping_1.STANDARD_BUTTONS,
    XR_STANDARD: xr_standard_mapping_1.XR_STANDARD_BUTTONS,
};
exports.AXES = {
    STANDARD: standard_mapping_1.STANDARD_AXES,
    XR_STANDARD: xr_standard_mapping_1.XR_STANDARD_AXES,
};
//# sourceMappingURL=index.js.map