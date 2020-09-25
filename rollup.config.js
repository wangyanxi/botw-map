import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
    input: 'js/main.babel.js',
    output: {
        file: 'js/main.out.js',
        format: 'iife'
    },
    plugins: [
        nodeResolve(),
        commonjs()
    ]
};


