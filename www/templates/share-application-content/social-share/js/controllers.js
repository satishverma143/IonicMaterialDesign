// For using social share you have to install $cordovaSocialSharing by running the following
// command in your cmd.exe for windows or terminal for mac:
// $ cd your_project_path
// $ ionic plugin remove nl.x-services.plugins.socialsharing
// $ ionic plugin add https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin.git
// 
// Learn more about $cordovaSocialSharing :
// http://ngcordova.com/docs/plugins/socialSharing/
//
// For using save image  you have to install Canvas2ImagePlugin by running the following
// command in your cmd.exe for windows or terminal for mac:
// $ cd your_project_path
// $ ionic plugin remove org.devgeeks.Canvas2ImagePlugin
// $ ionic plugin add https://github.com/devgeeks/Canvas2ImagePlugin.git
// 
// Learn more about Canvas2ImagePlugin :
// https://github.com/devgeeks/Canvas2ImagePlugin
//
// Controller of product list Page.
appControllers.controller('productListCtrl', function ($scope, $timeout, $state, $http) {

    // This function is the first activity in the controller. 
    // It will initial all variable data and let the function works when page load.
    $scope.initialForm = function () {
        // $scope.productList is the variable that store user product data.
        $scope.productList = [];

        // Loading progress.
        $timeout(function () {
            if ($scope.isAndroid) {
                jQuery('#product-list-loading-progress').show();
            }
            else {
                jQuery('#product-list-loading-progress').fadeIn(700);
            }
        }, 400);
        $timeout(function () {
            jQuery('#product-list-loading-progress').hide();
            jQuery('#product-list-content').fadeIn();
        }, 4000);// End loading progress.
    };// End initialForm.

    // navigateTo is for navigate to other page.
    // by using targetPage to be the destination page
    // and send object to the destination page.
    // Parameter :  
    // targetPage = destination page.
    // objectData = object data that sent to destination page.
    $scope.navigateTo = function (targetPage, objectData) {
        $state.go(targetPage, {
            product: objectData
        });
    };// End navigateTo.

    // loadMore is for loadMore product list.
    $scope.loadMore = function () {
        $timeout(function () {
            //get product list from json  at paht: www/app-data/product-list.json
            $http.get('app-data/product-list.json')
                .success(function (productList) {
                    // Success retrieve data.
                        // Store user data to $scope.productList.
                    for (var product = 0; product < productList.length; product++) {
                        $scope.productList.push(productList[product]);
                    }
                    // To stop loading progress.
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                });
        }, 2000);
    };// End loadMore.

    $scope.initialForm();

});// End of product list controller.

// Controller of product Detail Page.
appControllers.controller('productDetailCtrl', function ($scope, $mdToast, $mdBottomSheet, $timeout, $stateParams) {

    // This function is the first activity in the controller. 
    // It will initial all variable data and let the function works when page load.
    $scope.initialForm = function () {
        // $scope.product is product detail
        // $stateParams.product is the object that pass from product list page.
        $scope.product = $stateParams.product;
        // Loading progress.
        $timeout(function () {
            if ($scope.isAndroid) {
                jQuery('#product-detail-loading-progress').show();
            }
            else {
                jQuery('#product-detail-loading-progress').fadeIn(700);
            }
        }, 400);
        $timeout(function () {
            jQuery('#product-detail-loading-progress').hide();
            jQuery('#product-detail-content').fadeIn();
        }, 3000);// End loading progress.
    };// End initialForm.

    // addToCart for show Item Added ! toast.
    $scope.addToCart = function () {
        $mdToast.show({
            controller: 'toastController',
            templateUrl: 'toast.html',
            hideDelay: 800,
            position: 'top',
            locals: {
                displayOption: {
                    title: "Item Added !"
                }
            }
        });
    }; // End addToCart.

    // sharedProduct fro show shared social bottom sheet by calling sharedSocialBottomSheetCtrl controller.
    $scope.sharedProduct = function ($event, product) {
        $mdBottomSheet.show({
            templateUrl: 'bottom-sheet-shared.html',
            controller: 'sharedSocialBottomSheetCtrl',
            targetEvent: $event,
            locals: {
                product: product
            }
        });
    };// End sharedProduct.

    $scope.initialForm();
});// End of product list controller.

