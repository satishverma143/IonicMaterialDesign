// For get mobile contract you have to install $cordovaContacts by running the following
// command in your cmd.exe for windows or terminal for mac:
// $ cd your_project_path
// $ ionic plugin remove cordova-plugin-contacts
// $ ionic plugin add cordova-plugin-contacts
// 
// Learn more about $cordovaContacts :
// http://ngcordova.com/docs/plugins/contacts/
// 
// For sent email you have to install $cordovaSocialSharing by running the following
// command in your cmd.exe for windows or terminal for mac:
// $ cd your_project_path
// $ ionic plugin remove nl.x-services.plugins.socialsharing
// $ ionic plugin add https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin.git
// 
// Learn more about $cordovaSocialSharing :
// http://ngcordova.com/docs/plugins/socialSharing/
// 
// For sent message you have to install $cordovaSMS by running the following
// command in your cmd.exe for windows or terminal for mac:
// $ cd your_project_path
// $ ionic plugin remove com.cordova.plugins.sms
// $ ionic plugin add https://github.com/cordova-sms/cordova-sms-plugin.git
// 
// Learn more about $cordovaSMS :
// http://ngcordova.com/docs/plugins/sms/
// 
// For using mobile calling you must go to yourProjectPath/config.xml 
// and put this following code in the access area.
// <access origin="tel:*" launch-external="yes"/>
// 
// Controller of contracts list page.
appControllers.controller('mobileContractListCtrl', function ($scope, $filter, $mdDialog, $timeout, $mdToast, $ionicModal, $state, $mdBottomSheet, $cordovaContacts) {

    // This function is the first activity in the controller. 
    // It will initial all variable data and let the function works when page load.
    $scope.initialForm = function () {
        // $scope.loading is for loading progress.
        $scope.loading = true;

        // $scope.contracts is store contracts data.
        $scope.contracts = [];

        // $scope.filterText  is the variable that use for searching.
        $scope.filterText = "";

        // To hide $mdBottomSheet
        $mdBottomSheet.cancel();
        // To hide $mdDialog
        $mdDialog.cancel();

        // The function for show/hide loading progress.
        $timeout(function () {
            if ($scope.isAndroid) {
                jQuery('#mobile-contract-list-loading-progress').show();
            }
            else {
                jQuery('#mobile-contract-list-loading-progress').fadeIn(700);
            }
        }, 400);

        $timeout(function () {
            // To get all contracts.
            $scope.getContractList(true);
        }, 2000);
    }; // End initialForm.

    // callTo is for using mobile calling.
    // Parameter :  
    // number = number that going to call.
    $scope.callTo = function (number) {
        window.open("tel:" + number);
    }// End callTo.

    // getContractList is for get all contracts from mobile.
    // Parameter : 
    // IsInit(bool) = for  stop loading progress.
    $scope.getContractList = function (isInit) {

        // options for get contracts.
        var options = {multiple: true};

        // Calling $cordovaContacts.find to get all contracts.
        // Parameter :  
        // options = options for get contracts.
        $cordovaContacts.find(options).then(
            function (contractList) {
                // Success retrieve data from mobile contract.
                // It will return all contracts then store it in to $scope.contracts
                $scope.contracts = contractList;

                // To stop loading progress.
                if (isInit) {
                    $timeout(function () {
                        $scope.loading = false;
                        jQuery('#mobile-contract-list-loading-progress').hide();
                    }, 2000);
                }
            },
            function () {
                // Error retrieve data from mobile contract.
                console.log("mobile contract is error");
            });
    }; // End getContractList.

    // deleteContract is for delete contract.
    // contract(object) = contract object that user want to delete.
    // $event(object) = position of control that user tap.
    $scope.deleteContract = function (contract, $event) {
        //mdBottomSheet.hide() use for hide bottom sheet.
        $mdBottomSheet.hide();

        //mdDialog.show use for show alert box for Confirm to remove contract.
        $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            targetEvent: $event,
            locals: {
                displayOption: {
                    title: "Confirm to remove contract?",
                    content: "Data will remove from Mobile Contract.",
                    ok: "Confirm",
                    cancel: "Close"
                }
            }
        }).then(function () {
            // For confirm button to remove all contract.
                // remove contract by calling $cordovaContacts.remove.
                try {
                    $cordovaContacts.remove(contract).then(function (result) {
                    }, function (error) {
                        console.log(error);
                    });

                    // set filterText to empty for searching contract.
                    $scope.filterText = "";

                    // Refresh contract page.
                    $scope.getContractList(false);

                    // Showing toast for Contract Removed !.
                    $mdToast.show({
                        controller: 'toastController',
                        templateUrl: 'toast.html',
                        hideDelay: 400,
                        position: 'top',
                        locals: {
                            displayOption: {
                                title: "Contract Removed !"
                            }
                        }
                    });
                }
                catch (e) {
                    // remove error.
                    // Showing toast for unable to remove contract.
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
                    });
                }
            }
            , function () {
                // For cancel button to remove data.
            });
    };// End deleteContract.

    // navigateTo is for navigate to other page 
    // by using targetPage to be the destination page 
    // and sending objectData to the destination page.
    // Parameter :  
    // targetPage = destination page.
    // objectData = object that will sent to destination page.
    $scope.navigateTo = function (targetPage, objectData) {

        $state.go(targetPage, {
            contractDetail: objectData,
            actionDelete: (objectData == null ? false : true)
        });
    }; // End navigateTo.

    $scope.initialForm();

});// End of contract list controller.

