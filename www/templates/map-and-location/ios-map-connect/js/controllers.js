// Controller of google iosMapConnect page.
// You can learn more about ios map at:
// https://developer.apple.com/library/iad/featuredarticles/iPhoneURLScheme_Reference/MapLinks/MapLinks.html
// You can learn more about google map for ios at:
// https://developers.google.com/maps/documentation/ios-sdk/urlscheme?hl=en#display_a_map
// at Display a map section.
appControllers.controller('iosMapConnectCtrl', function ($scope) {

    // initialForm is the first activity in the controller. 
    // It will initial all variable data and let the function works when page load.
    $scope.initialForm = function () {
        //destinationLocation is latitude,longitude of the destination location.
        $scope.destinationLocation = "-37.817364,144.955464";
    };// End initialForm

    // openIosMap is for open IOS Map application.
    // Parameter :  
    // targetDestinationLocation = latitude,longitude of the destination location.
    $scope.openIosMap = function (targetDestinationLocation) {

        // window.open is to link to URL.
        // The format is maps://?q=targetDestinationLocation(latitude,longitude).
        //  '_system' is for open map application
        window.open('maps://?q=' + targetDestinationLocation, '_system');
        // If you would like to custom map you can use this parameter below:
        // q = The query parameter. This parameter is treated as if it had been typed into the query box by the user in the Maps app. q=* is not supported
        // near = The location part of the query.
        // ll = The latitude and longitude points (in decimal format, comma separated, and in that order) for the map center point.
        // sll = The latitude and longitude points from which a business search should be performed.
        // spn = The approximate latitude and longitude span.
        // sspn = A custom latitude and longitude span format used by Apple. The value of this parameter is the latitude and longitude separated by a comma. For example, to specify a latitudinal span of 20.4 degrees and a longitudinal span of 30.8 degrees, you would use the string “sspn=20.4,30.8”.
        // t = The type of map to display.
        // z = The zoom level.
        // saddr = The source address, which is used when generating driving directions
        // daddr = The destination address, which is used when generating driving directions.
    };// End openIosMap

    // openGoogleMap is for open Google Map application.
    // Parameter :  
    // targetDestinationLocation = latitude,longitude of the destination location.
    $scope.openGoogleMap = function (targetDestinationLocation) {

        // window.open is to link to URL.
        // The format is comgooglemaps://?q=targetDestinationLocation(latitude,longitude)&zoom=15(Specifies the zoom level of the map).
        //  '_system' is for open map application
        window.open('comgooglemaps://?q=' + targetDestinationLocation + '&zoom=15', '_system');
        // If you would like to custom map you can use this paramitor below:
        // center: This is the map viewport center point. Formatted as a comma separated string of latitude,longitude.
        // mapmode: Sets the kind of map shown. Can be set to: standard or streetview. If not specified, the current application settings will be used.
        // views: Turns specific views on/off. Can be set to: satellite, traffic, or transit. Multiple values can be set using a comma-separator. If the parameter is specified with no value, then it will clear all views.
        // zoom: Specifies the zoom level of the map.
    };// End openGoogleMap

    $scope.initialForm();

});// End iosMapConnectCtrl controller.
