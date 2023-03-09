import * as dat from 'dat.gui'
import { defaultVortexOptions, defaultParticleSystemOptions, defaultFields } from './options'

export class FieldsPanel {
  constructor(container, fields = {variables: ['U', 'V', 'W', 'H'], dimensions: ['lon', 'lat', 'lev']}) {
    this.options = defaultFields;

    const that = this;

    let gui = new dat.GUI({ autoPlace: false, closed: true });
    gui.add(that.options, 'U', fields.variables).name("Horizontal velocity U");
    gui.add(that.options, 'V', fields.variables).name("Longitudinal velocity V");
    gui.add(that.options, 'W', fields.variables).name("Vertical velocity W");
    gui.add(that.options, 'H', fields.variables).name("Height value H");
    gui.add(that.options, 'lon', fields.dimensions).name("lon");
    gui.add(that.options, 'lat', fields.dimensions).name("lat");
    gui.add(that.options, 'lev', fields.dimensions).name("lev");

    let FieldsPanelContainer = document.getElementById(container);
    gui.domElement.classList.add('fieldsPanel');
    FieldsPanelContainer.appendChild(gui.domElement);
  }

  getUserInput() {
    return this.options;
  }
}

export class ValueRangePanel {
  constructor(container) {
    this.options = {max: 100, min: -100};

    const that = this;

    let gui = new dat.GUI({ autoPlace: false, closed: true });
    gui.add(that.options, 'max', -10000, 10000, 0.1).name("Maximum value");
    gui.add(that.options, 'min', -10000, 10000, 0.1).name("Minimum value");

    let ValueRangePanelContainer = document.getElementById(container);
    gui.domElement.classList.add('valueRangePanel');
    ValueRangePanelContainer.appendChild(gui.domElement);
  }

  getUserInput() {
    return this.options;
  }
}

export class OffsetPanel {
  constructor(container) {
    this.options = { lon: 0, lat: 0, lev: 0 };

    const that = this;

    let gui = new dat.GUI({ autoPlace: false, closed: true });
    gui.add(that.options, 'lon', -360, 360, 0.1).name("Longitude offset values");
    gui.add(that.options, 'lat', -180, 180, 0.1).name("Latitude offset value");
    gui.add(that.options, 'lev', -10000, 10000, 0.1).name("Height offset value");

    let OffsetPanelContainer = document.getElementById(container);
    gui.domElement.classList.add('offsetPanel');
    OffsetPanelContainer.appendChild(gui.domElement);
  }

  getUserInput() {
    return this.options;
  }
}

export class VortexPanel {
  constructor(container) {
    this.options = defaultVortexOptions;

    const that = this;

    let gui = new dat.GUI({ autoPlace: false, closed: true });
    gui.add(that.options, 'lon', -180, 180, 0.1).name("Central longitude");
    gui.add(that.options, 'lat', -90, 90, 1).name("Central latitude");
    gui.add(that.options, 'lev', -10000, 10000, 100).name("Central height");
    gui.add(that.options, 'radiusX', 0.0, 30).name("xRadius (degrees)");
    gui.add(that.options, 'radiusY', 0, 30).name("yRadius (degrees)");
    gui.add(that.options, 'height', 1, 10000).name("Height (m)");
    gui.add(that.options, 'dx', 0.001, that.options.radiusX).name("xRadius drop rate (degrees)");
    gui.add(that.options, 'dy', 0.001, that.options.radiusY).name("yRadius drop rate (degrees)");
    gui.add(that.options, 'dz', 1, 10000).name("Height drop rate (m)");

    let vortexPanelContainer = document.getElementById(container);
    gui.domElement.classList.add('vortexPanel');
    vortexPanelContainer.appendChild(gui.domElement);
  }

  getUserInput() {
    let { lon, lat, lev, radiusX, radiusY, height, dx, dy, dz } = this.options;
    return [[lon, lat, lev], radiusX, radiusY, height, dx, dy, dz];
  }
}
export class ControlPanel {
  constructor(container, optionsChange) {
    this.options = defaultParticleSystemOptions;

    const that = this;
    let onParticleSystemOptionsChange = function () {
      optionsChange(that.getUserInput());
    }

    let gui = new dat.GUI({ autoPlace: false });
    gui.add(that.options, 'maxParticles', 1, 1000 * 1000, 1).name("maxParticles").onFinishChange(onParticleSystemOptionsChange);
    gui.add(that.options, 'particleHeight', 1, 10000, 1).name("particleHeight").onFinishChange(onParticleSystemOptionsChange);
    gui.add(that.options, 'fadeOpacity', 0.50, 1.00, 0.001).name("fadeOpacity").onFinishChange(onParticleSystemOptionsChange);
    gui.add(that.options, 'dropRate', 0.0, 0.1).name("dropRate").onFinishChange(onParticleSystemOptionsChange);
    gui.add(that.options, 'dropRateBump', 0, 0.2).name("dropRateBump").onFinishChange(onParticleSystemOptionsChange);
    gui.add(that.options, 'speedFactor', 0.01, 8).name("speedFactor").onFinishChange(onParticleSystemOptionsChange);
    gui.add(that.options, 'lineWidth', 0.01, 16.0).name("lineWidth").onFinishChange(onParticleSystemOptionsChange);
    gui.add(that.options, 'dynamic').name("dynamic").onFinishChange(onParticleSystemOptionsChange);

    let panelContainer = document.getElementById(container);
    gui.domElement.classList.add('controlPanel');
    panelContainer.appendChild(gui.domElement);
  }

  getUserInput() {
    return this.options
  }
}
