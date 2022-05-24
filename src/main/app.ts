import { app, BrowserWindow, dialog, autoUpdater,ipcMain } from 'electron';
import { createAppWindow } from './appWindow';
import { expressStartApp } from '@src/server/server';
import {
  openArticleFolder,
  openArticleTemplateFile,
  openDiaryFolder,
  openDiaryTemplateFile,
  openFolder,
} from '@src/fileio/file';

/** Handle creating/removing shortcuts on Windows when installing/uninstalling. */
if (require('electron-squirrel-startup')) {
  app.quit();
}

/**
 * This method will be called when Electron has finished
 * initialization and is ready to create browser windows.
 * Some APIs can only be used after this event occurs.
 */
app.on('ready', createAppWindow);

/**
 * Emitted when the application is activated. Various actions can
 * trigger this event, such as launching the application for the first time,
 * attempting to re-launch the application when it's already running,
 * or clicking on the application's dock or taskbar icon.
 */
app.on('activate', () => {
  /**
   * On OS X it's common to re-create a window in the app when the
   * dock icon is clicked and there are no other windows open.
   */
  if (BrowserWindow.getAllWindows().length === 0) {
    createAppWindow();
  }
});

/**
 * Emitted when all windows have been closed.
 */
app.on('window-all-closed', () => {
  /**
   * On OS X it is common for applications and their menu bar
   * to stay active until the user quits explicitly with Cmd + Q
   */
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

console.log(app.getPath('userData'));

/**
 * In this file you can include the rest of your app's specific main process code.
 * You can also put them in separate files and import them here.
 */
expressStartApp();

// dialog open系はipc経由じゃないと動かない
ipcMain.handle('folder-open', async (ev) => {
  return openFolder();
});

ipcMain.handle('openDiaryFolder',  (ev,arg) => {
  return openDiaryFolder(arg);
});

ipcMain.handle('openArticleFolder',  (ev,arg) => {
  return openArticleFolder(arg);
});

ipcMain.handle('openDiaryTemplat eFile',  (ev,arg) => {
  return openDiaryTemplateFile(arg);
});

ipcMain.handle('openArticleTemplateFile',  (ev,arg) => {
  return openArticleTemplateFile(arg);
});

// ファイルの末尾に追加
const server = 'https://update.electronjs.org'
const feed = `${server}/reud/hugo-text-editor/${process.platform}-${process.arch}/${app.getVersion()}`


if (app.isPackaged) {
  autoUpdater.setFeedURL({
    url: feed,
  })
  autoUpdater.checkForUpdates();

  autoUpdater.on("update-downloaded", async () => {
    const returnValue = await dialog.showMessageBox({
      message: "アップロードあり",
      detail: "再起動してインストール出来ます。",
      buttons: ["再起動","後で"],
    });
    if (returnValue.response === 0) {
      autoUpdater.quitAndInstall();
    }
  });

  autoUpdater.on("update-available", () => {
    dialog.showMessageBox({
      message: "アップデートがあります。",
      buttons: ["OK"],
    });
  });
  autoUpdater.on("update-not-available", () => {
    autoUpdater.on("error",() => {
      dialog.showMessageBox({
        message: "アップデートエラーが起きました",
        buttons: ["OK"],
      })
    })
  })
}


