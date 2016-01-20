// Controller of catalog Page.
appControllers.controller('catalogCtrl', function ($scope, $mdToast, $mdDialog) {

    // showConfirmDialog for show alert box.
    $scope.showConfirmDialog = function ($event) {
       //mdDialog.show use for show alert box for Confirm Order.
        $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            targetEvent: $event,
            locals: {
                displayOption: {
                    title: "Confirm Order",
                    content: "Confirm to add Order.",
                    ok: "Confirm",
                    cancel: "Close"
                }
            }
        }).then(function () {
            //  For confirm button to Order.

            // Showing Item added.! toast.
            $mdToast.show({
                controller: 'toastController',
                templateUrl: 'toast.html',
                hideDelay: 1200,
                position: 'top',
                locals: {
                    displayOption: {
                        title: "Item added."
                    }
                }
            }); // Ends showing toast.
        }, function () {
            // For cancel button to Order.
        });
    }// End showConfirmDialog.
});// End of catalog controller.