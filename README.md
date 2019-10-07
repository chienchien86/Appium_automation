# Appium AutoTest

### Docs



### Install 
1. follow the install steps in the docs and install Appium on your machine
2. `cd report-viewer/ && npm install && npm run build`
3. `cd server/ && npm install`

### Run 
1. make sure appium server is already open `appium`
1. go to the server folder `cd server`
2. run the server `npm start`
3. open http://localhost:3000

### Others
- You can use server/deleteRedundentImage.js to delete useless image
`cd server`
`NODE_ENV=production node deleteRedundentImage.js`

- App install package are store in server/appbinary
.app folder is for iOS emulator
.ipa file is for iOS real device
.apk is for android emulator/real device