// Controller of contracts detail page.
appControllers.controller('mobileContractDetailCtrl', function ($mdBottomSheet, $timeout, $mdToast, $scope, $stateParams
        , $filter, $mdDialog, $ionicHistory, $cordovaContacts, $cordovaSms, $cordovaSocialSharing) {

        // This function is the first activity in the controller. 
        // It will initial all variable data and let the function works when page load.
        $scope.initialForm = function () {
            //$scope.disableSaveBtn is  the variable for setting disable or enable the save button.
            $scope.disableSaveBtn = false;

            //$scope.actionDelete is the variable for allow or not allow to delete data.
            // It will allow to delete data when have data in the mobile contract.
            // $stateParams.actionDelete(bool) = status that pass from contract list page.
            $scope.actionDelete = $stateParams.actionDelete;

            //$scope.contract is the variable that store contract data.
            // $stateParams.contractDetail = contract data that pass from contract list page.
            $scope.contract = $stateParams.contractDetail;

            // For initial temp contract data in case of add new contract.
            if ($scope.actionDelete == false) {
                $scope.contract = {
                    "name": {
                        givenName: ""
                    },
                    "phoneNumbers": [{
                        id: 0,
                        pref: false,
                        type: "mobile",
                        value: ""
                    }],
                    "emails": [{
                        id: 0,
                        pref: false,
                        type: "home",
                        value: ""
                    }]
                };
            }// End initial temp contract data.

            // If contract don't have phone number it will create a blank array for text box
            // for user to input there number.
            if ($scope.contract.phoneNumbers == null) {
                $scope.addNumber();
            }

            // If contract don't have email it will create a blank array of text box
            // for user to input there email.
            if ($scope.contract.emails == null) {
                $scope.addMail();
            }
        }; // End initialForm.

        // addNumber for create a blank array of text box for user to input there number.
        $scope.addNumber = function () {

            if ($scope.contract.phoneNumbers == null) {
                $scope.contract.phoneNumbers = [{value: ""}];
            }
            else {
                $scope.contract.phoneNumbers.push({value: ""});
            }
            $timeout(function () {
                // To hide $mdBottomSheet
                $mdBottomSheet.hide();
                // To hide $mdDialog
                $mdDialog.hide();

            }, 400);

        };// End addNumber.

        // addMail for create a blank array of text box for user to input there email.
        $scope.addMail = function () {

            if ($scope.contract.emails == null) {
                $scope.contract.emails = [{value: ""}];
            }
            else {
                $scope.contract.emails.push({value: ""});
            }

            $timeout(function () {
                // To hide $mdBottomSheet
                $mdBottomSheet.hide();
                // To hide $mdDialog
                $mdDialog.hide();

            }, 400);
        };// End addMail.

        // saveContract for saving contract
        // Parameter :  
        // contract(object) = contract object that presenting on the view.
        // $event(object) = position of control that user tap.
        $scope.saveContract = function (contract, $event) {
            // To hide $mdBottomSheet
            $mdBottomSheet.hide();
             // tempPhoneNumbers is  array of temporary phone number.
            var tempPhoneNumbers = [];

            // Create new object by cloning object that present on the view.
            // For prepare data to save.
            angular.copy($scope.contract.phoneNumbers, tempPhoneNumbers);

            // To packing array of temporary phone number to save to contract.
            for (var index = (tempPhoneNumbers.length - 1); index > -1; index--) {

                if (tempPhoneNumbers[index].value == "") {
                    $scope.contract.phoneNumbers.splice(index, 1);
                }
            }
            // tempMail is  temporary  array of email.
            var tempMail = [];

            // Create new object by cloning object that present on the view.
            // For prepare data to save.
            angular.copy($scope.contract.emails, tempMail);

            // To packing  array of temporary email to save to contract.
            for (var index = (tempMail.length - 1); index > -1; index--) {

                if (tempMail[index].value == "") {
                    $scope.contract.emails.splice(index, 1);
                }
            }

            //mdDialog.show use for show alert box for Confirm to save data.
            $mdDialog.show({
                controller: 'DialogController',
                templateUrl: 'confirm-dialog.html',
                targetEvent: $event,
                locals: {
                    displayOption: {
                        title: "Confirm to save contract?",
                        content: "Data will save to mobile contract.",
                        ok: "Confirm",
                        cancel: "Close"
                    }
                }
            }).then(function () {
                 // For confirm button to save data.
                try {
                    // Save contract to mobile contract by calling $cordovaContacts.save(contract)
                      $cordovaContacts.save(contract).then(function (result) {
                        }, function (error) {
                            console.log(error);
                        });
                    // Showing toast for save data is success.
                    $mdToast.show({
                        controller: 'toastController',
                        templateUrl: 'toast.html',
                        hideDelay: 400,
                        position: 'top',
                        locals: {
                            displayOption: {
                                title: "Contract Saved !"
                            }
                        }
                    });

                    // After save success it will navigate back to contract list page.
                    $timeout(function () {
                        $ionicHistory.goBack();
                    }, 800);
                }
                catch (e) {
                    // Showing toast for unable to save data.
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
                    });
                }

            }, function () {
                // For cancel button to save data.
            });// End alert box.
        };// End saveContract.

        // deleteContract for delete contract
        // Parameter :  
        // contract(object) = contract object that presenting on the view.
        // $event(object) = position of control that user tap.
        $scope.deleteContract = function (contract, $event) {
            //mdBottomSheet.hide() use for hide bottom sheet.
            $mdBottomSheet.hide();

            //mdDialog.show use for show alert box for Confirm to remove contract.
            $mdDialog.show({
                controller: 'DialogController',
                templateUrl: 'confirm-dialog.html',
                targetEvent: $event,
                locals: {
                    displayOption: {
                        title: "Confirm to remove contract?",
                        content: "Data will remove from Mobile Contract.",
                        ok: "Confirm",
                        cancel: "Close"
                    }
                }
            }).then(function () {
                 // For confirm button to remove contract.
                try {
                    // remove contract by calling $cordovaContacts.remove.
                    $cordovaContacts.remove(contract).then(function (result) {
                    }, function (error) {
                        console.log(error);
                    });
                    // After remove success it will navigate back to contract list.
                    $ionicHistory.goBack();
                } catch (e) {
                    //// Showing toast for unable to remove data.
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
                    });
                } //End showing toast.

            }, function () {
                // For cancel button to remove data.
            });

        };// End deleteContract.

        // validateRequiredField is for validate the required field.
        // Parameter :  
        // contractForm(object) = contract object that presenting on the view.
        $scope.validateRequiredField = function (contractForm) {

            return ((typeof contractForm.name.givenName) == "undefined" ) || (contractForm.name.givenName.length == 0);
        };// End validate the required field. 

        // showListBottomSheet is for showing the bottom sheet.
        // Parameter :  
        // $event(object) = position of control that user tap.
        // contractForm(object) = contract object that presenting on the view.
        $scope.showListBottomSheet = function ($event, contractForm) {
            $scope.disableSaveBtn = $scope.validateRequiredField(contractForm);
            $mdBottomSheet.show({
                templateUrl: 'mobile-contract-actions-template.html',
                targetEvent: $event,
                scope: $scope.$new(false),
            });
        };// End showing the bottom sheet.

        // callTo is for using mobile calling.
        // Parameter :  
        // number = number that going to call
        $scope.callTo = function (number) {
            window.open("tel:" + number);
        }// End callTo.

        // sentEmail is for send email by calling $cordovaSocialSharing.
        // Parameter :  
        // email = email of receiver.
        $scope.sentEmail = function (email) {
            $cordovaSocialSharing.shareViaEmail(" ", " ", email, "", "", "");
            // format of sent email by using $cordovaSocialSharing is :
            //$cordovaSocialSharing.shareViaEmail(message, subject, toArr, ccArr, bccArr,file)
            // toArr, ccArr and bccArr must be an array, file can be either null, string or array.
        }; // End sentEmail.

        // sentSms is for send message by calling $cordovaSms.
        // Parameter :  
        // phoneNumber = number of sending message
        $scope.sentSms = function (numbers) {
            //config options to sent message
            var options = {
                replaceLineBreaks: false, // true to replace \n by a new line, false by default.
                android: {
                    intent: 'INTENT' // send SMS with the native android SMS messaging
                    //intent: '' // send SMS without open any other app.
                }
            };
            // calling $cordovaSms to sent message.
            $cordovaSms.send(numbers, " ", options);
        };// End sentSms.
        $scope.initialForm();

});// End of contract detail controller.
