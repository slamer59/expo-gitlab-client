const fs = require('fs');
const path = require('path');

async function prepare(_, {nextRelease: {version}, logger}) {
  const appJsonPath = path.resolve('./app.json');
  
  try {
    // Read the current app.json
    const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));
    
    // Update the version
    appJson.expo.version = version;
    
    // Increment the Android versionCode
    if (appJson.expo.android && typeof appJson.expo.android.versionCode === 'number') {
      appJson.expo.android.versionCode += 1;
    }
    
    // Write back to app.json
    fs.writeFileSync(appJsonPath, JSON.stringify(appJson, null, 2));
    
    logger.log('Updated app.json version to %s', version);
  } catch (error) {
    logger.error('Error updating app.json: %O', error);
    throw error;
  }
}

module.exports = {prepare};
