const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

const config = getDefaultConfig(__dirname);

// BR-OFFLINE: expo-sqlite web cần Metro phục vụ file .wasm (wa-sqlite)
config.resolver.assetExts.push('wasm');

// Add shared package to watchFolders so Metro can watch it
config.watchFolders = [
  ...(config.watchFolders || []),
  path.resolve(__dirname, '../packages/shared'),
];

// Resolve @cook/shared to packages/shared/src for Metro bundler (web build)
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === '@cook/shared' || moduleName.startsWith('@cook/shared/')) {
    let resolvedPath;
    if (moduleName === '@cook/shared') {
      resolvedPath = path.resolve(__dirname, '../packages/shared/src/index.ts');
    } else {
      const subPath = moduleName.replace('@cook/shared/', '');
      resolvedPath = path.resolve(__dirname, '../packages/shared/src/' + subPath + '.ts');
    }
    return {
      filePath: resolvedPath,
      type: 'sourceFile',
    };
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = withNativeWind(config, { input: './global.css' });
