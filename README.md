### Prerequisites
Before you begin, ensure you have the following installed on your system:
 - Node.js and npm (Node Package Manager)

Also, ensure you have a Shelly H&T Gen3 setup with the websocket targetting port 8000 on your PC. 

Guide here: https://kb.shelly.cloud/knowledge-base/shelly-h-t-gen3-web-interface-guide
If you are having issues, double check to make sure you are allowing traffic on port 8000 through your firewall.
If you have this device, but are getting stuck, shoot me a DM and I'll try to help out (@cogs_hq on twitter)

Unfortunately I can't help with other devices as this is the only one I've played around with. 

### 1. Install Node.js and npm
Node.js comes with npm, which you will use to install project dependencies.

1. Download Node.js:
 - Visit the official Node.js website.
 - Download the LTS (Long-term Support) version for your operating system.

2. Install Node.js:
 - Run the installer you downloaded.
 - Follow the installation prompts, accepting default settings.
 - Ensure the option "Add to PATH" is enabled.

3. Verify Installation:
 - Open your bash terminal and run:

```bash
node -v
npm -v
```
 - You should see version numbers for both, confirming a successful installation.

### 2. Set Up the Node.js Application
Navigate to the server directory and install dependencies.

1. Open Terminal and Navigate:

```bash
cd veadotube-temp-tracker/temp-tracker-server
Install Dependencies:
```
2. Install Dependencies
Since package.json is provided in the repository, install the dependencies:

```bash
npm install
```

### 3. Set Up the React Application
Navigate to the web application directory and set it up.

1. Open a New Terminal and Navigate:

```bash
cd veadotube-temp-tracker/temp-tracker-webapps
```
2. Install Dependencies:

```bash
npm install
```

### Configuration
Changing the Veadotube WebSocket Port
By default, the server.js connects to Veadotube via WebSocket on port 5271. If your Veadotube application is running on a different port, you'll need to update the configuration.

1. Open temp-tracker-server/server.js:
2. Search for the reference to 5271
3. Replace 5271 with the port listed in your veadotube instance

Also in server.js, change the name of the states for veadotube to match what you have called them. Mine are called 'Normal' and 'Hot' (case sensitive). You can ctrl-f to find these and change them to match your veadotube :) 

NOTE: You will also need to change the websocket port if you didn't set that to 8000. These are clearly marked in both the server and web applications.

### Starting the Applications
From the root directory (veadotube-temp-tracker), run:

```bash
npm start
```
The thermometer version is hosted at http://localhost:3000/
The digital version is hosted at http://localhost:3000/digitaltemp

There is a backup version in the node app, but it is very basic - http://localhost:5000/
This is just for troubleshooting, or if the react app breaks and you are in a bind!

### Adding to OBS
Add either (or both) of the gauges to OBS as you would any other browser objects.
They are 600x600px, otherwise it can stay as default.
Remember to refresh the cache in there if you play around or restart the applications.

### Troubleshooting
The shelly devices only send updates when the temperature change is over a certain threshold. So you can be waiting on that initial bit of data for quite a while.
Handy tip - just unplug and replug the device to force it to report in for the first time.
Oh - and make sure you have the shelly on power - battery is kinda buggy with them.
