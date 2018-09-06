const path = require('path');
const { app, BrowserWindow, globalShortcut, Menu, Tray, systemPreferences, clipboard } = require('electron');

let tray = null;
const clippings = []

app.on('ready', () => {
	browserWindow = new BrowserWindow({ show: false })
	browserWindow.loadURL(`file://${__dirname}/index.html`)

    tray = new Tray(path.join(__dirname, '/Icon.png'))

    const activationShortcut = globalShortcut.register('CommandOrControl+Shift+M', () => {
        tray.popUpContextMenu();
    });

    if (!activationShortcut) console.error('Global activation shortcut failed to register');

    const newClippingShortcut = globalShortcut.register('CommandOrControl+Shift+Option+C', () => {
        addClipping();
    });

    if (!newClippingShortcut) console.error('Global new clipping shortcut failed to register'); //

    updateMenu()
})

const updateMenu = () => {
    const menu = Menu.buildFromTemplate([
        {
            label: 'Create New Clipping',
            accelerator: 'CommandOrControl+Shift+C',
            click() { addClipping() }
        },
        { type: 'separator' },
        ...clippings.slice(0, 10).map(createClippingMenuItem),
        { type: 'separator' },
        {
            label: 'Quit',
            click() { app.quit(); },
            accelerator: 'CommandOrControl+Q'
        }
    ])

    tray.setToolTip('Clipmaster')

    tray.setContextMenu(menu)
};

const addClipping = () => {
    const clipping = clipboard.readText()
    if (clippings.includes(clipping)) return;
    clippings.unshift(clipping)
    updateMenu()

	browserWindow.webContents.send('show-notification', 'Clipping Added', clipping)

    return clipping
}

const createClippingMenuItem = (clipping, index) => {
    return {
        label: (clipping.length > 20 ? clipping.slice(0,20) + '...' : clipping),
        accelerator: `CommandOrControl+${index}`,
        click() { clipboard.writeText(clipping) },
    }
}

