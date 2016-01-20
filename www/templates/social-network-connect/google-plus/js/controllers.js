// For connecting with google you have to install $cordovaOauth by running the following
// command in your cmd.exe for windows or terminal for mac:
// $ cd your_project_path
// $ ionic plugin remove org.apache.cordova.inappbrowser
// $ ionic plugin add org.apache.cordova.inappbrowser
// 
// Learn more about $cordovaOauth :
// http://ngcordova.com/docs/plugins/oauth/
//
// object schema of google plus profile that keep in localStorage is: 
// [{
//  name: google plus name,
//  email: email,
//  link: google plus link,
//  pictureProfileUrl: google plus profile url,
//  gender: gender,
//  id: google plus  id,
//  access_token: access_token
// }]
// 
// Controller of google plus login Page.
appControllers.controller('googlePlusLoginCtrl', function ($scope, $state, $cordovaOauth, $http, localStorage) {

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
            email: "",
            link: "",
            pictureProfileUrl: "",
            gender: "",
            id: "",
            access_token: ""
        };

        // Getting user information.
        $scope.userInfo = $scope.getUserProfile();
    };// End initialForm.

    // navigateTo is for navigate to other page 
    // by using targetPage to be the destination page.
    // Parameter :  
    // targetPage = destination page.
    $scope.navigateTo = function (targetPage) {
        $state.go(targetPage);
    };// End navigateTo.

    // goToUserProfile is for navigate to Google Plus Profile page.
    $scope.goToUserProfile = function () {
        if ($scope.isLoading == false) {
            $scope.isLoading = true;
            $scope.navigateTo('app.googlePlusProfile');
            $scope.isLoading = false;
        }
    };// End goToUserProfile.

    //getUserProfile is for get user information form localStorage by calling localStorage.get service.
    $scope.getUserProfile = function () {
        $scope.userInfo = localStorage.get("GooglePlus");
        if ($scope.userInfo != null) {
            $scope.isLogin = true;
        }
        ;
        return $scope.userInfo;
    };// End getUserProfile.

    // login for google login
    $scope.login = function () {
        if ($scope.isLoading == false) {
            $scope.isLoading = true;

            // Calling $cordovaOauth.google for login google.
            // Format:
            // $cordovaOauth.google(CLIENT_ID,[GOOGLE_PERMISION]) 
            // For CLIENT_ID is window.globalVariable.oAuth.googlePlus from www/js/app.js at globalVariable session.
            $cordovaOauth.google(window.globalVariable.oAuth.googlePlus
                , ["https://www.googleapis.com/auth/urlshortener",
                    "https://www.googleapis.com/auth/userinfo.email"]).then(function (result) {
                    //After call cordovaOauth.google it will return access_token for you to calling google API.

                    $scope.accessToken = result.access_token;
                    // Calling http service for getting user profile from google.
                    // By send parameter access_token, format.
                    $http.get("https://www.googleapis.com/oauth2/v1/userinfo", {
                        params: {
                            access_token: result.access_token,
                            format: "json"
                        }
                    }).then(function (result) {
                        // Success retrieve data by calling http service.
                        // Store user profile information from google API to userInfo variable.
                        $scope.userInfo = {
                            name: result.data.name,
                            email: result.data.email,
                            link: result.data.link,
                            pictureProfileUrl: result.data.picture,
                            gender: result.data.gender,
                            id: result.data.id,
                            access_token: $scope.accessToken
                        };
                        // Store user profile information to localStorage service.
                        localStorage.set("GooglePlus", $scope.userInfo);
                        // Navigate to google plus profile page.
                        $scope.navigateTo("app.googlePlusProfile");
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
});// End of google plus  login controller.

// Controller of google plus profile Page.
appControllers.controller('googlePlusProfileCtrl', function ($mdDialog, $scope, $state, $stateParams, $cordovaOauth, $ionicHistory, $http, localStorage, $timeout) {
    
    // This function is the first activity in the controller. 
    // It will initial all variable data and let the function works when page load.
    $scope.initialForm = function () {

        // $scope.userInfo is the variable for store user profile information
        // It get data from localStorage service.
        $scope.userInfo = localStorage.get("GooglePlus");

        // $scope.loading is the variable for loading progress.
        $scope.loading = true;

        // The function for show/hide loading progress.
        $timeout(function () {
            $scope.loading = false;
        }, 2000);
    };// End initialForm.

    // navigateTo is for navigate to other page 
    // by using targetPage to be the destination page 
    // Parameter :  
    // targetPage = destination page.
    $scope.navigateTo = function (targetPage) {
        $state.go(targetPage);
    };// End navigateTo

    // logOut is for log out it will clear google plus data in localStorage service.
    $scope.logOut = function ($event) {
        //mdDialog.show use for show alert box for confirm to log out.
        $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            targetEvent: $event,
            locals: {
                displayOption: {
                    title: "Confirm to Logout",
                    content: "Do you want to logout Google Plus?",
                    ok: "Confirm",
                    cancel: "Close"
                }
            }
        }).then(function () {
            // For confirm button to log out.
            // Clear google plus data in localStorage service.
            localStorage.set("GooglePlus", null);
            // Navigate to log in page.
            $scope.userinfoData = localStorage.get("GooglePlus");
            if ($scope.userinfoData == null) {
                $state.go('app.googlePlusLogin');
            }

        }, function () {
            // For cancel button to log out.
        });
    };// End logOut

    $scope.initialForm();

});// End of google plus  profile controller.

// Controller of google plus feed Page.
appControllers.controller('googlePlusFeedCtrl', function ($scope, $state, $ionicHistory, $stateParams, $cordovaOauth, $http, localStorage) {
    
    // This function is the first activity in the controller. 
    // It will initial all variable data and let the function works when page load.
    $scope.initialForm = function () {

        // $scope.paging is the variable that store page index of feed data.
        $scope.paging = {
            next: "",
            shouldLoadData: false
        };
        // $scope.userInfo is the variable for store user profile information
        // It get data from localStorage service.
        $scope.userInfo = localStorage.get("GooglePlus");

        // $scope.loading is the variable for loading progress.
        $scope.isLoading = false;

        // $scope.feedList  is the variable that store feed data.
        $scope.feedList = [];
    }// End initialForm.

    // getFeedData is for get feed by calling to google API.
    // Parameter :  
    // IsInit(bool) = for check that page are loading more data or refresh data.
    $scope.getFeedData = function (IsInit) {
        // Call http service with this api to get google plus feed data.
        // By send parameter access_token that get from google plus user profile from localStorage.
        $http.get("https://www.googleapis.com/plus/v1/people/me/activities/public", {
            params: {
                access_token: $scope.userInfo.access_token
            }
        })
            .then(function (result) {
                // Success retrieve data by calling http service.

                // Store feed data to $scope.feedList variable to show in feed.
                $scope.feedList = result.data.items;

                // If it don't have data. Loading progress will stop and appear empty feed.
                if ($scope.feedList == []) {
                    $scope.paging.shouldLoadData = true;
                };

                // Checking for next page data
                if (result.data.nextPageToken == null) {
                    $scope.paging.shouldLoadData = true;
                }
                else {
                    $scope.paging.next = result.data.nextPageToken;
                }// End checking for next page data.

                // To stop loading progress.
                if (IsInit == true) {
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                } else {
                    $scope.$broadcast('scroll.refreshComplete');
                }
                $scope.isLoading = false;
            }
            , function (error) {
                // Error retrieve data it will log out.
                if (error.code = 403) {
                    $scope.logout();
                }
                $scope.paging.shouldLoadData = true;
            });

    }; // End getFeedData.

    // logout for log out.
    $scope.logout = function () {
        // Clear google plus data in localStorage service.
        localStorage.set("GooglePlus", null);
        // Navigate to log in page.
        $ionicHistory.nextViewOptions({
            disableBack: true
        });
        $scope.userinfoData = localStorage.get("GooglePlus");
        if ($scope.userinfoData == null) {
            $state.go('app.googlePlusLogin');
        };
    };// End logout.

    // getNextFeedData for get next page of feed data.
    $scope.getNextFeedData = function () {
        $scope.isLoading = true;
        // Call http service with google API and send parameter pageToken that get from the previous feed.
        $http.get("https://www.googleapis.com/plus/v1/people/me/activities/public", {
            params: {
                access_token: $scope.userInfo.access_token,
                pageToken: $scope.paging.next
            }
        }).then(function (result) {
            // Success retrieve data by calling http service.

             // storing feed data to $scope.feedList.
            for (var feedItem = 0; feedItem < result.data.items.length; feedItem++) {
                $scope.feedList.push(result.data.items[feedItem]);
            }
            // Checking for next page data.
            if (result.data.nextPageToken == null) {

                $scope.paging.shouldLoadData = true;
            }
            else {

                $scope.paging.next = result.data.nextPageToken;
            }// End checking for next page data.

            // To stop loading progress.
            $scope.$broadcast('scroll.infiniteScrollComplete');
            $scope.isLoading = false;
        });
    };// End getNextFeedData.

    // doRefresh is for refresh feed.
    $scope.doRefresh = function () {
        $scope.paging.shouldLoadData = false;
        $scope.getFeedData(false);
    };// End doRefresh.

    // loadMore is for loading more feed.
    $scope.loadMore = function () {
        if ($scope.isLoading == false) {
            $scope.isLoading = true;
            if ($scope.paging.next == "") {
                $scope.getFeedData(true);
            } else {
                $scope.getNextFeedData();
            }
        }
    };// End loadMore.
    $scope.initialForm();

});// End of google plus feed controller.
