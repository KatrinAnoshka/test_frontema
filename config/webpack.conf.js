import path from 'path';
import stylish from 'eslint/lib/formatters/stylish';
import notifier from 'node-notifier';
import webpack from 'webpack';

const eslintFormatter = ({notify}) => errors => {
  if (errors[0].messages) {
    console.log(stylish(errors));
    if (notify) {
      const error = errors[0].messages.find(msg => msg.severity === 2);
      if (error) {
        notifier.notify({
          title: error.message,
          message: `${error.line}:${error.column} ${error.source.trim()}`,
          icon: path.join(__dirname, 'tasks/images/error-icon.png')
        });
      }
    }
  }
};

export default function makeWebpackConfig({
  watch = true,
  sourcemaps = false,
  debug = false,
  notify = false,
  eslint = false
}) {
  return {
    entry: path.resolve('./src/resources/scripts/main.js'),
    watch,
    mode: debug ? 'development' : 'production',
    output: {
      path: debug ? path.resolve('./dist/assets/scripts/') : path.resolve('./build/assets/scripts/'),
      filename: 'main.min.js',
      pathinfo: false
    },
    devtool: (sourcemaps || !debug) ? '#source-map' : 'eval',
    resolve: {
      modules: [
        'node_modules',
      ],
      extensions: ['.js', '.json']
    },
    module: {
      rules: [
        { test: /\.js$/, exclude: /node_modules/, enforce: 'pre', use: 'source-map-loader' },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: [
            { loader: 'babel-loader' },
            eslint && { loader: 'eslint-loader' },
          ].filter(loader => loader)
        },
        { test: /\.json$/, use: 'json' },
        {
          test: require.resolve('jquery'),
          use: [{
            loader: 'expose-loader',
            options: 'jQuery'
          }, {
            loader: 'expose-loader',
            options: '$'
          }]
        }
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        // dev-mode variable for using in scripts
        __DEV__: JSON.stringify(process.env.NODE_ENV !== 'production'),
      }),
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        Tools: [path.resolve('./src/resources/scripts/_tools.js'), 'Tools']
      })
    ],
  };
}