// Controller of share social bottom sheet.
appControllers.controller('sharedSocialBottomSheetCtrl', function ($scope, $mdBottomSheet, $timeout, product, $mdToast, $cordovaSocialSharing) {

    // This function is the first activity in the controller. 
    // It will initial all variable data and let the function works when page load.
    $scope.initialForm = function () {
        
        //$scope.setCanvasImage for set canvas image to save to your mobile gallery.
        $scope.setCanvasImage(product.img);
        //$scope.isSaving is image saving status.
        $scope.isSaving = false;
    };// End initialForm.

    //setCanvasImage for set canvas image to save to your mobile gallery.
    $scope.setCanvasImage = function (imgPath) {
        // create canvas image.
        var canvas = document.getElementById('imgCanvas');
        var context = canvas.getContext('2d');
        var imageObj = new Image();

        imageObj.onload = function () {
            canvas.height = this.height;
            canvas.width = this.width;
            context.drawImage(imageObj, 0, 0);
        };
        //image path.
        imageObj.src = imgPath;

        return canvas.toDataURL();
    };// End setCanvasImage.

    // getCanvasImageUrl for get canvas image path.
    $scope.getCanvasImageUrl = function () {
        var canvas = document.getElementById('imgCanvas');
        return canvas.toDataURL();
    };// End getCanvasImageUrl.

    // sharedFacebook for share product picture to facebook by calling $cordovaSocialSharing.
    $scope.sharedFacebook = function () {
        $cordovaSocialSharing.shareViaFacebook(" ", $scope.getCanvasImageUrl());
        $mdBottomSheet.hide();
    }// End sharedFacebook.

    // sharedTwitter for share product picture to twitter by calling $cordovaSocialSharing.
    $scope.sharedTwitter = function () {
        $cordovaSocialSharing.shareViaTwitter(" ", $scope.getCanvasImageUrl());
        $mdBottomSheet.hide();
    }// End sharedTwitter.

    // sharedMail for share product picture to email by calling $cordovaSocialSharing.
    $scope.sharedMail = function () {
        $cordovaSocialSharing.shareViaEmail(" ", "Shopping with ionic meterial", "ionicmaterialdesign@gmail.com", "cc@IonicMeterial.com", "bcc@IonicMeterial.com", $scope.getCanvasImageUrl());
        $mdBottomSheet.hide();
    }// End sharedMail.

    // saveImage for save product picture to mobile gallery.
    $scope.saveImage = function () {

        if ($scope.isSaving == false) {
            try {
                // calling canvas2ImagePlugin to save image to gallery.
                window.canvas2ImagePlugin.saveImageDataToLibrary(
                    function (msg) {

                    },
                    function (err) {
                        throw err;
                    },
                    document.getElementById('imgCanvas'));
                $scope.isSaving = true;

                // show Image Saved ! toast when save image success.
                $mdToast.show({
                    controller: 'toastController',
                    templateUrl: 'toast.html',
                    hideDelay: 800,
                    position: 'top',
                    locals: {
                        displayOption: {
                            title: "Image Saved !"
                        }
                    }
                });
            }
            catch (e) {
                console.log(e);
                // show Save Failed : Please try again! toast when save image  is error.
                $mdToast.show({
                    controller: 'toastController',
                    templateUrl: 'toast.html',
                    hideDelay: 800,
                    position: 'top',
                    locals: {
                        displayOption: {
                            title: "Save Failed : Please try again!"
                        }
                    }
                });
            }
        }
        // Hide bottom sheet.
        $timeout(function () {
            $mdBottomSheet.hide();
        }, 1800);
    }// End saveImage.

    // sharedMore for hide bottom sheet.
    $scope.sharedMore = function () {

        $mdBottomSheet.hide();
    }// End sharedMore.

    $scope.initialForm();
});// End of share social bottom sheet controller.

// Controller of product check out page.
appControllers.controller('productCheckoutCtrl', function ($scope, $mdToast, $mdDialog) {
    //You can do some thing hear when tap on a credit card button.
    $scope.doSomeThing = function () {

    }// End doSomeThing.

    // showConfirmDialog for show alert box.
    $scope.showConfirmDialog = function ($event) {
        //mdDialog.show use for show alert box for Confirm to complete order.
        $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            targetEvent: $event,
            locals: {
                displayOption: {
                    title: "Complete Order",
                    content: "Confirm to complete Order.",
                    ok: "Confirm",
                    cancel: "Close"
                }
            }
        }).then(function () {
            // For confirm button to complete order.
            
            //Showing Order Completed. Thank You ! toast.
            $mdToast.show({
                controller: 'toastController',
                templateUrl: 'toast.html',
                hideDelay: 1200,
                position: 'top',
                locals: {
                    displayOption: {
                        title: "Order Completed. Thank You !"
                    }
                }
            });
        }, function () {
            // For cancel button to complete order.
        });
    }// End showConfirmDialog.
});// End of product check out controller.
