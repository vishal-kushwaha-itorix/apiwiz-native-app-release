const { app, BrowserWindow, Menu, shell, ipcMain } = require("electron");
const serve = require("electron-serve");
const path = require("path");
const loadURL = serve({ directory: "dist" });

const settings = require("electron-settings");

require("update-electron-app")();

let mainWindow;
let splash;

(async () => {
	await app.whenReady();

	mainWindow = new BrowserWindow({
		show: false,
		webPreferences: {
			nodeIntegration: false,
			contextIsolation: true,
			enableRemoteModule: false,
			preload: path.join(__dirname, "preload.js"),
		},
	});

	splash = new BrowserWindow({
		width: 810,
		height: 610,
		transparent: true,
		frame: false,
		alwaysOnTop: true,
	});
	await splash.loadURL(`file://${__dirname}/splash-screen/index.html`);
	await loadURL(mainWindow);

	ipcMain.on("getDataFromMainProcess", async (event, arg) => {
		const data = await settings.get("data");
		event.returnValue = data;
	});

	// The above is equivalent to this:
	await mainWindow.loadURL("app://-");

	ipcMain.on("setData", async (event, args) => {
		await settings.set("data", {
			[args.cookieName]: {
				name: args.cookieName,
				value: args.cookieValue,
				domain: "." + args.cookieDomain,
			},
		});
		event.returnValue = "Data saved";
	});

	ipcMain.on("eraseCookie", async (event, args) => {
		await settings.set("data", {});
		event.returnValue = "Cookie removed";
	});

	mainWindow.maximize();
	const isMac = process.platform === "darwin";

	const menuTemplate = [
		// { role: 'appMenu' }
		...(isMac
			? [
					{
						label: app.name,
						submenu: [
							{
								role: "about",
							},
							{
								type: "separator",
							},
							{
								role: "services",
							},
							{
								type: "separator",
							},
							{
								role: "hide",
							},
							{
								role: "hideothers",
							},
							{
								role: "unhide",
							},
							{
								type: "separator",
							},
							{
								role: "quit",
							},
						],
					},
			  ]
			: []),
		// { role: 'fileMenu' }
		{
			label: "File",
			submenu: [
				isMac
					? {
							role: "close",
					  }
					: {
							role: "quit",
					  },
			],
		},
		// { role: 'editMenu' }
		{
			label: "Edit",
			submenu: [
				{
					role: "undo",
				},
				{
					role: "redo",
				},
				{
					type: "separator",
				},
				{
					role: "cut",
				},
				{
					role: "copy",
				},
				{
					role: "paste",
				},
				...(isMac
					? [
							{
								role: "pasteAndMatchStyle",
							},
							{
								role: "delete",
							},
							{
								role: "selectAll",
							},
							{
								type: "separator",
							},
							{
								label: "Speech",
								submenu: [
									{
										role: "startSpeaking",
									},
									{
										role: "stopSpeaking",
									},
								],
							},
					  ]
					: [
							{
								role: "delete",
							},
							{
								type: "separator",
							},
							{
								role: "selectAll",
							},
					  ]),
			],
		},
		// { role: 'viewMenu' }
		{
			label: "View",
			submenu: [
				{
					role: "reload",
				},
				{
					role: "forceReload",
				},
				{
					role: "toggleDevTools",
				},
				{
					type: "separator",
				},
				{
					role: "resetZoom",
				},
				{
					role: "zoomIn",
				},
				{
					role: "zoomOut",
				},
				{
					type: "separator",
				},
				{
					role: "togglefullscreen",
				},
			],
		},
		// { role: 'windowMenu' }
		{
			label: "Window",
			submenu: [
				{
					role: "minimize",
				},
				{
					role: "zoom",
				},
				...(isMac
					? [
							{
								type: "separator",
							},
							{
								role: "front",
							},
							{
								type: "separator",
							},
							{
								role: "window",
							},
					  ]
					: [
							{
								role: "close",
							},
					  ]),
			],
		},
		{
			role: "help",
			submenu: [
				{
					label: "Learn More",
					click: async () => {
						await shell
							.openExternal("http://beta.apiwiz.io")
							.catch((err) =>
								console.log("Error while opening website: " + err)
							);
					},
				},
			],
		},
	];

	const menu = Menu.buildFromTemplate(menuTemplate);
	Menu.setApplicationMenu(menu);
	splash.destroy();

	mainWindow.show();

	// mainWindow.loadURL(url.format({
	// 	pathname: path.join(__dirname, './dist/index.html'),
	// 	protocol: 'file:',
	// 	slashes: true,
	//   }))
	// The `-` is just the required hostname
})();

// const electron = require("electron");
// const app = electron.app;
// const BrowserWindow = electron.BrowserWindow;
// const serve = require('electron-serve');
// //const {app, BrowserWindow} = require('electron')
// const path = require('path')
// const url = require('url')
// const loadURL = serve({directory: 'itorix'});

// // process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

// let win;

// function createWindow () {

//   win = new BrowserWindow({width: 800, height: 600})

//   win.loadURL(url.format({
//     pathname: path.join(__dirname, '/itorix/index.html'),
//     protocol: 'http',
//     slashes: true
//   }));

//   win.on('closed', () => {
//     win = null
//   });
// }

// app.on('ready', createWindow);

// app.on('window-all-closed', () => {
//   if (process.platform !== 'darwin') {
//     app.quit();
//   }
// });

// app.on('activate', () => {
//   if (win === null) {
//     createWindow();
//   }
// });
