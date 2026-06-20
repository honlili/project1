/**
 * Double Cert Management System - Cross-Platform Launcher
 * Usage: node launcher.js
 */

const { spawn } = require('child_process');
const path = require('path');
const os = require('os');
const fs = require('fs');

const rootDir = __dirname;
const isWindows = os.platform() === 'win32';

console.log('');
console.log('========================================');
console.log('  Double Cert Management System');
console.log('  Cross-platform Launcher');
console.log('========================================');
console.log('');

if (!fs.existsSync(path.join(rootDir, 'backend', 'package.json'))) {
    console.error('[ERROR] backend/package.json not found!');
    process.exit(1);
}
if (!fs.existsSync(path.join(rootDir, 'frontend', 'package.json'))) {
    console.error('[ERROR] frontend/package.json not found!');
    process.exit(1);
}

const backendModules = path.join(rootDir, 'backend', 'node_modules');
const frontendModules = path.join(rootDir, 'frontend', 'node_modules');

if (!fs.existsSync(backendModules) || !fs.existsSync(frontendModules)) {
    console.log('[INFO] node_modules not found. Please wait, installing...');
    console.log('[INFO] This may take a few minutes on first run.');
    console.log('');
}

let backendProcess = null;
let frontendProcess = null;

console.log('[1/3] Starting backend service (http://localhost:5000) ...');
const backendCmd = isWindows ? 'cmd' : 'sh';
const backendArgs = isWindows
    ? ['/c', 'cd /d ' + path.join(rootDir, 'backend') + ' && npm.cmd run demo']
    : ['-c', 'cd ' + path.join(rootDir, 'backend') + ' && npm run demo'];

backendProcess = spawn(backendCmd, backendArgs, {
    stdio: 'inherit',
    shell: false,
    cwd: rootDir
});

setTimeout(() => {
    console.log('');
    console.log('[2/3] Starting frontend service (http://localhost:3000) ...');

    const frontendCmd = isWindows ? 'cmd' : 'sh';
    const frontendArgs = isWindows
        ? ['/c', 'set BROWSER=none && cd /d ' + path.join(rootDir, 'frontend') + ' && npm.cmd start']
        : ['-c', 'BROWSER=none cd ' + path.join(rootDir, 'frontend') + ' && npm start'];

    frontendProcess = spawn(frontendCmd, frontendArgs, {
        stdio: 'inherit',
        shell: false,
        cwd: rootDir
    });

    setTimeout(() => {
        console.log('');
        console.log('========================================');
        console.log('  Startup Complete!');
        console.log('  Backend: http://localhost:5000');
        console.log('  Frontend: http://localhost:3000');
        console.log('  Demo Account: admin / admin123');
        console.log('========================================');
        console.log('');
        console.log('Please open your browser and visit:');
        console.log('  http://localhost:3000');
        console.log('');
        console.log('Press Ctrl+C to stop all services.');
        console.log('');
    }, 10000);
}, 5000);

function cleanup() {
    console.log('\nStopping services...');
    if (backendProcess) {
        try { backendProcess.kill('SIGTERM'); } catch (e) {}
        try { backendProcess.kill('SIGKILL'); } catch (e) {}
    }
    if (frontendProcess) {
        try { frontendProcess.kill('SIGTERM'); } catch (e) {}
        try { frontendProcess.kill('SIGKILL'); } catch (e) {}
    }
    if (isWindows) {
        try {
            spawn('taskkill', ['/F', '/IM', 'node.exe'], { stdio: 'ignore' });
        } catch (e) {}
    }
    process.exit(0);
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
