const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

// You can get the files' pathes like this when 'open with..' is used
// check preload.js

/*
The process.argv property returns an array containing the command-line 
arguments passed when the Node.js process was launched. 
The first element will be process.execPath. 
The remaining elements will be any additional command-line arguments. (files' path)
*/
if (process.argv.length >= 2) {
    ipcMain.handle('get-files', () => process.argv);
}

function createWindow() {
    const win = new BrowserWindow({
        width: 1000,
        height: 600,
        minWidth: 500,
        minHeight: 400,
        icon: path.join(__dirname, 'icon.ico'),

        webPreferences: {
            // nodeIntegration: true,
            // contextIsolation: false,
            // devTools: !app.isPackaged,
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
