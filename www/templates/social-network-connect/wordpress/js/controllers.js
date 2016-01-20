// Controller of WordPress feed Page.
// To connect with WordPress feed you have to install WP REST API to your WordPress site.
// by this link: https://wordpress.org/plugins/json-rest-api/
// Add WP REST API plugin to your WordPress site.
// Set website format to support with WP REST API.
// You can find more information at project documentation.

appControllers.controller('wordpressFeedCtrl', function ($scope, $http, $state, $stateParams, $ionicHistory) {
    
    // This function is the first activity in the controller. 
    // It will initial all variable data and let the function works when page load.
    $scope.initialForm = function () {
        // $scope.feedList is the variable that store feed data from wordPress API.
        $scope.feedList = [];

        // $scope.paging is the variable that store page index of feed data from wordPress API.
        $scope.paging = {
            page: 1,
            shouldLoadData: false
        };

        // $scope.wordpressUrl is the variable that use to call wordPress API.
        // It get wordpressUrl from state parameter that pass from wordpressLogin page.
        $scope.wordpressUrl = $stateParams.wordpressUrl;

        // $scope.isLoading is the variable use for loading.
        $scope.isLoading = false;
    };// End initialForm.

    // getPostData is for get feed by calling to wordpress API.
    // Parameter :  
    // IsInit(bool) = for check that page are loading more data or refresh data.
    $scope.getPostData = function (IsInit) {

        // API format is YOUR_WORDPRESS_URL/wp-json/posts?_jsonp=JSON_CALLBACK&page=PAGE_NUMBER
        var dataURL = $scope.wordpressUrl + "/wp-json/posts?_jsonp=JSON_CALLBACK&page=" + $scope.paging.page;

        // http will return feed data.
        $http.jsonp(dataURL).success(function (data, status, headers, config) {
            // Success retrieve data by calling http service.

            // If it don't have data. Loading progress will stop and appear empty feed.
            if (data.length == 0) {
                $scope.paging.shouldLoadData = true;
            } 

            // If have data it will store feed data to  $scope.feedList variable to show in feed.
            else {
                for (var postItem = 0; postItem < data.length; postItem++) {
                    $scope.feedList.push(data[postItem]);
                }
                $scope.paging.page = $scope.paging.page + 1;
            }

            // To stop loading progress.
            if (IsInit == true) {
                $scope.$broadcast('scroll.infiniteScrollComplete');
            } else {
                $scope.$broadcast('scroll.refreshComplete');
            }

            $scope.isLoading = false;
        }).
            error(function (data, status, headers, config) {
                // Error retrieve data  it will navigate back to wordpressLogin page.
                $scope.isLoading = false;

                $ionicHistory.nextViewOptions({
                    disableBack: true
                });

                $state.go("app.wordpressLogin", {
                    isShowError: true
                });

            });
    };// End getPostData.

    // navigateTo is for navigate to other page 
    // by using targetPage to be the destination page.
    // Sending objectData and wordpress url to the destination page.
    // Parameter :  
    // targetPage = destination page.
    // objectData = object that will sent to destination page.
    // wordpressUrl = wordpress url
    $scope.navigateTo = function (targetPage, objectData, wordpressUrl) {
        $state.go(targetPage, {
            postDetail: objectData,
            wordpressUrl: wordpressUrl
        });
    };// End navigateTo.

    // goBack is for navigate back to wordpressLogin page 
    $scope.goBack = function () {
        $ionicHistory.nextViewOptions({
            disableBack: true
        });
        $state.go("app.wordpressLogin", {
            isShowError: false
        });
    }// End goBack.

    // doRefresh is for refresh feed and it will set page number to be 1 for refresh.
    $scope.doRefresh = function () {
        $scope.feedList = [];
        $scope.paging.page = 1;
        $scope.paging.shouldLoadData = false;
        $scope.getPostData(false);
    };// End doRefresh.

    // loadMore is for loading more feed.
    $scope.loadMore = function () {
        if ($scope.isLoading == false) {
            $scope.isLoading = true;
            $scope.getPostData(true);
        }
    };// End loadMore.

    $scope.initialForm();
});// End of WordPress Feed Page  Controller.

// Controller of WordPress Post Page.
appControllers.controller('wordpressPostCtrl', function ($scope, $http, $timeout, $stateParams) {

    // This function is the first activity in the controller. 
    // It will initial all variable data and let the function works when page load.
    $scope.initialForm = function () {

        // $scope.post  is post that pass from state parameter from WordPress Feed.
        $scope.post = $stateParams.postDetail;

        // $scope.wordpressUrl  is url that pass from state parameter from WordPress Feed.
        $scope.wordpressUrl = $stateParams.wordpressUrl;

        // $scope.comments  is the variable that store comments of post.
        $scope.comments = [];

        //To get comment.
        $scope.getcomment();

        // The function for show/hide loading progress.
        $timeout(function () {
            if ($scope.isAndroid) {
                jQuery('#wordpress-post-loading-progress').show();
            }
            else {
                jQuery('#wordpress-post-loading-progress').fadeIn(700);
            }
        }, 400);// End loading progress.
    }// End initialForm.

     // get comment is for get comment by calling to wordpress API.
    $scope.getcomment = function () {
        // API format is YOUR_WORDPRESS_URL/wp-json/posts/POST_ID/comments
        $http.get($scope.wordpressUrl + "/wp-json/posts/" + $scope.post.ID + "/comments", {
            params: {}
        }).then(function (result) {
            //success retrieve data by calling http service. it will store comment data to $scope.comments.
                $scope.comments = result.data;
                $timeout(function () {
                    jQuery('#wordpress-post-loading-progress').hide();
                    jQuery('#wordpress-post-content').fadeIn();
                }, 1000);
            },
            function (error) {
                //Error retrieve data.
            });
    };// End get comment.
    $scope.initialForm();
});// End of WordPress Post Page Controller.

// Controller of WordPress Login Page.
appControllers.controller('wordpressLoginCtrl', function ($mdToast, $scope, $state, $stateParams) {

    // This function is the first activity in the controller. 
    // It will initial all variable data and let the function works when page load.
    $scope.initialForm = function () {
        // $scope.wpUrl is the variable that store wordPress url.
        $scope.wpUrl = "http://YOUR_WORDPRESS_URL";

        // If wordPress url is error it will show that Can not connect to Url toast.
        if ($stateParams.isShowError) {
            $mdToast.show({
                controller: 'toastController',
                templateUrl: 'toast.html',
                hideDelay: 1200,
                position: 'top',
                locals: {
                    displayOption: {
                        title: "Can not connect to Url."
                    }
                }
            });
        }
    };// End initialForm.

    // login is for url login.
    $scope.login = function (wpUrl) {
        $state.go("app.wordpressFeed", {
            wordpressUrl: wpUrl
        });
    };// End login.

    $scope.initialForm();
});// End of WordPress Login Page  Controller.