// For connecting with facebook you have to install $cordovaOauth by running the following
// command in your cmd.exe for windows or terminal for mac:
// $ cd your_project_path
// $ ionic plugin remove org.apache.cordova.inappbrowser
// $ ionic plugin add org.apache.cordova.inappbrowser
// 
// Learn more about $cordovaOauth :
// http://ngcordova.com/docs/plugins/oauth/
// 
// object schema of facebookProfile that keep in localStorage is: 
// [{
//  name: facebook name,
//  first_name: facebook firstname,
//  last_name: facebook lastname,
//  email: email,
//  birthday: birthday,
//  link: facebook link,
//  cover: facebook cover,
//  pictureProfileUrl: facebook picture profile url,
//  gender: gender,
//  id: facebook id,
//  access_token: access_token
// }]
// 
// Controller of facebook login Page.
appControllers.controller('facebookLoginCtrl', function ($scope, $state, $cordovaOauth, $http, localStorage) {

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
            first_name: "",
            last_name: "",
            email: "",
            birthday: "",
            link: "",
            cover: "",
            pictureProfileUrl: "",
            gender: "",
            id: "",
            access_token: ""
        };

        // Getting user information.
        $scope.userInfo = $scope.getUserProfile();
    }; // End initialForm.

    // navigateTo is for navigate to other page 
    // by using targetPage to be the destination page.
    // Parameter :  
    // targetPage = destination page.
    $scope.navigateTo = function (targetPage) {
        $state.go(targetPage);
    };// End navigateTo.

    // goToUserProfile is for navigate to facebook Profile page.
    $scope.goToUserProfile = function () {
        if ($scope.isLoading == false) {
            $scope.isLoading = true;
            $scope.navigateTo('app.facebookProfile');
            $scope.isLoading = false;
        }
    };// End goToUserProfile.

    //getUserProfile is for get user information form localStorage by calling localStorage.get service.
    $scope.getUserProfile = function () {
        $scope.userInfo = localStorage.get("Facebook");
        if ($scope.userInfo != null) {
            $scope.isLogin = true;
        }
        ;
        return $scope.userInfo;
    };// End getUserProfile.

    // login for facebook login
    $scope.login = function () {
        if ($scope.isLoading == false) {
            $scope.isLoading = true;

            // Calling $cordovaOauth.facebook for login facebook.
            // Format:
            // $cordovaOauth.facebook(APP_ID,[FACEBOOK_PERMISION]) 
            // For APP_ID is window.globalVariable.oAuth.facebook from www/js/app.js at globalVariable session.
            $cordovaOauth.facebook(window.globalVariable.oAuth.facebook, ["publish_actions", "user_status", "user_birthday", "user_posts", "user_events"
                , "email", "user_actions.news", "user_friends", "public_profile"]).then(function (result) {
            //After call cordovaOauth.facebook it will return access_token for you to calling facebook API.

                    $scope.accessToken = result.access_token;
                    // Calling http service for getting user profile from facebook.
                    // By send parameter access_token , fields, format.
                    $http.get("https://graph.facebook.com/v2.4/me", {
                        params: {
                            access_token: result.access_token,
                            fields: "birthday,first_name,email,last_name,name,link,cover,gender,id",
                            format: "json"
                        }
                    }).then(function (result) {
                        // Success retrieve data by calling http service.
                        // Store user profile information from facebook API to userInfo variable.
                        $scope.userInfo = {
                            name: result.data.name,
                            first_name: result.data.first_name,
                            last_name: result.data.last_name,
                            email: result.data.email,
                            birthday: result.data.birthday,
                            link: result.data.link,
                            cover: result.data.cover,
                            pictureProfileUrl: "http://graph.facebook.com/" + result.data.id + "/picture?width=500&height=500",
                            gender: result.data.gender,
                            id: result.data.id,
                            access_token: $scope.accessToken
                        };
                        // Store user profile information to localStorage service.
                        localStorage.set("Facebook", $scope.userInfo);
                        // Navigate to facebook profile page.
                        $scope.navigateTo("app.facebookProfile");
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

});// End of facebook login controller.

// Controller of facebook profile Page.
appControllers.controller('facebookProfileCtrl', function ($mdDialog, $scope, $state, $stateParams, $cordovaOauth, $ionicHistory, $http, localStorage, $timeout) {

    // This function is the first activity in the controller. 
    // It will initial all variable data and let the function works when page load.
    $scope.initialForm = function () {

        // $scope.userInfo is the variable for store user profile information
        // It get data from localStorage service.
        $scope.userInfo = localStorage.get("Facebook");

        // $scope.loading is the variable for loading progress.
        $scope.loading = true;

        // The function for show/hide loading progress.
        $timeout(function () {
            $scope.loading = false;
        }, 2000);
    };// End initialForm.

    // navigateTo is for navigate to other page 
    // by using targetPage to be the destination page 
    // and sending objectData to the destination page.
    // Parameter :  
    // targetPage = destination page.
    // objectData = object that will sent to destination page.
    $scope.navigateTo = function (targetPage, objectData) {
        $state.go(targetPage, {
            access_token: objectData
        });
    };// End navigateTo.

    // logOut is for log out it will clear facebook data in localStorage service.
    $scope.logOut = function ($event) {
        //mdDialog.show use for show alert box for Confirm to log out.
        $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            targetEvent: $event,
            locals: {
                displayOption: {
                    title: "Confirm to Logout",
                    content: "Do you want to logout Facebook?",
                    ok: "Confirm",
                    cancel: "Close"
                }
            }
        }).then(function () {
            // For confirm button to log out.
            // Clear facebook data in localStorage service.
            localStorage.set("Facebook", null);
            $scope.userinfoData = localStorage.get("Facebook");

            // Navigate to log in page.
            if ($scope.userinfoData == null) {
                $state.go('app.facebookLogin');
            }

        }, function () {
            // For cancel button to log out.
        });


    };// End logOut.

    $scope.initialForm();

});// End of facebook profile controller.

// Controller of facebook feed Page.
appControllers.controller('facebookFeedCtrl', function ($scope, $state, $ionicHistory, $stateParams, $cordovaOauth, $http, localStorage) {
   
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
        $scope.userInfo = localStorage.get("Facebook");

        // $scope.loading is the variable for loading progress.
        $scope.isLoading = false;

        // $scope.feedList is the variable that store feed data.
        $scope.feedList = [];

    }; // End initialForm.

    // getFeedData is for get feed by calling to facebook API.
    // Parameter :  
    // IsInit(bool) = for check that page are loading more data or refresh data.
    $scope.getFeedData = function (IsInit) {

        // Call http service with this api to get facebook feed data.
        // By send parameter access_token that get from facebook user profile from localStorage.
        $http.get("https://graph.facebook.com/me/feed?fields=from,full_picture,message,created_time,icon,to,id,caption,link,picture,shares,likes.limit(1).summary(true),comments.limit(1).summary(true)", {
            params: {
                access_token: $scope.userInfo.access_token
            }
        }).then(function (result) {
             // Success retrieve data by calling http service.

                // Store feed data to $scope.feedList variable to show in feed.
                $scope.feedList = result.data.data;

                // If it don't have data. Loading progress will stop and appear empty feed.
                if ($scope.feedList == []) {
                    $scope.paging.shouldLoadData = true;
                }
                // Checking for next page data
                if (result.data.paging.next == null) {
                    $scope.paging.shouldLoadData = true;
                }
                else {
                    $scope.paging.next = result.data.paging.next;
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
                if (error.data.error.code = 190) {
                    $scope.logout();
                }

            });
    }; // End getFeedData.

    // logout for log out.
    $scope.logout = function () {

        // Clear facebook data in localStorage service.
        localStorage.set("Facebook", null);

        // Navigate to log in page.
        $ionicHistory.nextViewOptions({
            disableBack: true
        });
        $scope.userinfoData = localStorage.get("Facebook");
        if ($scope.userinfoData == null) {
            $state.go('app.facebookLogin');
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

             // If it don't have data. Loading progress will stop.
            if(result.data.data.length == 0){
                $scope.paging.shouldLoadData = true;
            }

            // Storing feed data to $scope.feedList.
            for (var feedItem = 0; feedItem < result.data.data.length; feedItem++) {
                $scope.feedList.push(result.data.data[feedItem]);
            }

            // Checking for next page data.
            if (result.data.paging.next == null) {
                $scope.paging.shouldLoadData = true;
            } else {
                $scope.paging.next = result.data.paging.next;
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

});// End of facebook feed controller.

// Controller of facebook friend list Page.
appControllers.controller('facebookFriendListCtrl', function ($scope, $state, $ionicHistory, $stateParams, $cordovaOauth, $http, localStorage) {
    
    // This function is the first activity in the controller. 
    // It will initial all variable data and let the function works when page load.
    $scope.initialForm = function () {

        // $scope.paging is the variable that store page index of friends list data.
        $scope.paging = {
            next: "",
            shouldLoadData: false
        };

        // $scope.userInfo is the variable for store user profile information
        // It get data from localStorage service.
        $scope.userInfo = localStorage.get("Facebook");

        // $scope.loading is the variable for loading progress.
        $scope.isLoading = false;

        // $scope.feedList  is the variable that store friends list data.
        $scope.friendsList = [];

    }; // End initialForm.

    // getFriendsData is for get friend list by calling to facebook API.
    // Parameter :  
    // IsInit(bool) = for check that page are loading more data or refresh data.
    $scope.getFriendsData = function (IsInit) {

        // call http service with this api to get facebook friend list data.
        // By send parameter access_token that get from facebook user profile from localStorage.
        $http.get("https://graph.facebook.com/me/taggable_friends", {
            params: {
                access_token: $scope.userInfo.access_token

            }
        }).then(function (result) {
            // Success retrieve data by calling http service.

                // Store friend list data to  $scope.feedList variable to show in page.
                $scope.friendsList = result.data.data;

                // If it don't have data. Loading progress will stop and appear empty feed.
                if ($scope.friendsList == []) {
                    $scope.paging.shouldLoadData = true;
                }

                // Checking for next page data
                if (result.data.paging.next == null) {
                    $scope.paging.shouldLoadData = true;
                }
                else {
                    $scope.paging.next = result.data.paging.next;
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
                if (error.data.error.code = 190) {
                    $scope.logout();
                }

            });
    }; // End getFeedData.

     // logout for log out.
    $scope.logout = function () {
         // Clear facebook data in localStorage service.
        localStorage.set("Facebook", null);
        // Navigate to log in page.
        $ionicHistory.nextViewOptions({
            disableBack: true
        });
        $scope.userinfoData = localStorage.get("Facebook");
        if ($scope.userinfoData == null) {
            $state.go('app.facebookLogin');
        }
        ;
    }; // End logout.

    // getNextFriendsData for get next page of friend list data.
    $scope.getNextFriendsData = function () {
        $scope.isLoading = true;

        // Call http service with $scope.paging.next url that get from the previous friend list.
        $http.get($scope.paging.next, {
            params: {
                format: "json"
            }
        }).then(function (result) {
            // Success retrieve data by calling http service.

            // Storing friend list data to $scope.friendsList.
            for (var friendsItem = 0; friendsItem < result.data.data.length; friendsItem++) {
                $scope.friendsList.push(result.data.data[friendsItem]);
            }

             // Checking for next page data.
            if (result.data.paging.next == null) {
                $scope.paging.shouldLoadData = true;
            } else {
                $scope.paging.next = result.data.paging.next;
            }// End checking for next page data.

            // To stop loading progress.
            $scope.$broadcast('scroll.infiniteScrollComplete');
            $scope.isLoading = false;
        });
    }; // End getNextFriendsData.
    
    // doRefresh is for refresh friends list. 
    $scope.doRefresh = function () {
        $scope.paging.shouldLoadData = false;
        $scope.getFriendsData(false);
    };// End doRefresh.

    // loadMore is for loading more friends list. 
    $scope.loadMore = function () {
        if ($scope.isLoading == false) {
            $scope.isLoading = true;
            if ($scope.paging.next == "") {
                $scope.getFriendsData(true);
            } else {
                $scope.getNextFriendsData();
            }
        }
    };// End loadMore.

    $scope.initialForm();
});// End of facebook friend list controller.
