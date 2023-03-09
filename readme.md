# cesium-based vector field visualization for gpu-accelerated particle systems

! [npm](https://img.shields.io/npm/v/cesium-particle) ! [npm](https://img.shields.io/npm/dt/cesium-particle) ! [GitHub](https://img.shields.io/github/license/hongfaqiu/cesium-particle)

## Description

This module is adapted from the [RaymanNg big man's wind farm demo](https://github.com/RaymanNg/3D-Wind-Field).

The loaded .nc file belongs to NetCDF version 3 data file, to load other .nc files please see [Q&A](https://github.com/hongfaqiu/cesium-particle#%E6%80%8E%E6%A0%B7%E5%8A%A0%E8%BD%BD% E8%87%AA%E5%B7%B1%E7%9A%84nc%E6%96%87%E4%BB%B6).

The demo.nc file used in this example has a resolution of 28km, see the data on this website [Panoply](https://www.giss.nasa.gov/tools/panoply/)

## Instructions for use

<table>
<tbody valign=top align=left>
<tr><th>
Node 12+
</th><td>

Install with <code>npm install cesium-particle</code>, or <code>yarn add cesium-particle</code>

```js
import { Particle3D } from "cesium-particle";
```

</td></tr>
</tbody>
</table>

## Example

```js
import { Particle3D, Vortex } from 'cesium-particle'
import * as Cesium from 'cesium';

// cesiumViewer object
const viewer = new Cesium.Viewer(cesiumContainer, viewerOption);

// particle system configuration
const systemOptions = {
  maxParticles: 64 * 64,
  particleHeight: 1000.0,
  fadeOpacity: 0.996,
  dropRate: 0.003,
  dropRateBump: 0.01,
  speedFactor: 1.0,
  lineWidth: 4.0,
  dynamic: true
}

// Particle colour ribbon
const colorTable = [
    [0.015686,
    0.054902,
    0.847059],
    [0.125490,
    0.313725,
    1.000000]
  ]

// The first one
// Load the demo.nc file
const file = BolbFile("demo.nc"); // Read the file
 // generate a particle system object from a NetCDF3 file
const particleObj = new Particle3D(viewer, {
  input: file,
  fields: {
    lev: 'lev'
  }
});

// load uv3z.nc, 325china.nc or other custom files
const file2 = BolbFile("uv3z.nc");
 // field names need to be defined
const particleObj2 = new Particle3D(viewer, {
  input: file,
  fields: {
    U: 'water_u',
    V: 'water_v'
  }
});


// The second
// Construct the vortex model object
const parameter = [ [120, 30, 100], 5, 5, 2000, 0.1, 0.1, 2000]; // [['lon', 'lat', 'lev'], 'radiusX', 'radiusY', 'height', 'dx', 'dy', 'dz']
const jsonData = new Vortex(.. .parameter).getData();
// generate particle system object from json data
const particleObj2 = new Particle3D(viewer, {
    input: jsonData,
    type: 'json', // required
    userInput: systemOptions,
    colorTable: colorTable,
    color: 'height' // colour change follows speed, optional value: 'speed'(defalut) or 'height'
  });

// Start the particle system
particleObj.init().then(res => {
  particleObj.show(); // start the particle system
})

systemOptions.fadeOpacity = 0.900;
particleObj.optionsChange(systemOptions); // update the particle system configuration

particleObj.hide(); // stop the particle system
particleObj.remove(); // remove the particle system
```

## API

### ``new Particle3D(viewer, options)``

Create a new particle system object, pass in parameters including (cesiumViewer, {.nc vector field file or json object, incoming data type, nc file field specification, UVWH value range, latitude/longitude offset values, particle system configuration items, particle colour ribbon, colored properties})

``options configuration properties in detail:``

| Name | Type | Necessarily | Enumeration | Default |
| ---------- | ------------- | ----------- | ------------------- | ---------------------------- |
| input      | File / Object | true        |                     |                              |
| type       | String        |             | 'nc' or 'json'      | 'nc'                         |
| fields     | Object        |             |                     | defaultFields                |
| valueRange | Object        |             |                     | { min: -100, max: 100 }      |
| offset     | Object        |             |                     | { lon: 0, lat: 0, lev: 0 }   |
| userInput  | Object        |             |                     | defaultParticleSystemOptions |
| colorTable | Array         |             |                     | defaultColorTable            |
| colour     | String        |             | 'speed' or 'height' | 'speed'                      |

``Default configuration details:``

```js
// default nc file variables fields
defaultFields = {
  U: 'U', // lateral speed
  V: 'V', // longitudinal speed
  W: '', // vertical speed
  H: '', // height property
  lon: 'lon', // longitude
  lat: 'lat', // latitude
  lev: '', // layer
}

// Default particle run parameters
defaultParticleSystemOptions = {
  maxParticles: 64 * 64, // maximum number of particles (will automatically take the square number)
  particleHeight: 1000.0, // particle height
  fadeOpacity: 0.996, // trailing transparency
  dropRate: 0.003, // Particle reset rate
  dropRateBump: 0.01, // the percentage of particle reset rate that increases with speed, the faster the speed the more dense the particle reset rate.
                      // final particle reset rate particleDropRate = dropRate + dropRateBump * speedNorm;
  speedFactor: 1.0, // particle speed
  lineWidth: 4.0, // line width
  dynamic: true // whether to run dynamically
lineWidth: 4.0, // lineWidth: true // whether to run dynamically }

// Default colour configuration
// colorTalbe defaults to white, passed in as an array of ``[[r, g , b], [r, g, b], ...] ``Format
// Example: [[234 / 255, 0, 0], [0, 123 / 255, 0]], corresponding to the particle colour field values from low to high
defaultColorTable = [[1.0, 1.0, 1.0]];
```

### ``init()``

Particle system initialization (asynchronous)

### ``show()``

Particle system starts running, pauses when window moves, size changes, earth zooms, viewpoint camera moves, and continues after stopping the operation

### ``hide()``

Pause the particle system

### ``optinsChange(options)``

Pass in particle system configuration parameters to update the running state of the particle

### ``remove()``

Removes the particle system from the cesiumview

### ``getFileFields()``

Retrieve NetCDF file fields for loading different vector field files, see demo

```js
import { getFileFields } from 'cesium-particle';

const file = File("uv3z.nc")
getFileFields(file).then(res => {
  ...
  /*res: {
    variables: ["water_u", "water_v", "depth", "time", "lat", "lon", "time_run"],
    dimensions: ["depth", "time", "lat", "lon"],
    raw: Object
  } */
})
```

## Demo

[View Online Demo](https://cesium-particle.vercel.app/)

[Example data](https://github.com/hongfaqiu/cesium-particle/tree/master/data)

### Running instructions

```js
yarn / npm install
npm start
```

### Run the image

| ! [10w wind field particles](https://user-images.githubusercontent.com/62411296/125084621-51948380-e0fc-11eb-8883-a8e265470402.png) | ! [25w ocean current particles](https://user-images.githubusercontent.com/62411296/125084661-5ce7af00-e0fc-11eb-982b-46d42627318a.png) |
| ------- | ------- |
| ! [China Sea Currents](https://user-images.githubusercontent.com/62411296/125084828-86a0d600-e0fc-11eb-877e-b79865b82cfe.png) | ! [Vortex of 250,000 particles](https://user-images.githubusercontent.com/62411296/125084984-acc67600-e0fc-11eb-81c4-8c265cae62f4.png)|

## Q & A

### Changes to glsl file did not work

To debug the glsl file in the development environment, you need to change the glsl file entry in .src/modules/particlescomputing.js and particlesRendering.js to

```js
import { CalculateSpeedShader, UpdatePositionShader, PostProcessingPositionShader } from '... /... /packages/shader';
```

Add glsl-loader to webpack.config.js

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\. (frag|vert)$/,
        loader: 'webpack-glsl-loader'
      }
    ]
  }
}
```

Or use the package command and package the glsl file as js:

```js
npm run build-glsl
```

### How to load your own .nc file

The .nc file should preferably be in the form of NetCDF version 3

The file must contain at least the following attributes.

- Horizontal velocity matrix U (lev, lat, lon)
- Vertical velocity matrix V (lev, lat, lon)
- Longitude dimension lon (0 - 360)
- latitude dimension lat

You can use the `getFileFields()` method to read the attribute field names and dimension field names from the .nc file

and with the `fields` field passed in the constructor `new Particle3D()`, try to load it onto the earth.

Set the noData value to 0, or configure the valueRange property when loading.

If the longitude range is not (0, 360) and the latitude range is not (-90, 90), the offset property needs to be configured.

### Why remove the Miter Joint algorithm used by the original author to draw the rectangle

See [issue](https://github.com/hongfaqiu/cesium-particle/issues/3)

The problem has been located, so I'll try to fix it later when I get a chance.

### Other issues

After version ``0.7.0``, the way cesium was introduced was changed to

```js
  import * as Cesium from 'cesium'
```
