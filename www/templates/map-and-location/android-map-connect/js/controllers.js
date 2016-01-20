// Controller of google androidMapConnect page.
// You can learn more about google map for Android at:
// https://developers.google.com/maps/documentation/android-api/intents?hl=en#display_a_map
// at Display a map section.
appControllers.controller('androidMapConnectCtrl', function ($scope) {

	// initialForm is the first activity in the controller. 
    // It will initial all variable data and let the function works when page load.
    $scope.initialForm = function () {
    	//destinationLocation is latitude,longitude of the destination location.
        $scope.destinationLocation = "-37.817364,144.955464";
    };// End initialForm

    // openMap is for open Google Map application.
    // Parameter :  
    // targetDestinationLocation = latitude,longitude of the destination location.
    $scope.openMap = function (targetDestinationLocation) {

    	// window.open is to link to URL.
        // The format is geo:?q=targetDestinationLocation(latitude,longitude)&z=15(Specifies the zoom level of the map).
        //  '_system' is for open map application
        window.open('geo:?q=' + targetDestinationLocation + '&z=15', '_system');
        // If you would like to custom map you can use this parameter below:
  		// latitude and longitude set the center point of the map.
		// z optionally sets the initial zoom level of the map. Accepted values range from 0 (the whole world) to 21 (individual buildings).
		// The upper limit can vary depending on the map data available at the selected location.
    };// End openMap

    $scope.initialForm();

});// End androidMapConnectCtrl controller.