import React from 'react';
import googleMaps from 'google-maps';
import qs from 'qs';
import router from 'page';

class SaraiMap extends React.Component {
  constructor() {
    super();
    this.auto = this.auto.bind(this);
    this.renderMap = this.renderMap.bind(this);
    this.initializeEEMap = this.initializeEEMap.bind(this);
    this.getEEMap = this.getEEMap.bind(this);
    this.handleNDVI = this.handleNDVI.bind(this);
    this.handleRainfall = this.handleRainfall.bind(this);
    this.google = null;
    this.map = null;
    this.mapContainer = null;
    this.layer = [];
    this.date = '2016-02-01';
    this.range = 15;
    this.opacity = 0.8;
    this.crop = 'rice';
    this.mapObj = {
      zoom: 6,
      lat: 12.2969397,
      lng: 121.6576634
    };
    this.mapLayer = null;
  }
  auto() {
    let myHeight = 0;
    if ( typeof ( window.innerWidth ) === 'number' ) {
      // Non-IE
      myHeight = window.innerHeight;
    } else if ( document.documentElement && ( document.documentElement.clientWidth ||
      document.documentElement.clientHeight ) ) {
      // IE 6+ in 'standards compliant mode'
      myHeight = document.documentElement.clientHeight;
    } else if ( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
      // IE 4 compatible
      myHeight = document.body.clientHeight;
    }
    // console.log(this.mapContainer.style)
    this.mapContainer.style.height = (myHeight) + 'px';
    this.mapControls.style.height = (myHeight - 200) + 'px';
  }
  handleRainfall(e) {
    console.log('handle NDVI');
    this.map.overlayMapTypes.clear();
    const {query} = this.props;
    const year = this.dateYear &&
      this.dateYear.value &&
      this.dateYear.value.trim() !== '' &&
      !isNaN(parseFloat(this.dateYear.value)) &&
      parseFloat(this.dateYear.value) >= 1980 &&
      parseFloat(this.dateYear.value) <= 3000 ?
      this.dateYear.value : '2016';
    const month = this.dateMonth &&
      this.dateMonth.value &&
      this.dateMonth.value.trim() !== '' &&
      !isNaN(parseFloat(this.dateMonth.value)) &&
      parseFloat(this.dateMonth.value) >= 1 &&
      parseFloat(this.dateMonth.value) <= 12 ?
      this.dateMonth.value : '02';
    const day = this.dateDay &&
      this.dateDay.value &&
      this.dateMonth.value.trim() !== '' &&
      !isNaN(parseFloat(this.dateDay.value)) &&
      (parseFloat(this.dateDay.value) - 1) % 5 === 0 &&
      parseFloat(this.dateDay.value) <= 26 ?
      this.dateDay.value : '01';

    const date = `${year}-${month}-${day}`;
    const range = this.dateRange &&
      this.dateRange.value &&
      this.dateRange.value.trim() !== '' &&
      !isNaN(parseFloat(this.dateRange.value)) &&
      parseFloat(this.dateRange.value) <= 21 ? this.dateRange.value : '15';
    const q = qs.stringify(Object.assign({}, query, {
      date,
      range
    }));
    router(`?${q}`);
  }
  handleNDVI(e) {
    console.log('handle NDVI');
    this.map.overlayMapTypes.clear();
    const {query} = this.props;
    const year = this.dateYear &&
      this.dateYear.value &&
      this.dateYear.value.trim() !== '' &&
      !isNaN(parseFloat(this.dateYear.value)) &&
      parseFloat(this.dateYear.value) >= 1980 &&
      parseFloat(this.dateYear.value) <= 3000 ?
      this.dateYear.value : '2016';
    const month = this.dateMonth &&
      this.dateMonth.value &&
      this.dateMonth.value.trim() !== '' &&
      !isNaN(parseFloat(this.dateMonth.value)) &&
      parseFloat(this.dateMonth.value) >= 1 &&
      parseFloat(this.dateMonth.value) <= 12 ?
      this.dateMonth.value : '02';
    const day = this.dateDay &&
      this.dateDay.value &&
      this.dateDay.value.trim() !== '' &&
      !isNaN(parseFloat(this.dateDay.value)) &&
      parseFloat(this.dateDay.value) >= 1 &&
      parseFloat(this.dateDay.value) <= 31 ?
      this.dateDay.value : '01';
    console.log(this.dateDay.value, parseFloat(this.dateDay.value))
    const date = `${year}-${month}-${day}`;
    const range = this.dateRange &&
      this.dateRange.value &&
      this.dateRange.value.trim() !== '' &&
      !isNaN(parseFloat(this.dateRange.value)) &&
      parseFloat(this.dateRange.value) <= 21 ? this.dateRange.value : '15';
    const q = qs.stringify(Object.assign({}, query, {
      date,
      range
    }));
    router(`?${q}`);
  }
  initializeEEMap(mapId, token) {
    const {query} = this.props;
    const opacity = query.opacity && !isNaN(parseFloat(query.opacity)) ?
      parseFloat(query.opacity) : 1;
    const eeMapOptions = {
      getTileUrl: (tile, zoom) => {
        const baseUrl = 'https://earthengine.googleapis.com/map';
        let url = [ baseUrl, mapId, zoom, tile.x, tile.y ].join('/');
        url += '?token=' + token;
        return url;
      },
      tileSize: new this.google.maps.Size(256, 256),
      opacity
    };

    this.mapLayer = new this.google.maps.ImageMapType(eeMapOptions);

    // Add the EE layer to the map.
    this.map.overlayMapTypes.clear();
    // console.log(this.map.overlayMapTypes);
    this.map.overlayMapTypes.push(this.mapLayer);
    // console.log(this.map.overlayMapTypes);
  }
  initializeCartoDBMap(obj) {
    const {query} = this.props;
    const opacity = query.opacity && !isNaN(parseFloat(query.opacity)) ?
      parseFloat(query.opacity) : 1;
    const eeMapOptions = {
      getTileUrl: (tile, zoom) => {
        const baseUrl = 'https://saraimaindev.cartodb.com/api/v1/map';
        let url = [
          baseUrl,
          obj.layergroupid,
          zoom,
          tile.x,
          `${tile.y}.png`
        ].join('/');
        // url += '?token=' + token;
        return url;
      },
      tileSize: new this.google.maps.Size(256, 256),
      opacity
    };

    this.mapLayer = new this.google.maps.ImageMapType(eeMapOptions);

    // Add the EE layer to the map.
    this.map.overlayMapTypes.clear();
    // console.log(this.map.overlayMapTypes);
    this.map.overlayMapTypes.push(this.mapLayer);
    // console.log(this.map.overlayMapTypes);
  }
  getCartoDBMap(crop = this.crop) {
    const xhr = new XMLHttpRequest();
    const uri = 'https://saraimaindev.cartodb.com/api/v1/map/';
   // const uri = `https://saraimaindev.cartodb.com/api/v1/map/named/${crop}-template-map`;
    const mapConfig = {
      version: '1.3.1',
      name: `${crop}-template-map`,
      auth: {
        method: 'open'
      },
      layers: [ {
        type: 'cartodb',
        options: {
          cartocss_version: '2.1.1',
          cartocss: `#${crop}
            {
              polygon-opacity: 1;
              line-color: #FFF;
              line-width: 0;
              line-opacity: 1;
            }

            #${crop}[category="S1"] {
               polygon-fill: #267300;
            }
            #${crop}[category="S2 es"] {
               polygon-fill: #70A800;
            }
            #${crop}[category="S2 et"] {
               polygon-fill: #70A800;
            }
            #${crop}[category="S2 ets"] {
               polygon-fill: #70A800;
            }
            #${crop}[category="S2 s"] {
               polygon-fill: #70A800;
            }
            #${crop}[category="S2 t"] {
               polygon-fill: #70A800;
            }
            #${crop}[category="S2 ts"] {
               polygon-fill: #70A800;
            }
            #${crop}[category="S3 e"] {
               polygon-fill: #D0FF73;
            }
            #${crop}[category="S3 et"] {
               polygon-fill: #D0FF73;
            }
            #${crop}[category="S3 t"] {
               polygon-fill: #D0FF73;
            }
            #${crop} {
               polygon-fill: #D0FF73;
            }`,
          // cartocss: `#rice
          //   {
          //     polygon-opacity: 1;
          //     line-color: #FFF;
          //     line-width: 0;
          //     line-opacity: 1;
          //   }

          //   #rice[category="Highly Suitable"] {
          //     polygon-fill: #5eff00;
          //   }
          //   #rice[category="Marginally Suitable"] {
          //     polygon-fill: #a88401;
          //   }
          //   #rice[category="Moderately Suitable"] {
          //     polygon-fill: #229A00;
          //   }`,
          sql: `select * from ${crop}`
        }
      } ]
    };

    const mapOptionString = JSON.stringify(mapConfig);
    xhr.open('POST', uri, true);
    xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
    // xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
    // xhr.setRequestHeader('Access-Control-Allow-Headers', '*');

    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        const obj = JSON.parse(xhr.responseText);
        console.log(obj);
        this.initializeCartoDBMap(obj);
      } else if (xhr.status !== 200) {
        console.log('Not 200');
      }
    };
    // xhr.send('{}');
    xhr.send(mapOptionString);
  }
  getEEMap(p) {
    const api = p === 'ndvi' ? 'landsat' : 'chirps';
    const {query} = this.props;
    const date = query.date && query.date !== '' ? query.date : this.date;
    const range = query.range && !isNaN(parseFloat(query.range)) ? query.range : this.range;
    const q = qs.stringify({date, range});
    const xhr = new XMLHttpRequest();
    const uri = `https://google-earth-engine-sarai-tjmonsi1.c9users.io/${api}?${q}`;
    xhr.open('GET', uri, true);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        const obj = JSON.parse(xhr.responseText);
        console.log(obj);
        this.initializeEEMap(obj.mapId, obj.mapToken);
      } else if (xhr.status !== 200) {
        console.log('Not 200');
      }
    };
    xhr.send();
  }
  renderMap() {
    const {query} = this.props;
    const {page} = query;
    const crop = query.crop && query.crop.trim() !== '' ? query.crop : this.crop;
    console.log(crop)
    const opacity = query.opacity && !isNaN(parseFloat(query.opacity)) ?
      parseFloat(query.opacity) : 1;

    if (componentHandler && this.opacitySlider) {
      componentHandler.upgradeElement(this.opacitySlider);
      this.opacitySlider.MaterialSlider.change(opacity * 100);
    }
    let p = null;
    if (page) {
      p = page.trim() === '' ? 'ndvi' : page;
    } else {
      p = 'ndvi';
    }
    console.log(p);

    if (p === 'ndvi' || p === 'rainfall') {
      this.getEEMap(p);
    } else if (p === 'suitability') {
      this.getCartoDBMap(crop);
    }
  }
  componentDidMount() {
    const {zoom, lat, lng} = this.mapObj;
    googleMaps.KEY = 'AIzaSyBm4iBwV7u1g3xdXV9sX-y96_23aJpd4m8';
    googleMaps.load((google) => {
      if (google) {
        this.google = google;
        this.map = new this.google.maps.Map(this.mapContainer, {
          zoom,
          center: {lat, lng}
        });

        this.map.controls[google.maps.ControlPosition.LEFT_TOP].push(this.mapControls);
        // this.map.controls[google.maps.ControlPosition.RIGHT_TOP].push(this.namer);
        this.renderMap();
      }
    });
  }
  componentDidUpdate() {
    if (this.google) {
      this.renderMap();
    }
  }
  renderSlider() {
    const opacitySlider = (c) => {
      this.opacitySlider = c;

    };
    const handleChange = (e) => {
      console.log(this.opacitySlider.value);
      this.mapLayer.setOpacity(this.opacitySlider.value / 100);
    };
    return (
      <input
        className="mdl-slider mdl-js-slider"
        type="range"
        min="0"
        max="100"
        tabindex="0"
        ref = {opacitySlider}
        onChange = {handleChange}
      />
    );
  }
  renderNDVIDay(page) {
    const {query} = this.props;
    const {date} = query;

    const dateArr = date ? date.split('-') : '2016-02-01'.split('-');
    const day = dateArr[2] && !isNaN(parseFloat(dateArr[2])) ? dateArr[2] : 1;

    const dayRef = (c) => {
      this.dateDay = c;
      if (this.dateDay) {
        this.dateDay.value = day;
      }
    };
    const pattern = page === 'ndvi' ? '(([0-2][0-9])|(3[0-1]))' : '([0-2](1|6))';
    return (
      <div className="mdl-textfield mdl-js-textfield mdl-cell mdl-cell--3-col
        mdl-cell--2-col-tablet mdl-cell--1-col-phone date-day-class"
      >
        <input
          className="mdl-textfield__input"
          type="text"
          pattern={pattern}
          id="date-day"
          ref={dayRef}
        />
        <label
          className="mdl-textfield__label"
          htmlFor="date-day"
        >
          {'Day'}
        </label>
        <span className="mdl-textfield__error">
          {'Input is not a proper day!'}
        </span>
      </div>
    );
  }
  renderDate(page) {
    const {query} = this.props;
    const {date} = query;

    const dateArr = date ? date.split('-') : '2016-02-01'.split('-');
    const year = dateArr[0] && !isNaN(parseFloat(dateArr[0])) ? dateArr[0] : 2016;
    const month = dateArr[1] && !isNaN(parseFloat(dateArr[1])) ? dateArr[1] : 2;
    // const day = dateArr[2] && !isNaN(parseFloat(dateArr[2])) ? dateArr[2] : 1;

    const yearRef = (c) => {
      this.dateYear = c;
      if (this.dateYear) {
        this.dateYear.value = year;
      }
    };
    const monthRef = (c) => {
      this.dateMonth = c;
      if (this.dateMonth) {
        this.dateMonth.value = month;
      }
    };

    return (
      <div className="mdl-cell mdl-cell--12-col">
        {'Filter Date: '}
        <div className="mdl-grid">
          <div className="mdl-textfield mdl-js-textfield mdl-cell mdl-cell--6-col
            mdl-cell--4-col-tablet mdl-cell--2-col-phone date-year-class"
          >
            <input
              className="mdl-textfield__input"
              type="text"
              pattern="((19[8-9][0-9])|(20[0-9][0-9]))"
              id="date-year"
              ref={yearRef}
            />
            <label
              className="mdl-textfield__label"
              htmlFor="date-year"
            >
              {'Year'}
            </label>
            <span className="mdl-textfield__error">
              {'Input is not a proper year!'}
            </span>
          </div>

          <div className="mdl-textfield mdl-js-textfield mdl-cell mdl-cell--3-col
            mdl-cell--2-col-tablet mdl-cell--1-col-phone date-month-class"
          >
            <input
              className="mdl-textfield__input"
              type="text"
              pattern="((1[0-2])|(0[0-9]))"
              id="date-month"
              ref={monthRef}
            />
            <label
              className="mdl-textfield__label"
              htmlFor="date-month"
            >
              {'Month'}
            </label>
            <span className="mdl-textfield__error">
              {'Input is not a proper month!'}
            </span>
          </div>

          {this.renderNDVIDay(page)}
        </div>

      </div>
    );
  }
  renderRange() {
    const {query} = this.props;
    const {range} = query;
    const rangeRef = (c) => {
      this.dateRange = c;
      if (this.dateRange) {
        this.dateRange.value = range && !isNaN(parseFloat(range)) ? range : this.range;
      }
    };
    return (
      <div className="mdl-cell mdl-cell--12-col">
        {'Scan Range (in Days): '}
        <div className="mdl-textfield mdl-js-textfield"
          >
          <input
            className="mdl-textfield__input"
            type="text"
            pattern="(([1-2][0-9])|[1-9])"
            id="date-range"
            ref={rangeRef}
          />
          <label
            className="mdl-textfield__label"
            htmlFor="date-range"
          >
            {'Range'}
          </label>
          <span className="mdl-textfield__error">
            {'Input is not a proper value!'}
          </span>
        </div>
      </div>
    );
  }
  renderSuitability() {
    const {query} = this.props;
    const {crop} = query;
    return (
      <div className="mdl-cell mdl-cell--12-col">
        <div
          className="mdl-grid mdl-grid--no-spacing"
        >
          <div className="mdl-cell mdl-cell--12-col option-title">
            <h5>{`Suitability Map: ${crop}`}</h5>
          </div>
          <div className="mdl-cell mdl-cell--12-col suitability-legend">
            &nbsp;
          </div>
          <div className="mdl-cell mdl-cell--12-col suitability-names">
            <div className="mdl-grid mdl-grid--no-spacing">
              <div className="mdl-cell mdl-cell--3-col mdl-cell--2-col-tablet mdl-cell--2-phone">
                Less Suitable to Plant
              </div>
              <div className="mdl-cell mdl-cell--3-col mdl-cell--2-col-tablet mdl-cell--2-phone
                mdl-cell--6-offset mdl-cell--4-offset-tablet"
              >
                More Suitable to Plant
              </div>
            </div>
          </div>
          <div className="mdl-cell mdl-cell--12-col">
            {'Layer Opacity: '}<br/>
            {this.renderSlider()}
          </div>
          <div className="mdl-cell mdl-cell--12-col">
            <div className="mdl-grid">
              <div className="crop-item mdl-cell mdl-cell--12-col">
                <a href="?page=suitability&crop=rice">
                  <img src="src/images/crop-icons/rice.png" />
                  <span>RICE</span>
                </a>
              </div>

              <div className="crop-item mdl-cell mdl-cell--12-col">
                <a href="?page=suitability&crop=cornwet">
                  <img src="src/images/crop-icons/corn.png" />
                <span>CORN</span>
                </a>
              </div>

              <div className="crop-item mdl-cell mdl-cell--12-col">
                <a href="?page=suitability&crop=banana">
                  <img src="src/images/crop-icons/banana.png" />
                  <span>BANANA</span>
                </a>
              </div>
              <div className="crop-item mdl-cell mdl-cell--12-col">
                <a href="?page=suitability&crop=coconut">
                  <img src="src/images/crop-icons/coconut.png" />
                  <span>COCONUT</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  renderRainfall() {
    return (
      <div className="mdl-cell mdl-cell--12-col">
        <div
          className="mdl-grid mdl-grid--no-spacing"
        >
          <div className="mdl-cell mdl-cell--12-col option-title">
            <h5>{'Rainfall'}</h5>
          </div>
          <div className="mdl-cell mdl-cell--12-col rainfall-legend">
            &nbsp;
          </div>
          <div className="mdl-cell mdl-cell--12-col rainfall-names">
            <div className="mdl-grid mdl-grid--no-spacing">
              <div className="mdl-cell mdl-cell--3-col mdl-cell--2-col-tablet mdl-cell--2-phone">
                Less Rainfall
              </div>
              <div className="mdl-cell mdl-cell--3-col mdl-cell--2-col-tablet mdl-cell--2-phone
                mdl-cell--6-offset mdl-cell--4-offset-tablet"
              >
                More Rainfall
              </div>
            </div>
          </div>
          <div className="mdl-cell mdl-cell--12-col">
            {'Layer Opacity: '}<br/>
            {this.renderSlider()}
          </div>
          {this.renderDate('rainfall')}
          <div className="mdl-cell mdl-cell--12-col">
            <button
              className="mdl-button mdl-js-button mdl-button--raised
                mdl-js-ripple-effect"
              onClick={this.handleRainfall}
            >
              {'Filter'}
            </button>
          </div>
        </div>
      </div>
    );
  }
  renderNDVI() {
    return (
      <div className="mdl-cell mdl-cell--12-col">
        <div
          className="mdl-grid mdl-grid--no-spacing"
        >
          <div className="mdl-cell mdl-cell--12-col option-title">
            <h5>{'Normalized Difference Vegetation Index (NDVI)'}</h5>
          </div>
          <div className="mdl-cell mdl-cell--12-col ndvi-legend">
            &nbsp;
          </div>
          <div className="mdl-cell mdl-cell--12-col ndvi-names">
            <div className="mdl-grid mdl-grid--no-spacing">
              <div className="mdl-cell mdl-cell--3-col mdl-cell--2-col-tablet mdl-cell--2-phone">
                Less Vegetation
              </div>
              <div className="mdl-cell mdl-cell--3-col mdl-cell--2-col-tablet mdl-cell--2-phone
                mdl-cell--6-offset mdl-cell--4-offset-tablet"
              >
                More Vegetation
              </div>
            </div>
          </div>
          <div className="mdl-cell mdl-cell--12-col">
            {'Layer Opacity: '}<br/>
            {this.renderSlider()}
          </div>
          {this.renderDate('ndvi')}
          {this.renderRange()}
          <div className="mdl-cell mdl-cell--12-col">
            <button
              className="mdl-button mdl-js-button mdl-button--raised
                mdl-js-ripple-effect"
              onClick={this.handleNDVI}
            >
              {'Filter'}
            </button>
          </div>
        </div>
      </div>
    );
  }
  renderOptions() {
    const {query} = this.props;
    const {page} = query;
    let p = null;
    if (page) {
      p = page.trim() === '' ? 'ndvi' : page;
    } else {
      p = 'ndvi';
    }

    if (p === 'ndvi') {
      return this.renderNDVI();
    } else if (p === 'rainfall') {
      return this.renderRainfall();
    } else if (p === 'suitability') {
      return this.renderSuitability();
    }
  }
  render() {
    const style = {
      width: '100%',
      height: 600
    };
    const styleControls = {
      position: 'absolute',
      width: '30%',
      maxWidth: 300,
      minWidth: 150,
      backgroundColor: 'rgba(255,255,255,0.7)',
      padding: 15,
      marginTop: 10,
      marginLeft: 10,
      overflow: 'auto'
    };
    const map = (c) => {
      this.mapContainer = c;
    };
    const controls = (c) => {
      this.mapControls = c;
    };
    return (
      <div className="mdl-grid mdl-grid--no-spacing">
        <div className="mdl-cell mdl-cell--12-col sarai-map">
          <div
            className="mdl-grid"
            style = {styleControls}
            ref={controls}
          >
            {this.renderOptions()}
          </div>
          <div
            ref={map}
            style={style}
          >
          </div>
        </div>
      </div>
    );
  }
}

export default SaraiMap;
