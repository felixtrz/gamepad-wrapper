import {
	STANDARD_AXES,
	STANDARD_AXES_MAPPING,
	STANDARD_BUTTONS,
	STANDARD_BUTTON_MAPPING,
} from './standard-mapping.js';
import {
	XR_STANDARD_AXES,
	XR_STANDARD_AXES_MAPPING,
	XR_STANDARD_BUTTONS,
	XR_STANDARD_BUTTON_MAPPING,
} from './xr-standard-mapping.js';

interface ConfigOptions {
	buttonPressValueMin: number | null;
	buttonPressValueMax: number | null;
	buttonClickThreshold: number | null;
}

interface ButtonFrameData {
	value: number;
	touched: boolean;
}

interface ButtonState {
	currFrame: ButtonFrameData;
	prevFrame: ButtonFrameData;
	pressedSince: number;
}

export class GamepadWrapper {
	private _gamepad: Gamepad;
	private _buttons: Array<ButtonState> = [];
	private _buttonPressValueMin: number;
	private _buttonPressValueMax: number;
	private _buttonClickThreshold: number;

	constructor(gamepad: Gamepad, options: ConfigOptions | any = {}) {
		this._gamepad = gamepad;
		this._buttonPressValueMin = options.buttonPressValueMin ?? 0;
		this._buttonPressValueMax = options.buttonPressValueMax ?? 1;
		this._buttonClickThreshold = options.buttonClickThreshold ?? 0.9;
		for (
			let buttonIdx = 0;
			buttonIdx < this._gamepad.buttons.length;
			buttonIdx++
		) {
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
		for (
			let buttonIdx = 0;
			buttonIdx < this._gamepad.buttons.length;
			buttonIdx++
		) {
			this._buttons[buttonIdx].prevFrame = this._buttons[buttonIdx].currFrame;
			this._buttons[buttonIdx].currFrame = {
				value: this._gamepad.buttons[buttonIdx].value,
				touched: this._gamepad.buttons[buttonIdx].touched,
			};
		}
	}

	get gamepad(): Gamepad {
		return this._gamepad;
	}

	private getButtonIdx(buttonId: string): number | never {
		const buttonIdx =
			this._gamepad.mapping == 'standard'
				? STANDARD_BUTTON_MAPPING[
						buttonId as keyof typeof STANDARD_BUTTON_MAPPING
					]
				: this._gamepad.mapping == 'xr-standard'
					? XR_STANDARD_BUTTON_MAPPING[
							buttonId as keyof typeof XR_STANDARD_BUTTON_MAPPING
						]
					: null;
		if (buttonIdx == null) {
			throw `Button "${buttonId}" does not exist in layout "${this._gamepad.mapping}"`;
		} else {
			return buttonIdx;
		}
	}

	private getAxisIdx(axisId: string): number | never {
		const axisIdx =
			this._gamepad.mapping == 'standard'
				? STANDARD_AXES_MAPPING[axisId as keyof typeof STANDARD_AXES_MAPPING]
				: this._gamepad.mapping == 'xr-standard'
					? XR_STANDARD_AXES_MAPPING[
							axisId as keyof typeof XR_STANDARD_AXES_MAPPING
						]
					: null;
		if (axisIdx == null) {
			throw `Axis "${axisId}" does not exist in layout "${this._gamepad.mapping}"`;
		} else {
			return axisIdx;
		}
	}

	getButtonValueByIndex(buttonIdx: number) {
		if (this._buttons[buttonIdx]) {
			return this._buttons[buttonIdx].currFrame.value;
		} else {
			return 0;
		}
	}

	getButtonValue(buttonId: string): number {
		const buttonIdx = this.getButtonIdx(buttonId);
		return this.getButtonValueByIndex(buttonIdx);
	}

	getButtonByIndex(buttonIdx: number): boolean {
		if (this._buttons[buttonIdx]) {
			return (
				this._buttons[buttonIdx].currFrame.value > this._buttonPressValueMin
			);
		} else {
			return false;
		}
	}

	getButton(buttonId: string): boolean {
		const buttonIdx = this.getButtonIdx(buttonId);
		return this.getButtonByIndex(buttonIdx);
	}

	getButtonDownByIndex(buttonIdx: number): boolean {
		if (this._buttons[buttonIdx]) {
			return (
				this._buttons[buttonIdx].prevFrame.value <= this._buttonPressValueMin &&
				this._buttons[buttonIdx].currFrame.value > this._buttonPressValueMin
			);
		} else {
			return false;
		}
	}

	getButtonDown(buttonId: string): boolean {
		const buttonIdx = this.getButtonIdx(buttonId);
		return this.getButtonDownByIndex(buttonIdx);
	}

	getButtonUpByIndex(buttonIdx: number): boolean {
		if (this._buttons[buttonIdx]) {
			return (
				this._buttons[buttonIdx].prevFrame.value >= this._buttonPressValueMax &&
				this._buttons[buttonIdx].currFrame.value < this._buttonPressValueMax
			);
		} else {
			return false;
		}
	}

	getButtonUp(buttonId: string): boolean {
		const buttonIdx = this.getButtonIdx(buttonId);
		return this.getButtonUpByIndex(buttonIdx);
	}

	getButtonClickByIndex(buttonIdx: number): boolean {
		if (this._buttons[buttonIdx]) {
			return (
				this._buttons[buttonIdx].prevFrame.value <=
					this._buttonClickThreshold &&
				this._buttons[buttonIdx].currFrame.value > this._buttonClickThreshold
			);
		} else {
			return false;
		}
	}

	getButtonClick(buttonId: string): boolean {
		const buttonIdx = this.getButtonIdx(buttonId);
		return this.getButtonClickByIndex(buttonIdx);
	}

	getAxisByIndex(axisIdx: number): number {
		return this._gamepad.axes[axisIdx];
	}

	getAxis(axisId: string): number {
		const axisIdx = this.getAxisIdx(axisId);
		return this.getAxisByIndex(axisIdx);
	}

	get2DInputAngle(buttonId: string): number {
		const axisX = this.getAxis(buttonId + '_X');
		const axisY = this.getAxis(buttonId + '_Y');
		if (axisX == null || axisY == null || (axisX == 0 && axisY == 0)) {
			return NaN;
		}
		let rad = Math.atan(axisX / axisY);
		if (axisX >= 0) {
			if (axisY < 0) {
				rad *= -1;
			} else if (axisY > 0) {
				rad = Math.PI - rad;
			} else if (axisY == 0) {
				rad = Math.PI / 2;
			}
		} else {
			if (axisY < 0) {
				rad *= -1;
			} else if (axisY > 0) {
				rad = -Math.PI - rad;
			} else if (axisY == 0) {
				rad = -Math.PI / 2;
			}
		}
		return rad;
	}

	get2DInputValue(buttonId: string): number {
		const axisX = this.getAxis(buttonId + '_X');
		const axisY = this.getAxis(buttonId + '_Y');
		return Math.sqrt(axisX * axisX + axisY * axisY);
	}

	getHapticActuator(actuatorIdx: number): GamepadHapticActuator | never {
		// @ts-ignore
		const hapticActuator = this._gamepad.hapticActuators[actuatorIdx];
		if (!hapticActuator) {
			throw 'Requested haptic actuator does not exist in gamepad';
		} else {
			return hapticActuator;
		}
	}
}

export const BUTTONS = {
	STANDARD: STANDARD_BUTTONS,
	XR_STANDARD: XR_STANDARD_BUTTONS,
};

export const AXES = {
	STANDARD: STANDARD_AXES,
	XR_STANDARD: XR_STANDARD_AXES,
};

export {
	STANDARD_AXES,
	STANDARD_BUTTONS,
	XR_STANDARD_AXES as XR_AXES,
	XR_STANDARD_BUTTONS as XR_BUTTONS,
};
