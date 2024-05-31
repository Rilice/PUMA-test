const { app, BrowserWindow } = require('electron');
const path = require('node:path');

//const { updateElectronApp, UpdateSourceType } = require('update-electron-app');
//const { autoUpdater } = require("electron-updater");

//Autoupdater test v2.0.5
//const { autoUpdater } = require('update-electron-app');

//electron-updater
const { autoUpdater } = require("electron-updater")
const log = require('electron-log');
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';

const { dialog } = require('electron')

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
// if (require('electron-squirrel-startup')) {
//   app.quit();
// }
// setInterval(() => {
//   autoUpdater.checkForUpdates()
// }, 60000)

autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
  const dialogOpts = {
    type: 'info',
    buttons: ['Перезапутить', 'Позже...'],
    title: 'Обновление приложения',
    message: process.platform === 'win32' ? releaseNotes : releaseName,
    detail:
      'Новая версия приложения была успешно загружена. Перезапустите приложение, чтобы обновить.'
  }

  dialog.showMessageBox(dialogOpts).then((returnValue) => {
    if (returnValue.response === 0) autoUpdater.quitAndInstall()
  })
})

autoUpdater.on('error', (message) => {
  console.error('There was a problem updating the application')
  console.error(message)
})

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // and load the index.html of the app.
  //mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  //mainWindow.webContents.openDevTools();
  
  //mainWindow.setMenuBarVisibility(false);
  
  // Development 
  //mainWindow.loadURL('http://localhost:3000')
  // Production
  mainWindow.loadFile(path.join(__dirname,'index.html'))
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('ready', async () => {
  autoUpdater.checkForUpdatesAndNotify();
}); 

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
