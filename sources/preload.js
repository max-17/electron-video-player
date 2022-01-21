const { ipcRenderer, contextBridge } = require('electron');

ipcRenderer.invoke('get-files', 'send-files').then((data) => {
    contextBridge.exposeInMainWorld('myAPI', {
        data: data,
    });
});
