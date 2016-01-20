// Controller of device information page.
// It use ionic.Platform.device() for getting device information. It will return object of current device.
// Learn more about ionic.Platform.device():
// http://ionicframework.com/docs/api/utility/ionic.Platform/

appControllers.controller('deviceInformationCtrl', function ($scope, $timeout) {

    // initialForm is the first activity in the controller. 
    // It will initial all variable data and let the function works when page load.
    $scope.initialForm = function () {
        // $scope.deviceInformation is store device information data.
        $scope.deviceInformation = {};

        // Loading progress.
        $timeout(function () {
            if ($scope.isAndroid) {
                jQuery('#device-information-loading-progress').show();
            }
            else {
                jQuery('#device-information-loading-progress').fadeIn(700);
            }
        }, 400);

        $timeout(function () {
            $scope.deviceInformation = ionic.Platform.device();
            jQuery('#device-information-loading-progress').hide();
            jQuery('#device-information-content').fadeIn();
        }, 1000);
    }; // End initialForm.

    // getDeviceInformation is for get device information by calling ionic Platform device.
    $scope.getDeviceInformation = function () {
        $scope.deviceInformation = ionic.Platform.device();
    }; // End getDeviceInformation.

    $scope.initialForm();

});// End of device information Controller.

