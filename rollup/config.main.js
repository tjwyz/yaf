import buble from 'rollup-plugin-buble';

export default {
  entry: 'src/index.js',
  moduleName: 'yar',
  sourcemap: true,
  plugins: [
    buble({
      transforms: {
        dangerousForOf: true
      }
    })
  ],
  
  targets: [
    { dest: 'dist/yar.js', format: 'umd' }
  ]
};
