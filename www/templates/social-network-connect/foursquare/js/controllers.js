// For connecting with foursquare you have to install $cordovaOauth by running the following
// command in your cmd.exe for windows or terminal for mac:
// $ cd your_project_path
// $ ionic plugin remove org.apache.cordova.inappbrowser
// $ ionic plugin add org.apache.cordova.inappbrowser
// 
// Learn more about $cordovaOauth :
// http://ngcordova.com/docs/plugins/oauth/
//
// object schema of foursquareProfile that keep in localStorage is: 
// [{
//  name: foursquare name,
//  gender: gender,
//  email: email,
//  pictureProfileUrl: foursquare picture profile url,
//  id: foursquare id,
//  homeCity: homeCity,
//  access_token: access_token
// }]
// 
// Controller of foursquare login Page.
appControllers.controller('foursquareLoginCtrl', function ($scope, $filter, $state, $cordovaOauth, $http, localStorage) {
    
    // This function is the first activity in the controller. 
    // It will initial all variable data and let the function works when page load.
    $scope.initialForm = function () {

        // $scope.isLogin is the variable for check that user is login or not.
        $scope.isLogin = false;

        // $scope.isLoading is the variable for loading progress.
        $scope.isLoading = false;

        // $scope.userInfo is the variable that store user information data.
        $scope.userInfo = {
            name: "",
            gender: "",
            email: "",
            pictureProfileUrl: "",
            id: "",
            homeCity: "",
            access_token: ""
        };
        // Getting user information.
        $scope.userInfo = $scope.getUserProfile();
        // Getting current date.
        $scope.today = $filter('date')(new Date(), "yyyyMMdd");
    };// End initialForm.

    // navigateTo is for navigate to other page 
    // by using targetPage to be the destination page.
    // Parameter :  
    // targetPage = destination page.
    $scope.navigateTo = function (targetPage) {
        $state.go(targetPage);
    };// End navigateTo.

    // goToUserProfile is for navigate to foursquare Profile page.
    $scope.goToUserProfile = function () {
        if ($scope.isLoading == false) {
            $scope.isLoading = true;
            $scope.navigateTo('app.foursquareProfile');
            $scope.isLoading = false;
        }
    };// End goToUserProfile.
    
    //getUserProfile is for get user information form localStorage by calling localStorage.get service.
    $scope.getUserProfile = function () {
        $scope.userInfo = localStorage.get("Foursquare");
        if ($scope.userInfo != null) {
            $scope.isLogin = true;
        }
        ;
        return $scope.userInfo;
    };// End getUserProfile.

    // login for foursquare login
    $scope.login = function () {
        if ($scope.isLoading == false) {
            $scope.isLoading = true;

            // Calling $cordovaOauth.foursquare for login foursquare.
            // Format:
            // $cordovaOauth.foursquare(CLIENT_ID,[FOURSQUARE_PERMISION]) 
            // For CLIENT_ID is window.globalVariable.oAuth.foursquare from www/js/app.js at globalVariable session.
            $cordovaOauth.foursquare(window.globalVariable.oAuth.foursquare).then(function (result) {
                //After call cordovaOauth.foursquare it will return access_token for you to calling foursquare API.
                    $scope.accessToken = result.access_token;
                    // Calling http service for getting user profile from foursquare.
                    // By send parameter access_token , v (v is current version date).
                    $http.get("https://api.foursquare.com/v2/users/self", {
                        params: {
                            oauth_token: result.access_token,
                            v: $scope.today
                        }
                    }).then(function (result) {
                        // Success retrieve data by calling http service.
                        // Store user profile information from foursquare API to userInfo variable.
                        $scope.userInfo = {
                            name: result.data.response.user.firstName + " " + result.data.response.user.lastName,
                            gender: result.data.response.user.gender,
                            email: result.data.response.user.contact.email,
                            pictureProfileUrl: result.data.response.user.photo.prefix + "256x256" + result.data.response.user.photo.suffix,
                            id: result.data.response.user.id,
                            homeCity: result.data.response.user.homeCity,
                            access_token: $scope.accessToken
                        };
                        // Store user profile information to localStorage service.
                        localStorage.set("Foursquare", $scope.userInfo);
                        // Navigate to foursquare profile page.
                        $scope.navigateTo("app.foursquareProfile");
                    });

                }
                , function (error) {
                    // Error retrieve data.
                    console.log(error);
                });
            $scope.isLoading = false;
        }
    };// End login.
    $scope.initialForm();
});// End of foursquare login controller.

