import {app, BrowserWindow, ipcMain, dialog, Menu} from 'electron';

const fs = require('fs');
const path = require('path');

// const {download} = require('electron-dl');
let fileDownloadPath = path.join(app.getPath("downloads"), ".vue_qq_by_bot/");
if (!fs.existsSync(fileDownloadPath)) {
    fs.mkdirSync(fileDownloadPath)
}

const DownloadManager = require("../renderer/assets/js/file-downloader");
DownloadManager.register({
    downloadFolder: fileDownloadPath,
});


/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
    global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow;
const winURL = process.env.NODE_ENV === 'development'
    ? `http://localhost:9080`
    : `file://${__dirname}/index.html`;

function createWindow() {
    /**
     * Initial window options
     */
    // console.log("__static", __static);

    mainWindow = new BrowserWindow({
        width: 375,
        height: 667,
        // width: 450,
        // height: 800,
        useContentSize: false,
        frame: false,
        webPreferences: {
            webSecurity: false
        }
    });

    mainWindow.loadURL(winURL);

    // mainWindow.once('ready-to-show', () => {
    //     mainWindow.reload();
    //     console.log('reloaded');
    // });

    // setTimeout(() => {
    //     mainWindow.webContents.openDevTools();
    //     mainWindow.reload()
    // }, 1000);

    mainWindow.on('closed', () => {
        mainWindow = null
    })
}

app.commandLine.appendSwitch('disable-web-security');

app.on('ready', () => {
    createWindow();
    Menu.setApplicationMenu(null);
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow()
    }
});

let downloadRecord = new Set();

ipcMain.on('download-file', async (event, {url, options}) => {
    // const win = BrowserWindow.getFocusedWindow();
    // console.log("win", mainWindow);
    // console.log("mainWin", mainWindow);
    let uid = `${options.filename}_${url}`;
    if (downloadRecord.has(uid)) {
        // console.log("already has a download ask", uid);
        return
    }
    downloadRecord.add(uid);

    // console.log("main process recieve download", options.filename, downloadRecord);
    try {
        // console.log('Begin from main', url);
        // console.log('options', options);
        // console.log('onProgress', options.onProgress);
        options.onProgress = function (progressData) {
            mainWindow.webContents.send("download-progress", {
                options,
                progressData,
            });
        };

        options.onStarted = function () {
            mainWindow.webContents.send("download-start", {
                options,
            });
        };

        options.onCancel = function () {
            mainWindow.webContents.send("download-cancel", {
                options,
            });
        };

        options.url = url;
        options.path = options.filename;
        DownloadManager.download(options, (error, data) => {
            if (error) {
                mainWindow.webContents.send("download-error", {
                    options,
                });
            } else {
                mainWindow.webContents.send("download-finish", {
                    options,
                    filePath: data.filePath,
                });
            }
            downloadRecord.delete(uid);
        });

        // console.log('Done');
    } catch (e) {
        console.error(e)
    }
});

ipcMain.on('open-dialog', async (event, {options}) => {
    // const win = BrowserWindow.getFocusedWindow();
    // console.log("win", mainWindow);
    // console.log("mainWin", mainWindow);

    // console.log("main process recieve open dialog", options);
    try {
        dialog.showOpenDialog(options, (filePaths) => {
            // console.log("send open dialog successful callback");
            mainWindow.webContents.send("openDialog-finish", {
                options,
                filePaths,
            });
        });
    } catch (e) {
        console.error(e)
    }
});

ipcMain.on('get-download-path', (event) => {
    event.returnValue = fileDownloadPath;
});

ipcMain.on('close-main-window', async (event) => {
    mainWindow.close();
});

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
