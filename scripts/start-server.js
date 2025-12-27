const { exec } = require('child_process');
const path = require('path');
const os = require('os');

const backendDir = path.join(__dirname, '..', 'server', 'backend');

let pythonCommand;
if (os.platform() === 'win32') {
  pythonCommand = path.join(backendDir, '.venv', 'Scripts', 'python.exe');
} else {
  pythonCommand = path.join(backendDir, '.venv', 'bin', 'python');
}

const command = `"${pythonCommand}" -m uvicorn --app-dir src main:app --reload --host 0.0.0.0 --port 3003`;

console.log('Starting server with command:', command);

exec(command, { cwd: backendDir, stdio: 'inherit' }, (error) => {
  if (error) {
    console.error(`Server execution error: ${error.message}`);
    process.exit(1);
  }
});