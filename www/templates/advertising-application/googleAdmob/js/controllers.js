// For using Admob you have to install $cordovaAdMob by running the following
// command in your cmd.exe for windows or Terminal for mac:
//
// $ cd your_project_path
// $ ionic platform remove ios
// $ ionic platform remove android
// $ ionic plugin remove cordova-plugin-admob
// $ ionic plugin add https://github.com/floatinghotpot/cordova-plugin-admob.git
// $ ionic platform add ios
// $ ionic platform add android
// $ ionic build ios
// $ ionic build android
//
// Learn more about $cordovaAdMob :
// http://ngcordova.com/docs/plugins/adMob/
// Controller of google AdMob page.
appControllers.controller('googleAdmobCtrl', function ($scope, $timeout) {

    // initialForm is the first activity in the controller. 
    // It will initial all variable data and let the function works when page load.
    $scope.initialForm = function () {

        // $scope.isTurnOn is AdMob status.
        $scope.isTurnOn = false;

        // Calling to initial AdMob.
        $scope.initAdMob();
        //If you start your application with google Admob feature.
        //You have to add timeout for 2 sec before run it.
    };//End initialForm.

    // initAdMob for initial AdMob
    $scope.initAdMob = function () {

        //$scope.admob_key is from window.globalVariable.oAuth.adMob in www/js/app.js at globalVariable session.
        $scope.admob_key = window.globalVariable.oAuth.adMob;
        
        //$scope.admob calling AdMob plugin and initial Admob.
        $scope.admob = window.plugins.AdMob;
        $scope.admob.createBannerView({
                'publisherId': $scope.admob_key,
                'adSize': $scope.admob.AD_SIZE.BANNER,
                'bannerAtTop': false
            },
            function () {
                $scope.admob.requestAd({
                        'isTesting': false
                    },
                    function () {
                        $scope.admob.showAd(false);
                    },
                    function () {
                        console.log('failed to request ad');
                    }
                );
            },
            function () {
                console.log('failed to create banner view');
            }
        );
    };//End initAdMob.

    // Call adMob() for turn on and off AdMob.
    $scope.adMob = function () {
        // Turn off AdMob.
        if ($scope.isTurnOn) {
            $scope.admob.showAd(false);
            $scope.isTurnOn = false;
        }
        // Turn on AdMob.
        else {
            $scope.admob.showAd(true);
            $scope.isTurnOn = true;
        }
    };//End adMob.

    $scope.initialForm();
});// End of google Admob Controller.
