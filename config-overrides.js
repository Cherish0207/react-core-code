const { override } = require("customize-cra");

const alter_config = () => (config, env) => {
  const oneOf_loc = config.module.rules.findIndex((n) => n.oneOf);
  config.module.rules[oneOf_loc].oneOf = [
    {
      test: /\.(js|mjs|jsx|ts|tsx)$/,
      // include: paths.appSrc,
      loader: require.resolve("babel-loader"),
      options: {
        customize: require.resolve("babel-preset-react-app/webpack-overrides"),
        presets: [
          [
            require.resolve("babel-preset-react-app"),
            // {
            //   runtime: hasJsxRuntime ? 'automatic' : 'classic',
            // },
          ],
        ],
      },
    },
    ...config.module.rules[oneOf_loc].oneOf,
  ];

  return config;
};

module.exports = {
  webpack: override(
    alter_config() //将自定义配置组合进来
    // addWebpackAlias({
    //   //增加路径别名的处理
    //   "@": path.resolve("./src"),
    // }),
    // fixBabelImports("import", {
    //   //antd UI组件按需加载的处理
    //   libraryName: "antd",
    //   libraryDirectory: "es",
    //   style: "css",
    // })
  ),
};
