const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Add react-syntax-highlighter and its dependencies to extraNodeModules
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  'react-syntax-highlighter': require.resolve('react-syntax-highlighter'),
  'highlight.js': require.resolve('highlight.js'),
  'prismjs': require.resolve('prismjs'),
};

// Add necessary extensions
config.resolver.sourceExts.push('css');
config.resolver.assetExts.push('mts');

// // Ensure that the syntax highlighter styles are transpiled
// config.transformer.babelTransformerPath = require.resolve('react-native-css-transformer');

module.exports = withNativeWind(config, { input: './global.css' });