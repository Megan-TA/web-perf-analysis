import babel from 'rollup-plugin-babel';

export default {
  input: './monitoring/index.js',
  output: {
    file: './public/bundle.js',
    name: 'Mybundle', // 挂在window上的属性名称
    format: 'umd',
    sourceMap: true
  },
  watch: {
    exclude: './node_modules/'
  },
  plugin: [
    babel({
      exclude: './node_modules/**'
    })
  ]
}