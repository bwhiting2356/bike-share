exports.serverMapGeoPointToLatLng = function(geopoint) {
  return { lat: geopoint._latitude, lng: geopoint._longitude };
}
