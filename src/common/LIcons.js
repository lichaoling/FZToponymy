import './LIcons.less';
let getRedIcon = content => {
  return L.divIcon({ className: 'ct-divicon-red', html: content, iconSize: [21, 33] });
};
let getBlueIcon = content => {
  return L.divIcon({ className: 'ct-divicon-blue', html: content, iconSize: [21, 33] });
};
let redIcon = getRedIcon('');
let blueIcon = getBlueIcon('');

export { redIcon, blueIcon, getRedIcon, getBlueIcon };
