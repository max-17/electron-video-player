const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

// You can get the dragged file's path like this
if (process.argv.length >= 2) {
    ipcMain.handle('get-files', (event, someArgument) => process.argv);
}

function createWindow() {
    const win = new BrowserWindow({
        width: 1000,
        height: 600,
        minWidth: 500,
        minHeight: 400,

        webPreferences: {
            // nodeIntegration: true,
            // contextIsolation: false,
            devTools: !app.isPackaged,
            preload: path.join(__dirname, 'sources/preload.js'),
        },
    });
    win.menuBarVisible = false;
    win.loadFile('index.html');

    // Open the DevTools.
    // win.webContents.openDevTools();
}

app.whenReady().then((event, argv) => {
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