// Controller of foursquare Profile Page.
appControllers.controller('foursquareProfileCtrl', function ($scope, $timeout, $mdDialog, $state, $ionicHistory, $stateParams, $cordovaOauth, $http, localStorage) {
    
    // This function is the first activity in the controller. 
    // It will initial all variable data and let the function works when page load.
    $scope.initialForm = function () {

        // $scope.userInfo is the variable for store user profile information
        // It get data from localStorage service.
        $scope.userInfo = localStorage.get("Foursquare");

        // $scope.loading is the variable for loading progress.
        $scope.loading = true;

        // The function for show/hide loading progress.
        $timeout(function () {
            $scope.loading = false;
        }, 2000);
    };// End initialForm.

    // navigateTo is for navigate to other page 
    // by using targetPage to be the destination page.
    // Parameter :  
    // targetPage = destination page.
    $scope.navigateTo = function (targetPage) {
        $state.go(targetPage);
    };// End navigateTo.

    // logOut is for log out it will clear foursquare data in localStorage service.
    $scope.logOut = function ($event) {
        //mdDialog.show use for show alert box for Confirm to log out.
        $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            targetEvent: $event,
            locals: {
                displayOption: {
                    title: "Confirm to Logout",
                    content: "Do you want to logout Foursquare?",
                    ok: "Confirm",
                    cancel: "Close"
                }
            }
        }).then(function () {
            // For confirm button to log out.
            // Clear foursquare data in localStorage service.
            localStorage.set("Foursquare", null);
            $scope.userinfoData = localStorage.get("Foursquare");
            // Navigate to log in page.
            if ($scope.userinfoData == null) {
                $state.go('app.foursquareLogin');
            }

        }, function () {
            // For cancel button to log out.
        });
    };// End logOut.
    $scope.initialForm();

});// End of foursquare profile controller.

// Controller of foursquare feed Page.
appControllers.controller('foursquareFeedCtrl', function ($scope, $filter, $state, $ionicHistory, $stateParams, $cordovaOauth, $http, localStorage) {

    // This function is the first activity in the controller. 
    // It will initial all variable data and let the function works when page load.
    $scope.initialForm = function () {
        // $scope.feedList is the variable that store feed data.
        $scope.feedList = [];

        // $scope.today is current date
        $scope.today = $filter('date')(new Date(), "yyyyMMdd");

        // $scope.feedList is the variable for loading status.
        $scope.shouldLoadData = true;

        // $scope.userInfo is the variable for store user profile information
        // It get data from localStorage service.
        $scope.userInfo = localStorage.get("Foursquare");
    }// End initialForm.

    // getFeedData is for get feed by calling to foursquare API.
    // Parameter :  
    // IsInit(bool) = for check that page are loading more data or refresh data.
    $scope.getFeedData = function (IsInit) {

        // Call http service with this api to get foursquare feed data.
        // By send parameter access_token that get from foursquare user profile from localStorage.
        // v for version date.
        $http.get("https://api.foursquare.com/v2/users/self/tips?sort=recent", {
            params: {
                oauth_token: $scope.userInfo.access_token,
                v: $scope.today
            }
        }).then(function (result) {
            // Success retrieve data by calling http service.

                // Store feed data to $scope.feedList variable to show in feed.
                $scope.feedList = result.data.response.tips.items;

                // To stop loading progress.
                if (IsInit == true) {
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                } else {
                    $scope.$broadcast('scroll.refreshComplete');
                }
                $scope.shouldLoadData = false;
            },
            function (error) {
                // Error retrieve data it will log out.
                if (error.data.meta.code = 401) {
                    $scope.logout();
                }
            });
    };// End getFeedData.

    // logout for log out.
    $scope.logout = function () {
        // Clear foursquare data in localStorage service.
        localStorage.set("Foursquare", null);
        // Navigate to log in page.
        $ionicHistory.nextViewOptions({
            disableBack: true
        });
        $scope.userinfoData = localStorage.get("Foursquare");
        if ($scope.userinfoData == null) {
            $state.go('app.foursquareLogin');
        };
    };// End logout.

    // doRefresh is for refresh feed.
    $scope.doRefresh = function () {
        $scope.shouldLoadData = true;
        $scope.getFeedData(false);
    };// End doRefresh.
    $scope.initialForm();

});// End of foursquare feed controller.
