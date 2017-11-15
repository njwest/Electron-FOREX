# Electron-FOREX

An Electron app with React, real-time charting, and a NATS FOREX data stream.

### Installation

1. `git clone git@github.com:njwest/Electron-FOREX.git`
2. Add your own Polygon.io NATS API token to `/app/components/Home.js`
3. Run `npm run dev` to run a development build.
4. Run `npm run package` to package this app for your current platform.
5. Run `npm run package-all` to package this app for all platforms (after consulting the [Electron multi-platform build docs](https://www.electron.build/multi-platform-build))

### About

This project was initiated on November 15, 2017, and is in an early development stage. Real-time charting, NATS data subscription, and React all work, however, so feel free to check it out!

## TODO Manifest

1. Add dynamic currency selection (Currently, 'AUD/USD' is hardcoded into Home.js component state).
2. Improve/make X-axis labelling more descriptive/useful.
3. Fix styling for X- and Y- axes labels.
4. Add performance improvements, especially to Y axis constraint calculator (with conditionals).
5. Abstract Home.js into child components.
6. Add FOREX bid/ask history access.
7. Add transaction tracking pie chart.
8. Improve UI/CSS overall.
9. Add customizable data persistence, to local DB or fs (excel generating? chart image generating?).
