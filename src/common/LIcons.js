import './LIcons.less';
let getRedIcon = content => {
  return L.divIcon({
    className: 'ct-divicon-red',
    html: content,
    iconAnchor: [10.5, 33],
    popupAnchor: [0, -36],
    tooltipAnchor: [0, -36],
    iconSize: [21, 33],
  });
};
let getBlueIcon = content => {
  return L.divIcon({
    className: 'ct-divicon-blue',
    iconAnchor: [10.5, 33],
    html: content,
    popupAnchor: [0, -36],
    tooltipAnchor: [0, -36],
    iconSize: [21, 33],
  });
};
let getOrangeIcon = content => {
  return L.divIcon({
    className: 'ct-divicon-orange',
    iconAnchor: [10.5, 33],
    html: content,
    popupAnchor: [0, -36],
    tooltipAnchor: [0, -36],
    iconSize: [21, 33],
  });
};

let baseStyle = {
  storke: true,
  weight: 1,
  fill: true,
};

let redStyle = {
  ...baseStyle,
  color: 'red',
};

let blueStyle = {
  ...baseStyle,
  color: 'blue',
};

let redIcon = getRedIcon('');
let blueIcon = getBlueIcon('');
let orangeIcon = getOrangeIcon('');
export {
  redIcon,
  blueIcon,
  orangeIcon,
  redStyle,
  blueStyle,
  getRedIcon,
  getBlueIcon,
  getOrangeIcon,
};
