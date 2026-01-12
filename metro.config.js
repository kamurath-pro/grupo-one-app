const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Ignorar cache do react-native-css-interop para evitar erros no build
config.watchFolders = config.watchFolders || [];
config.resolver = {
  ...config.resolver,
  blockList: [
    ...(config.resolver?.blockList || []),
    /node_modules\/react-native-css-interop\/\.cache\/.*/,
  ],
};

// Temporarily disabled nativewind due to lightningcss compatibility issue
// const { withNativeWind } = require("nativewind/metro");
// module.exports = withNativeWind(config, {
//   input: "./global.css",
//   forceWriteFileSystem: true,
// });

module.exports = config;
