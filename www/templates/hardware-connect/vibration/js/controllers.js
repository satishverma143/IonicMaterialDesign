// For using vibration you have to install $cordovaVibration by running the following 
// command in your cmd.exe for windows or terminal for mac:
// $ cd your_project_path
// $ ionic plugin remove cordova-plugin-vibration
// $ ionic plugin add cordova-plugin-vibration
// 
// Learn more about $cordovaVibration :
// http://ngcordova.com/docs/plugins/vibration/
//
// Controller of vibration page.
appControllers.controller('vibrationCtrl', function ($scope, $timeout, $cordovaVibration) {

    // initialForm is the first activity in the controller. 
    // It will initial all variable data and let the function works when page load.
    $scope.initialForm = function () {
        // $scope.vibrateing  is vibrateing status.
        $scope.vibrateing = false;
    };

    // vibrate for vibrate by calling $cordovaVibration.vibrate(milliseconds of vibrateing)
    $scope.vibrate = function () {
        $scope.vibrateing = true;
        $cordovaVibration.vibrate(400);
        $timeout(function () {
            $scope.vibrateing = false;
        }, 400);
    };// End vibrate.

    $scope.initialForm();

});// End of vibration Controller.