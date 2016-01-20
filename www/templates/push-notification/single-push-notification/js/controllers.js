// For using Local Push Notification you have to install cordova-plugin-local-notifications by running the following
// command in your cmd.exe for windows or terminal for mac:
// $ cd your_project_path
// $ ionic plugin add https://github.com/katzer/cordova-plugin-local-notifications
// 
// Push Notification will show at Notification center of your devise.
// Controller of Single Push Notification page.
appControllers.controller('singlePushNotificationCtrl', function($scope, $mdToast) {
    // initialForm is the first activity in the controller. 
    // It will initial all variable data and let the function works when page load.
    $scope.initialForm = function () {
        // message is variable for message that going to sent push.
        $scope.notificationMessage = "";
        $scope.setUpPushNotification();
    };// End initialForm.

    // setUpPushNotification is for set up the mobile to allow push notification from application.
    $scope.setUpPushNotification = function(){
        document.addEventListener('deviceready', function() {
        //To check that application have permission that allow push notification or not.
        cordova.plugins.notification.local.hasPermission(function(granted) {
            if (granted == false) {
                // To asking mobile for the permission to allow push notification.
                cordova.plugins.notification.local.registerPermission(function(granted) {
                    console.log('registerPermission has been granted: ' + granted);
                });
            }
        });
    }, false);
    };// End setUpPushNotification.

    // singlePush is for send single push notification. 
    // Parameter :  
    // message = message that going to sent push notification.
    $scope.singlePush = function(message) {

        try{
            // Send push notification
            // When call a plugins.notification.local have to call in deviceready function.
            document.addEventListener('deviceready', function() {
                // Calling plugins.notification.local.schedule to send push.
                cordova.plugins.notification.local.schedule({
                    text: "Message: " + message,
                    icon: "img/icon.png"
                });

                // Showing toast for send push notification success.
                $mdToast.show({
                    controller: 'toastController',
                    templateUrl: 'toast.html',
                    hideDelay: 400,
                    position: 'top',
                    locals: {
                        displayOption: {
                            title: "Message: " + message
                        }
                    }
                });//End showing toast.

            }, false);// End Send push notification
        }
        catch (e) {

            // Showing toast for unable to send push notification.
            $mdToast.show({
                controller: 'toastController',
                templateUrl: 'toast.html',
                hideDelay: 800,
                position: 'top',
                locals: {
                    displayOption: {
                        title: window.globalVariable.message.errorMessage
                    }
                }
            });// End showing toast.
        }

    };// End schedulePush.

    // callback is for get push ID that prepare for clear all push notification.
    $scope.callback = function() {
        // When call a plugins.notification.local have to call in deviceready function.
        document.addEventListener('deviceready', function() {
            // Calling plugins.notification.local.getIds to get push ids.
            cordova.plugins.notification.local.getIds(function(ids) {});
        }, false);
    };// End callback.

    // clearAllNotification is for clear all push notification.
    $scope.clearAllNotification = function() {

        try{
            // Clear All push  Notification
            // When call a plugins.notification.cancelAll have to call in deviceready function.
            document.addEventListener('deviceready', function() {
                // Calling plugins.notification.local.cancelAll to clear all push notification.
                cordova.plugins.notification.local.cancelAll($scope.callback);

                // Showing toast for clear all push notification success.
                $mdToast.show({
                    controller: 'toastController',
                    templateUrl: 'toast.html',
                    hideDelay: 400,
                    position: 'top',
                    locals: {
                        displayOption: {
                            title:"Clear All Notification Success."
                        }
                    }
                });//End showing toast.

            }, false);
        }
        catch (e) {

            // Showing toast for unable to clear all push notification.
            $mdToast.show({
                controller: 'toastController',
                templateUrl: 'toast.html',
                hideDelay: 800,
                position: 'top',
                locals: {
                    displayOption: {
                        title: window.globalVariable.message.errorMessage
                    }
                }
            });// End showing toast.
        }

    };// End clearAllNotification.

    $scope.initialForm();

}); // End of controller Single Push Notification.