const fs = require('fs-extra');
const path = require('path');

async function copyArtifacts() {
  try {
    const sourceDir = path.join(__dirname, '..', 'contracts', 'artifacts', 'contracts', 'MyToken.sol');
    const targetDir = path.join(__dirname, '..', 'app', 'contracts');
    const sourceFile = path.join(sourceDir, 'MyToken.json');
    const targetFile = path.join(targetDir, 'MyToken.json');

    // Ensure target directory exists
    await fs.ensureDir(targetDir);

    // Check if source file exists
    if (await fs.pathExists(sourceFile)) {
      // Copy the artifact
      await fs.copy(sourceFile, targetFile);
      console.log('✅ MyToken.json copied to app/contracts/');
    } else {
      console.log('⚠️ MyToken.json not found. Run contract compilation first.');
    }
  } catch (error) {
    console.error('❌ Error copying artifacts:', error.message);
    process.exit(1);
  }
}

copyArtifacts();
