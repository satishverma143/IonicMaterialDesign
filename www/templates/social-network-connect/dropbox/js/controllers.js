// For connecting with dropbox you have to install $cordovaOauth by running the following
// command in your cmd.exe for windows or terminal for mac:
// $ cd your_project_path
// $ ionic plugin remove org.apache.cordova.inappbrowser
// $ ionic plugin add org.apache.cordova.inappbrowser
// 
// Learn more about $cordovaOauth :
// http://ngcordova.com/docs/plugins/oauth/
// 
// object schema of dropboxProfile that keep in localStorage is: 
// [{
//  name: dropbox name,
//  id: dropbox id,
//  email: email,
//  link: link,
//  access_token: access_token
// }]
// 
// Controller of dropbox login Page.
appControllers.controller('dropboxLoginCtrl', function ($scope, $state, $cordovaOauth, $http, localStorage) {

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
            id: "",
            email: "",
            link: "",
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

    // goToUserProfile is for navigate to dropbox Profile page.
    $scope.goToUserProfile = function () {
        if ($scope.isLoading == false) {
            $scope.isLoading = true;
            $scope.navigateTo('app.dropboxProfile');
            $scope.isLoading = false;
        }
    };// End goToUserProfile.

   //getUserProfile is for get user information form localStorage by calling localStorage.get service.
    $scope.getUserProfile = function () {
        $scope.userInfo = localStorage.get("Dropbox");
        if ($scope.userInfo != null) {
            $scope.isLogin = true;
        }

        return $scope.userInfo;
    };// End getUserProfile.

    // login for dropbox login.
    $scope.login = function () {
        if ($scope.isLoading == false) {
            $scope.isLoading = true;

            // Calling $cordovaOauth.dropbox for login dropbox.
            // Format:
            // $cordovaOauth.dropbox(APP_KEY,[DROPBOX_PERMISION]) 
            // For APP_KEY is window.globalVariable.oAuth.dropbox from www/js/app.js at globalVariable session.
            $cordovaOauth.dropbox(window.globalVariable.oAuth.dropbox).then(function (result) {
                 //After call cordovaOauth.dropbox it will return access_token for you to calling dropbox API.
                    $scope.accessToken = result.access_token;
                     // Calling http service for getting user profile from dropbox.
                    $http.get("https://api.dropbox.com/1/account/info?access_token=" + result.access_token, {
                        params: {}
                    }).then(function (result) {
                        // Success retrieve data by calling http service.
                        // Store user profile information from dropbox API to userInfo variable.
                        $scope.userInfo = {
                            name: result.data.display_name,
                            id: result.data.uid,
                            email: result.data.email,
                            link: result.data.referral_link,
                            access_token: $scope.accessToken
                        };
                        // Store user profile information to localStorage service.
                        localStorage.set("Dropbox", $scope.userInfo);
                        // Navigate to dropbox profile page.
                        $scope.navigateTo("app.dropboxProfile");
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
});// End of dropbox login controller.

// Controller of dropbox profile Page.
appControllers.controller('dropboxProfileCtrl', function ($mdDialog, $scope, $state, $stateParams, $cordovaOauth, $ionicHistory, $http, localStorage, $timeout) {
    
    // This function is the first activity in the controller. 
    // It will initial all variable data and let the function works when page load.
    $scope.initialForm = function () {
       
        // $scope.userInfo is the variable for store user profile information
        // It get data from localStorage service.
        $scope.userInfo = localStorage.get("Dropbox");

        // $scope.loading is the variable for loading progress.
        $scope.loading = true;

        // The function for show/hide loading progress.
        $timeout(function () {
            if ($scope.isAndroid) {
                jQuery('#dropbox-profile-loading-progress').show();
            }
            else {
                jQuery('#dropbox-profile-loading-progress').fadeIn(700);
            }
        }, 400);

        $timeout(function () {
            jQuery('#dropbox-profile-loading-progress').hide();
            jQuery('#dropbox-profile-content').fadeIn();
        }, 2000);
    };// End initialForm.

    // navigateTo is for navigate to other page 
    // by using targetPage to be the destination page.
    // Parameter :  
    // targetPage = destination page.
    $scope.navigateTo = function (targetPage) {
        $state.go(targetPage);
    };// End navigateTo.

    // logOut is for log out it will clear dropbox data in localStorage service.
    $scope.logOut = function ($event) {
        $mdDialog.show({
            //mdDialog.show use for show alert box for Confirm to log out.
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            targetEvent: $event,
            locals: {
                displayOption: {
                    title: "Confirm to Logout",
                    content: "Do you want to logout Dropbox?",
                    ok: "Confirm",
                    cancel: "Close"
                }
            }
        }).then(function () {
            // For confirm button to log out.
            // Clear dropbox data in localStorage service.
            localStorage.set("Dropbox", null);
            // Navigate to log in page.
            $state.go('app.dropboxLogin');
            $scope.userinfoData = localStorage.get("Dropbox");
            if ($scope.userinfoData == null) {
                $state.go('app.dropboxLogin');
            }

        }, function () {
             // For cancel button to log out.
        });

    };// End logOut.

    $scope.initialForm();

});// End of dropbox profile controller.

// Controller of dropbox feed Page.
appControllers.controller('dropboxFeedCtrl', function ($scope, $state, $ionicHistory, $stateParams, $mdDialog, $cordovaOauth, $http, $filter, localStorage) {
    
    // This function is the first activity in the controller. 
    // It will initial all variable data and let the function works when page load.
    $scope.initialForm = function () {
        // $scope.feedList  is the variable that store feed data.
        $scope.feedList = [];

        // $scope.feedList  is the variable  for loading status.
        $scope.shouldLoadData = true;

        // $scope.userInfo is the variable for store user profile information
        // It get data from localStorage service.s
        $scope.userInfo = localStorage.get("Dropbox");
    }
    // popUpFileName for show pop up file name and detail.
    $scope.popUpFileName = function (fileData, $event) {
        var optionDropboxDialog = $mdDialog.alert()
            .parent(angular.element(document.body))
            .title(fileData.path + ' (' + fileData.size + ')')
            .content('Last Modified : ' + $filter('date')(new Date(fileData.modified), "MMM dd yyyy"))
            .ariaLabel('Alert Dialog filename')
            .ok('OK')
            .targetEvent($event)
        $mdDialog.show(optionDropboxDialog);
    };// End popUpFileName.

    // getFeedData is for get feed by calling to dropbox API.
    // Parameter :  
    // IsInit(bool) = for check that page are loading more data or refresh data.
    $scope.getFeedData = function (IsInit) {
        $scope.isLoading = true;
        // Call http service with this api to get dropbox feed data.
        // By send parameter access_token that get from dropbox user profile from localStorage.
        $http.get("https://api.dropbox.com/1/metadata/auto", {
            params: {
                access_token: $scope.userInfo.access_token
            }
        }).then(function (result) {
            // Success retrieve data by calling http service.

                // store feed data to  $scope.feedList variable to show in feed.
                $scope.feedList = result.data.contents;

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
                if (error.status = 401) {
                    $scope.logout();
                }
            });
    };// End getFeedData.

    //getIcon to get icon for file name.
    $scope.getIcon = function (icon) {
        var iconName = icon.substr(0, 6);
        if (iconName == "folder") {
            return "fa fa-folder-o";
        }
        else {
            return "fa fa-file-o";
        }
    };// End getIcon.

    // logout for log out.
    $scope.logout = function () {
        // Clear dropbox data in localStorage service.
        localStorage.set("Dropbox", null);
        // Navigate to log in page.
        $ionicHistory.nextViewOptions({
            disableBack: true
        });
        $scope.userinfoData = localStorage.get("Dropbox");
        if ($scope.userinfoData == null) {
            $state.go('app.dropboxLogin');
        };
    };// End logout.

    // doRefresh is for refresh feed.
    $scope.doRefresh = function () {
        $scope.shouldLoadData = true;
        $scope.getFeedData(false);
    };// End doRefresh.

    $scope.initialForm();
}); // End of dropbox feed controller.
