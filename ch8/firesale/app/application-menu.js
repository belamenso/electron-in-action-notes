const { app, BrowserWindow, Menu, shell } = require('electron')
const mainProcess = require('./main')

const template = [
    {
        label: 'File',
        submenu: [
            {
                label: 'New File',
                accelerator: 'CommandOrControl+N',
                click() {
                    mainProcess.createWindow();
                }
            },
            {
                label: 'Open File',
                accelerator: 'CommandOrControl+O',
                click(item, focusedWindow) {
                    mainProcess.getFileFromUser(focusedWindow);
                },
            },
            {
                label: 'Save File',
                accelerator: 'CommandOrControl+S',
                click(item, focusedWindow) {
                    mainProcess.saveMarkdown(focusedWindow);
                },
            },
            {
                label: 'Export HTML',
                accelerator: 'Shift+CommandOrControl+S',
                click(item, focusedWindow) {
                    mainProcess.saveHtml(focusedWindow);
                },
            },
            { type: 'separator' }, //
            {
                label: 'Show File',
                accelerator: 'Shift+CommandOrControl+S',
                click(item, focusedWindow) {
                    if (!focusedWindow) { //
                        return dialog.showErrorBox(
                            'Cannot Show File\'s Location',
                            'There is currently no active document show.'
                        );
                    }
                    focusedWindow.webContents.send('show-file'); //
                },
            },
            {
                label: 'Open in Default Editor',
                accelerator: 'Shift+CommandOrControl+S',
                click(item, focusedWindow) {
                    if (!focusedWindow) {
                        return dialog.showErrorBox(
                            'Cannot Open File in Default Editor',
                            'There is currently no active document to open.'
                        );
                    }
                    focusedWindow.webContents.send('open-in-default'); //
                },
            },
        ],
    },
    {
        label: 'Edit',
        submenu: [
            {
                label: 'Undo',
                accelerator: 'CommandOrControl+Z',
                role: 'undo',
            },
            {
                label: 'Redo',
                accelerator: 'Shift+CommandOrControl+Z',
                role: 'redo',
            },
            { type: 'separator' },
            {
                label: 'Cut',
                accelerator: 'CommandOrControl+X',
                role: 'cut',
            },
            {
                label: 'Copy',
                accelerator: 'CommandOrControl+C',
                role: 'copy',
            },
            {
                label: 'Paste',
                accelerator: 'CommandOrControl+V',
                role: 'paste',
            },
            {
                label: 'Select All',
                accelerator: 'CommandOrControl+A',
                role: 'selectall',
            },
        ],
    },
    {
        label: 'Window',
        submenu: [
            {
                label: 'Minimize',
                accelerator: 'CommandOrControl+M',
                role: 'minimize',
            },
            {
                label: 'Close',
                accelerator: 'CommandOrControl+W',
                role: 'close',
            },
        ],
    },
    {
        label: 'Help',
        role: 'help',
        submenu: [
            {
                label: 'Visit Website',
                click() { /* To be implemented */ }
            },
            {
                label: 'Toggle Developer Tools',
                accelerator: 'CommandOrControl+Shift+i',
                click(item, focusedWindow) {
                    if (focusedWindow) focusedWindow.webContents.toggleDevTools();
                }
            }
        ],
    }
];

if (process.platform === 'darwin') {
    const name = app.getName();
    template.unshift({ label: name });
}

module.exports = Menu.buildFromTemplate(template);
