const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Add react-syntax-highlighter to extraNodeModules
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  'react-syntax-highlighter': require.resolve('react-syntax-highlighter'),
};

config.resolver.assetExts.push("mts");

module.exports = withNativeWind(config, { input: './global.css' });
