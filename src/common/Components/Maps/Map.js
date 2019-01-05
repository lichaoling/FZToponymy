import { Component } from 'react';

import st from './Map.less';
import icons from './icons.js';
const { locateRed, locateBlue, touchIcon } = icons;

class Map extends Component {
  constructor(ps) {
    super(ps);
  }
  defaultCenter = {
    zoom: 12,
    center: [26.077768, 119.311231], //119.311231,26.077768
  };

  baseLayers = {
    vec: {
      name: '地图',
      type: 'vec',
      layer: L.layerGroup([L.tileLayer.tdtgj_veco(), L.tileLayer.tdtgj_veca()]),
    },
    img: {
      type: 'img',
      name: '影像',
      layer: L.layerGroup([L.tileLayer.tdtgj_imgo(), L.tileLayer.tdtgj_imga()]),
    },
  };

  getBeforeButtons() {
    return this.getToolbar(this.props.beforeBtns);
  }

  getAfterButtons() {
    return this.getToolbar(this.props.afterBtns);
  }

  changeLayer(type) {
    let ac = 'active';
    let map = this.map;
    $(this.layerToggle)
      .find('.' + type)
      .removeClass(ac)
      .siblings()
      .addClass(ac);

    if (type === 'vec') {
      this.baseLayers.img.layer.remove();
      this.baseLayers.vec.layer.addTo(map);
    } else {
      this.baseLayers.vec.layer.remove();
      this.baseLayers.img.layer.addTo(map);
    }
  }

  initMap() {
    let map = L.map(this.mapDom, {
      ...this.defaultCenter,
      attributionControl: false,
      zoomControl: false,
      crs: L.CRS.EPSG4490,
    });
    L.control
      .zoom({
        zoomInTitle: '放大',
        zoomOutTitle: '缩小',
        position: 'bottomright',
      })
      .addTo(map);

    this.map = map;

    this.initBaseMap();
  }

  initBaseMap() {
    let { baseLayerType } = this.props;
    let type = baseLayerType;
    type = type || 'vec';

    let self = this;
    $(this.layerToggle)
      .find('>div')
      .on('click', function() {
        let type = $(this).data('type');
        self.changeLayer(type);
      });

    this.changeLayer(type);
  }

  changeLayer(type) {
    let ac = 'active';
    let map = this.map;
    $(this.layerToggle)
      .find('.' + type)
      .removeClass(ac)
      .siblings()
      .addClass(ac);

    if (type === 'vec') {
      this.baseLayers.img.layer.remove();
      this.baseLayers.vec.layer.addTo(map);
    } else {
      this.baseLayers.vec.layer.remove();
      this.baseLayers.img.layer.addTo(map);
    }
  }
  getLayerToggle() {
    let cmp = [];
    for (let i in this.baseLayers) {
      let e = this.baseLayers[i];
      cmp.push(
        <div className={e.type} data-type={e.type}>
          {/* <div>{e.name}</div> */}
        </div>
      );
    }
    return cmp;
  }

  componentDidMount() {
    this.initMap();
    let { onMapReady } = this.props;
    onMapReady && onMapReady(this);
    let self = this;
  }

  render() {
    return (
      <div className={st.map}>
        <div ref={e => (this.mapDom = e)} className={st.mapdom} />
        <div ref={e => (this.layerToggle = e)} className={st.layerptoggle}>
          {this.getLayerToggle()}
        </div>
        <div
          className={st.back}
          title="返回主页"
          onClick={e => {
            window.location.href = '#/home';
          }}
        >
          <span className="iconfont icon-caidan1" />
        </div>
        <img className={st.logo} src={require('../../Img/服务应用/切图/title.png')}/>
      </div>
    );
  }
}

export default Map;
