# architect

Build VR with VR. Use Vive or Rift to craft a world directly with your hands.

Built with [A-Frame](https://aframe.io).

![Screenshot](https://cloud.githubusercontent.com/assets/674727/25252157/cda4ef46-25d0-11e7-8e1b-7010b4e358c1.png)

## Local Development

Architect uses [Webpack](https://webpack.github.io/).

```sh
npm install
npm run start
```

## Developer Tools

Use [aframe-motion-capture-components](https://aframe.io/blog/motion-capture/)
to record tests in VR and replay them on normal desktop mode. Architect comes
with several recordings used for development and testing in the `recordings/`
folder. Many of them will mostly be outdated as the application's UX changes.

Install [Redux Developer
Tools](https://github.com/zalmoxisus/redux-devtools-extension) to get a
detailed view of the application state at run time.

### Dependencies

- [aframe-react](https://github.com/aframevr/aframe-react)
- [preact](https://github.com/developit/preact)
- [redux](https://github.com/reactjs/redux)
