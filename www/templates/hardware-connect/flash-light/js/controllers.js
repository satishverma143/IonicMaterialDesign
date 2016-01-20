// For using flashlight you have to install $cordovaFlashlight by running the following
// command in your cmd.exe for windows or terminal for mac:
// $ cd your_project_path
// $ ionic plugin remove nl.x-services.plugins.flashlight
// $ ionic plugin add https://github.com/EddyVerbruggen/Flashlight-PhoneGap-Plugin.git
// 
// Learn more about $cordovaFlashlight :
// http://ngcordova.com/docs/plugins/flashlight/
//
// Controller of Flashlight page.
appControllers.controller('flashLightCtrl', function ($scope, $cordovaFlashlight, $timeout) {

    // initialForm is the first activity in the controller. 
    // It will initial all variable data and let the function works when page load.
    $scope.initialForm = function () {
        //$scope.isTurnOn  is Flashlight status.
        $scope.isTurnOn = false;

        //$scope.deviceInformation  is getting device platform.
        $scope.deviceInformation = ionic.Platform.device();
        //If you start your application with flash Light feature.
        //You have to add timeout for 2 sec before run it.
    }; // End initialForm.

    // flashLight for turn on and off flashLight.
    $scope.flashLight = function () {
        // turn on flashLight
        if ($scope.isTurnOn == false) {
                // turn on flashLight for Android
            if ($scope.deviceInformation.platform == "Android") {
                $scope.isTurnOn = true;
                $timeout(function () {
                    $cordovaFlashlight.switchOn();
                }, 50);
            } 
                // turn on flashLight for IOS
            else {
                $scope.isTurnOn = true;
                $cordovaFlashlight.switchOn();
            }
        } // End turn on flashLight.

        // turn off flashLight.
        else {
            $scope.isTurnOn = false;
            $cordovaFlashlight.switchOff();
        }// End turn off flashLight.
    };// End flashLight.

    $scope.initialForm();

});// End of Flashlight Controller.