const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function runCommand(cmd) {
  try {
    execSync(cmd, { stdio: 'inherit' });
  } catch (error) {
    console.error(`Failed to run: ${cmd}`);
    process.exit(1);
  }
}

// Only run on Vercel
if (process.env.VERCEL || process.env.CI) {
  console.log('🔄 Fetching private packages...');
  
  const token = process.env.GITHUB_REPO_CLONE_TOKEN;
  
  if (!token) {
    console.error('❌ GITHUB_REPO_CLONE_TOKEN environment variable not set');
    process.exit(1);
  }
  
  const packagesDir = path.join(__dirname, '..', 'packages');
  
  // Ensure packages directory exists
  if (!fs.existsSync(packagesDir)) {
    fs.mkdirSync(packagesDir, { recursive: true });
  }
  
  // Clean existing directories if they exist
  const nextUtilsDir = path.join(packagesDir, 'next-utils');
  const uiDir = path.join(packagesDir, 'ui');
  
  if (fs.existsSync(nextUtilsDir)) {
    console.log('🧹 Removing existing next-utils directory...');
    fs.rmSync(nextUtilsDir, { recursive: true, force: true });
  }
  
  if (fs.existsSync(uiDir)) {
    console.log('🧹 Removing existing ui directory...');
    fs.rmSync(uiDir, { recursive: true, force: true });
  }
  
  // Clone NextUtils
  console.log('📦 Cloning NextUtils...');
  runCommand(
    `git clone --depth 1 https://${token}@github.com/DonaldNgai/NextUtils.git ${nextUtilsDir}`
  );
  
  // Clone ChakraUI
  console.log('📦 Cloning ChakraUI...');
  runCommand(
    `git clone --depth 1 https://${token}@github.com/DonaldNgai/ChakraUI.git ${uiDir}`
  );
  
  console.log('✅ Private packages fetched successfully');
} else {
  console.log('⏭️  Local development - using existing packages');
}

