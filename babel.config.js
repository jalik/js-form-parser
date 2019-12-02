module.exports = (api) => {
  const presets = [
    '@babel/preset-env',
  ];
  const plugins = [];

  api.cache.forever();

  return {
    presets,
    plugins,
  };
};
