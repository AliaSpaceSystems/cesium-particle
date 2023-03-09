import * as Cesium from 'cesium'
import "cesium/Build/Cesium/Widgets/widgets.css";

Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI4OGQwZTM2MC00NjkzLTRkZTgtYTU5MS0xZTA1NTljYWQyN2UiLCJpZCI6NTUwODUsImlhdCI6MTYyMDM5NjQ3NH0.lu_JBwyngYucPsvbCZt-xzmzgfwEKwcRXiYs5uV8uTM';
var viewer = null;

export var initMap = function (cesiumContainer) {
  viewer = new Cesium.Viewer(cesiumContainer, {
    terrainProvider: Cesium.createWorldTerrain(),
    baseLayerPicker: false,   // Layer Selector
    animation: false,   // Lower Left Gauge
    fullscreenButton: false,   // Full screen button
    geocoder: false,   // Top right query search
    infoBox: false,   // Infobox
    homeButton: false,   // Home button
    sceneModePicker: false,  // 3d 2d selector
    selectionIndicator: false,  //
    timeline: false,   // Timeline
    navigationHelpButton: false,  // Help button in the top right corner
  })

  // The latitude, longitude and altitude of the lens. By default,
  // the lens looks down on the earth at the specified latitude and longitude altitude (pitch=-90)
  viewer.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(110.60396458865515, 34.54408834959379, 15000000), // 15,000 km over Beijing
      heading: Cesium.Math.toRadians(0),
      pitch: Cesium.Math.toRadians(-90),
      roll: Cesium.Math.toRadians(0),
    },
  });
  let imageryProvider = new Cesium.ArcGisMapServerImageryProvider({
      url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer"
  })
  viewer._cesiumWidget._creditContainer.style.display = "none";
  viewer.imageryLayers.addImageryProvider(imageryProvider);
  viewer.scene.fog.density = 0.0001; // Moisture content in the fog
  viewer.scene.globe.enableLighting = false;
  viewer.scene.skyBox.show = false;
  // Display refresh rate and frame rate
  viewer.scene.debugShowFramesPerSecond = true;

  //Determining whether image rendering pixelation is supported
  if(Cesium.FeatureDetection.supportsImageRenderingPixelated()){
    viewer.resolutionScale = window.devicePixelRatio;
  }
  // Turn on anti-aliasing
  viewer.scene.fxaa = true;
  viewer.scene.postProcessStages.fxaa.enabled = true;
}

export var getViewer = function(){
  return viewer;
}
