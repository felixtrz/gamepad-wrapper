import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

export default {
	input: 'lib/index.js',
	plugins: [resolve(), commonjs()],
	output: [
		// UMD build
		{
			file: 'build/gamepad-wrapper.js',
			format: 'umd',
			name: 'GamepadWrapper',
		},
		// Minified UMD build
		{
			file: 'build/gamepad-wrapper.min.js',
			format: 'umd',
			name: 'GamepadWrapper',
			plugins: [terser()],
		},
		// ES module build
		{
			file: 'build/gamepad-wrapper.module.js',
			format: 'es',
		},
		// Minified ES module build
		{
			file: 'build/gamepad-wrapper.module.min.js',
			format: 'es',
			plugins: [terser()],
		},
	],
};