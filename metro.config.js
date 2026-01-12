const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Temporarily disabled nativewind due to lightningcss compatibility issue
// const { withNativeWind } = require("nativewind/metro");
// module.exports = withNativeWind(config, {
//   input: "./global.css",
//   forceWriteFileSystem: true,
// });

module.exports = config;
