const fs = require('fs');
const path = require('path');

// Function to remove comments from JSON string
function stripJsonComments(jsonString) {
  return jsonString.replace(/\/\/.*|\/\*[\s\S]*?\*\//g, '');
}

async function prepare(_, { nextRelease: { version }, logger }) {
  const appJsonPath = path.resolve('./app.json');
  logger.log(`Updating app.json version to ${version}`);

  try {
    // Read the current app.json
    const appJsonContent = await fs.promises.readFile(appJsonPath, 'utf8');
    
    // Strip comments and parse JSON
    const strippedContent = stripJsonComments(appJsonContent);
    let appJson;
    try {
      appJson = JSON.parse(strippedContent);
    } catch (parseError) {
      logger.error('Error parsing app.json. Please ensure it\'s valid JSON:', parseError);
      throw parseError;
    }

    // Update the version
    appJson.expo.version = version;

    // Increment the Android versionCode
    if (appJson.expo.android && typeof appJson.expo.android.versionCode === 'number') {
      appJson.expo.android.versionCode += 1;
      logger.log(`Incremented Android versionCode to ${appJson.expo.android.versionCode}`);
    } else {
      logger.warn('Android versionCode not found or not a number. Skipping increment.');
    }

    // Update iOS buildNumber to match the version
    if (appJson.expo.ios) {
      appJson.expo.ios.buildNumber = version;
      logger.log(`Updated iOS buildNumber to ${version}`);
    } else {
      logger.warn('iOS configuration not found in app.json. Skipping buildNumber update.');
    }

    // Write back to app.json
    await fs.promises.writeFile(appJsonPath, JSON.stringify(appJson, null, 2));
    logger.log(`Successfully updated app.json version to ${version}`);

  } catch (error) {
    logger.error('Error updating app.json:', error);
    throw error;
  }
}

module.exports = {
  prepare
};