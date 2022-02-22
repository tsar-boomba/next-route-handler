import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import { defineConfig } from 'rollup';

const packageJson = require('./package.json');

export default defineConfig({
	input: 'src/index.ts',
	watch: {
		include: 'src/**',
	},
	treeshake: true,
	output: [
		{
			file: packageJson.main,
			format: 'cjs',
			sourcemap: true,
		},
		{
			file: packageJson.module,
			format: 'esm',
			sourcemap: true,
		},
	],
	plugins: [
		resolve(),
		commonjs(),
		typescript({ typescript: require('typescript') }),
	],
});
