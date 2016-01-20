// Controller of expense dashboard page.
appControllers.controller('expenseDashboardCtrl', function ($scope,$state,$stateParams) {

    //$scope.isAnimated is the variable that use for receive object data from state params.
    //For enable/disable row animation.
    $scope.isAnimated =  $stateParams.isAnimated;

	// doSomeThing is for do something when user click on a button
    $scope.doSomeThing = function () {
    	// You can put any function here.
    } // End doSomeThing.

    // goToSetting is for navigate to Dashboard Setting page
    $scope.goToSetting = function () {
        $state.go("app.expenseSetting");
    };// End goToSetting.

});// End of controller expense dashboard.

// Controller of expense dashboard setting.
appControllers.controller('expenseDashboardSettingCtrl', function ($scope, $state,$ionicHistory,$ionicViewSwitcher) {

    // navigateTo is for navigate to other page
    // by using targetPage to be the destination state.
    // Parameter :
    // stateNames = target state to go.
    // objectData = Object data will send to destination state.
    $scope.navigateTo = function (stateName,objectData) {
        if ($ionicHistory.currentStateName() != stateName) {
            $ionicHistory.nextViewOptions({
                disableAnimate: false,
                disableBack: true
            });

            //Next view animate will display in back direction
            $ionicViewSwitcher.nextDirection('back');

            $state.go(stateName, {
                isAnimated: objectData,
            });
        }
    }; // End of navigateTo.
}); // End of controller expense dashboard setting.
