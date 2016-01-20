// For connecting with instagram you have to install $cordovaOauth by running the following
// command in your cmd.exe for windows or terminal for mac:
// $ cd your_project_path
// $ ionic plugin remove org.apache.cordova.inappbrowser
// $ ionic plugin add org.apache.cordova.inappbrowser
// 
// Learn more about $cordovaOauth :
// http://ngcordova.com/docs/plugins/oauth/
//
// object schema of instagramProfile that keep in localStorage is: 
// [{
//  name: instagram name,
//  bio: bio,
//  website: website,
//  pictureProfileUrl: instagram picture profile url,
//  id: instagram id,
//  post: post,
//  followers: followers,
//  following: following,
//  access_token: access_token
// }]
// 
// Controller of instagram login Page.
appControllers.controller('instagramLoginCtrl', function ($scope, $state, $cordovaOauth, $http, localStorage) {

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
            bio: "",
            website: "",
            pictureProfileUrl: "",
            id: "",
            post: 0,
            followers: 0,
            following: 0,
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

    // goToUserProfile is for navigate to instagram Profile page.
    $scope.goToUserProfile = function () {
        if ($scope.isLoading == false) {
            $scope.isLoading = true;
            $scope.navigateTo('app.instagramProfile');
            $scope.isLoading = false;
        }
    };// End goToUserProfile.

    //getUserProfile is for get user information form localStorage by calling localStorage.get service.
    $scope.getUserProfile = function () {
        $scope.userInfo = localStorage.get("Instagram");
        if ($scope.userInfo != null) {
            $scope.isLogin = true;
        }
        ;
        return $scope.userInfo;
    };// End getUserProfile.

    // login for instagram.
    $scope.login = function () {
        if ($scope.isLoading == false) {
            $scope.isLoading = true;

            // Calling $cordovaOauth.instagram for login instagram.
            // Format:
            // $cordovaOauth.instagram(CLIENT_ID,[INSTAGRAM_PERMISION]) 
            // For CLIENT_ID is window.globalVariable.oAuth.instagram from www/js/app.js at globalVariable session.
            $cordovaOauth.instagram(window.globalVariable.oAuth.instagram, ["basic", "likes", "comments"]).then(function (result) {
                 //After call cordovaOauth.instagram it will return access_token for you to calling instagram API.
                    $scope.accessToken = result.access_token;
                    // Calling http service for getting user profile from instagram.
                    // By send parameter access_token , format.
                    $http.get("https://api.instagram.com/v1/users/self", {
                        params: {
                            access_token: result.access_token,
                            format: "json"
                        }
                    }).then(function (result) {
                        // Success retrieve data by calling http service.
                        // Store user profile information from instagram API to userInfo variable.
                        $scope.userInfo = {
                            name: result.data.data.username,
                            bio: result.data.data.bio,
                            website: result.data.data.website,
                            pictureProfileUrl: result.data.data.profile_picture,
                            id: result.data.data.id,
                            post: result.data.data.counts.media,
                            followers: result.data.data.counts.followed_by,
                            following: result.data.data.counts.follows,
                            access_token: $scope.accessToken
                        };
                        // Store user profile information to localStorage service.
                        localStorage.set("Instagram", $scope.userInfo);
                        // Navigate to instagram profile page.
                        $scope.navigateTo("app.instagramProfile");

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
});// End of instagram login controller.

// Controller of instagram profile Page.
appControllers.controller('instagramProfileCtrl', function ($mdDialog, $scope, $state, $stateParams, $cordovaOauth, $ionicHistory, $http, localStorage, $timeout) {
    
    // This function is the first activity in the controller. 
    // It will initial all variable data and let the function works when page load.
    $scope.initialForm = function () {

        // $scope.userInfo is the variable for store user profile information
        // It get data from localStorage service.
        $scope.userInfo = localStorage.get("Instagram");

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

    // logOut is for log out it will clear instagram data in localStorage service.
    $scope.logOut = function ($event) {
        //mdDialog.show use for show alert box for Confirm to log out.
        $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            targetEvent: $event,
            locals: {
                displayOption: {
                    title: "Confirm to Logout",
                    content: "Do you want to logout Instagram?",
                    ok: "Confirm",
                    cancel: "Close"
                }
            }
        }).then(function () {
            // For confirm button to log out.
            // Clear instagram data in localStorage service.
            localStorage.set("Instagram", null);
            $scope.userinfoData = localStorage.get("Instagram");
            // Navigate to log in page.
            if ($scope.userinfoData == null) {
                $state.go('app.instagramLogin');
            }


        }, function () {
           // For cancel button to log out.
        });


    };// End logOut.
    $scope.initialForm();
});// End of instagram profile controller.

// Controller of instagram feed Page.
appControllers.controller('instagramFeedCtrl', function ($scope, $state, $ionicHistory, $stateParams, $cordovaOauth, $http, localStorage) {

    // This function is the first activity in the controller. 
    // It will initial all variable data and let the function works when page load.
    $scope.initialForm = function () {

        // $scope.paging is the variable that store page index of feed data.
        $scope.paging = {
            next: "",
            shouldLoadData: false
        };
        // $scope.userInfo is the variable for store user profile information.
        // It get data from localStorage service.
        $scope.userInfo = localStorage.get("Instagram");

        // $scope.loading is the variable for loading progress.
        $scope.isLoading = false;

        // $scope.feedList  is the variable that store feed data.
        $scope.feedList = [];
    }// End initialForm.

    // getFeedData is for get feed by calling to instagram API.
    // Parameter :  
    // IsInit(bool) = for check that page are loading more data or refresh data.
    $scope.getFeedData = function (IsInit) {

        // Call http service with this api to get instagram feed data.
        // By send parameter access_token that get from instagram user profile from localStorage.
        $http.get("https://api.instagram.com/v1/users/self/feed", {
            params: {
                access_token: $scope.userInfo.access_token
            }
        })
            .then(function (result) {
                // Success retrieve data by calling http service.

                // store feed data to $scope.feedList variable to show in feed.
                $scope.feedList = result.data.data;

                // If it don't have data. Loading progress will stop and appear empty feed.
                if ($scope.feedList == []) {
                    $scope.paging.shouldLoadData = true;
                }
                // Checking for next page data
                if (result.data.pagination.next_url == null) {

                    $scope.paging.shouldLoadData = true;
                }
                else {
                    $scope.paging.next = result.data.pagination.next_url;
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
                if (error.data.meta.code = 400) {
                    $scope.logout();
                }
            });
    };// End getFeedData.

    // logout for log out.
    $scope.logout = function () {
        // Clear instagram data in localStorage service.
        localStorage.set("Instagram", null);

        // Navigate to log in page.
        $ionicHistory.nextViewOptions({
            disableBack: true
        });
        $scope.userinfoData = localStorage.get("Instagram");
        if ($scope.userinfoData == null) {
            $state.go('app.instagramLogin');
        };
    }; // End logout.

    // getNextFeedData for get next page of feed data.
    $scope.getNextFeedData = function () {
        $scope.isLoading = true;
        // Call http service with $scope.paging.next url that get from the previous feed.
        $http.get($scope.paging.next, {
            params: {
                format: "json"
            }
        }).then(function (result) {
            // Success retrieve data by calling http service.

            // Storing feed data to $scope.feedList.
            for (var feedItem = 0; feedItem < result.data.data.length; feedItem++) {
                $scope.feedList.push(result.data.data[feedItem]);
            }

            // Checking for next page data.
            if (result.data.pagination.next_url == null) {
                $scope.paging.shouldLoadData = true;
            } else {
                $scope.paging.next = result.data.pagination.next_url;
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

});// End of instagram feed controller.
