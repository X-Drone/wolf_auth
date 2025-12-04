const { execSync } = require('child_process');
const path = require('path');
const os = require('os');

const venvPath = path.join(__dirname, '..', 'server', 'backend', '.venv');
let pipCommand;

if (os.platform() === 'win32') {
  pipCommand = path.join(venvPath, 'Scripts', 'pip.exe');
} else {
  pipCommand = path.join(venvPath, 'bin', 'pip');
}

try {
  console.log('Installing backend dependencies...');
  execSync(`"${pipCommand}" install -r requirements.txt`, {
    stdio: 'inherit',
    cwd: path.join(__dirname, '..', 'server', 'backend')
  });
  console.log('Backend dependencies installed successfully');
} catch (error) {
  console.error('Error installing backend dependencies:', error.message);
  process.exit(1);
}