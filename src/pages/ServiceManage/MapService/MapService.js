import { Component } from 'react';
import st from './MapService.less';
import LocateMap from '../../../common/Components/Maps/LocateMap2';

class MapService extends Component {
  render() {
    return (
      <div className={st.MapService}>
        <div className={st.MapContainer}>
          <LocateMap />
        </div>
      </div>
    );
  }
}
export default MapService;
