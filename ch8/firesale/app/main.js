const { app, BrowserWindow, dialog, Menu } = require('electron');
const applicationMenu = require('./application-menu')
const fs = require('fs')

let mainWindow = null;
const windows = new Set()
const openFiles = new Map()

app.on('ready', () => {
    Menu.setApplicationMenu(applicationMenu)
    createWindow()
})

const getFileFromUser = exports.getFileFromUser = (targetWindow) => {
    const files = dialog.showOpenDialog(targetWindow, {
        properties: ['openFile'],
        filters: [
            { name: 'Text Files', extensions: ['txt'] },
            { name: 'Markdown Files', extensions: ['md', 'markdown'] }
        ]
    });

    if (files) openFile(targetWindow, files[0])
}

const openFile = (targetWindow, file) => {
    const content = fs.readFileSync(file).toString()
    app.addRecentDocument(file)
    targetWindow.setRepresentedFilename(file)
    targetWindow.webContents.send('file-opened', file, content)
}

let createWindow = exports.createWindow = () => {
    let x, y

    const currentWindow = BrowserWindow.getFocusedWindow()

    if (currentWindow) {
        const [ currentWindowX, currentWindowY ] = currentWindow.getPosition()
        x = currentWindowX + 10
        y = currentWindowY + 10
    }

    let newWindow = new BrowserWindow({ x, y, show: false })

    newWindow.loadURL(`file://${__dirname}/index.html`)

    newWindow.once('ready-to-show', () => newWindow.show())

    newWindow.on('closed', () => {
        windows.delete(newWindow)
        stopWatchingFile(newWindow)
        newWindow = null
    })

    newWindow.on('close', (event) => {
        if (newWindow.isDocumentEdited()) {
            event.preventDefault()

            const result = dialog.showMessageBox(newWindow, {
                type: "warning",
                title: "Quit with unsaved changes?",
                message: "Your changes will be lost",
                buttons: [ 'Quit', 'Cancel' ],
                deafultId: 0,
                cancelId: 1
            })

            if (result === 0) newWindow.destroy()
        }
    })

    windows.add(newWindow)
    return newWindow
}

app.on('will-finish-launching', () => {
    app.on('open-file', (event, file) => {
        const win = createWindow()
        win.once('ready-to-show', () => {
            openWith(win, file)
        })
    })
})

const saveHTML = exports.saveHTML = (targetWindow, content) => {
    const file = dialog.showSaveDialog(targetWindow, {
        title: 'Save HTML',
        defaultPath: app.getPath('documents'),
        filters: [
            { name: 'HTML Files', extensions: ['html', 'htm'] }
        ]
    })

    if (!file) return;

    fs.writeFileSync(file, content)
}

const saveMarkdown = exports.saveMarkdown = (targetWindow, file, content) => {
    if (!file){
        file = dialog.showSaveDialog(targetWindow, {
            title: 'Save Markdown',
            defaultPath: app.getPath('documents'),
            filters: [
                { name: 'Markdown Files', extentions: ['md', 'markdown'] }
            ]
        })
    }

    if (!file) return;

    fs.writeFileSync(file, content)
    openFile(targetWindow, file)
}

const startWatchingFile = (targetWindow, file) => {
    stopWatchingFile(targetWindow)

    const watcher = fs.watchFile(file, (event) => {
        if (event === 'change') {
            const content = fs.readFileSync(file)
            targetWindow.webContents.send('file-changed', file, content)
        }
    })

    openFiles.set(targetWindow, watcher)
}

const stopWatchingFile = (targetWindow) => {
    if (openFiles.has(targetWindow)) {
        openFiles.get(targetWindow).stop()
        openFiles.delete(targetWindow)
    }
}

