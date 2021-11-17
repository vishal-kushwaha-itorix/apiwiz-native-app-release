
# Apiwiz Desktop App

### Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and production.

### Prerequisites
Install latest stable version of [Node](https://nodejs.org/en/download/). The current build requires the below version
```
"node": ">= 10.0.0",
"npm": ">= 6.0.0"
```

### Installing
Clone the project in a folder. Open the folder in command prompt. 
E.g if the project is in `C:\Code\itorix` then run below command in the command prompt.

### Build Setup

```
# install dependencies
npm install

****** Windows
# create .exe file for windows
npm run make

# this will create folder named windows_installer with Apiwiz msi installer
npm run generate


****** iOS
# create bundle for iOS
npm run make-mac

# this will create folder named mac_installer with Apiwiz dmg file
npm run generate-mac
```
### Plugin info
Below is the link for all options to pass with electron-packager command
https://electron.github.io/electron-packager/master/modules/electronpackager.html

### Folder structure

| Path | Description |
| ------------- | ------------- |
| /dist | App's dist folder using which the app will get created |
| /main.js | Main configuration file of the electron. |
| /splash-screen | UI for splash screen |
| /win_build_installer.js | Configuration file for electron-wix-msi |
| /mac_build_installer.js | Configuration file for dmg |
