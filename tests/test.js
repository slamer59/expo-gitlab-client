
const prepare = require('../update-expo-version');

// Mocking the input for `prepare` function
const mockContext = {
  nextRelease: {
    version: '1.X22.32', // Example version for testing
  },
  logger: {
    log: console.log,
    error: console.error,
  },
};

// Call the function
(async () => {
  try {
    await prepare(null, mockContext);
    console.log('app.json updated successfully.');
  } catch (error) {
    console.error('Failed to update app.json:', error);
  }
})();


// ... existing code...
