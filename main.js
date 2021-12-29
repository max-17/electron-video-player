const { app, BrowserWindow } = require('electron');

const path = require('path');

function createWindow() {
    const win = new BrowserWindow({
        width: 900,
        height: 650,
        minWidth: 500,
        minHeight: 400,
        title: 'Video player',
        webPreferences: {
            preload: path.join(__dirname, 'sources/preload.js'),
        },
    });
    win.menuBarVisible = false;
    win.loadFile('index.html');
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
