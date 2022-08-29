interface ConfigOptions {
    buttonPressValueMin: number | null;
    buttonPressValueMax: number | null;
}
export default class GamepadWrapper {
    private _gamepad;
    private _buttons;
    private _buttonPressValueMin;
    private _buttonPressValueMax;
    constructor(gamepad: Gamepad, options?: ConfigOptions);
    update(): void;
    get gamepad(): Gamepad;
    private getButtonIdx;
    private getAxisIdx;
    getButtonValue(buttonId: string): number;
    getButton(buttonId: string): boolean;
    getButtonDown(buttonId: string): boolean;
    getButtonUp(buttonId: string): boolean;
    getAxis(axisId: string): number;
    get2DInputAngle(buttonId: string): number;
    get2DInputValue(buttonId: string): number;
    getHapticActuator(actuatorIdx: number): GamepadHapticActuator | never;
}
export declare const BUTTONS: {
    STANDARD: {
        RC_BOTTOM: string;
        RC_RIGHT: string;
        RC_LEFT: string;
        RC_TOP: string;
        BUMPER_LEFT: string;
        BUMPER_RIGHT: string;
        TRIGGER_LEFT: string;
        TRIGGER_RIGHT: string;
        CC_LEFT: string;
        CC_RIGHT: string;
        THUMBSTICK_LEFT: string;
        THUMBSTICK_RIGHT: string;
        LC_BOTTOM: string;
        LC_RIGHT: string;
        LC_LEFT: string;
        LC_TOP: string;
        CC_CENTER: string;
    };
    XR_STANDARD: {
        TRIGGER: string;
        SQUEEZE: string;
        TOUCHPAD: string;
        THUMBSTICK: string;
        BUTTON_1: string;
        BUTTON_2: string;
    };
};
export declare const AXES: {
    STANDARD: {
        THUMBSTICK_LEFT_X: string;
        THUMBSTICK_LEFT_Y: string;
        THUMBSTICK_RIGHT_X: string;
        THUMBSTICK_RIGHT_Y: string;
    };
    XR_STANDARD: {
        TOUCHPAD_X: string;
        TOUCHPAD_Y: string;
        THUMBSTICK_X: string;
        THUMBSTICK_Y: string;
    };
};
export {};
//# sourceMappingURL=index.d.ts.map