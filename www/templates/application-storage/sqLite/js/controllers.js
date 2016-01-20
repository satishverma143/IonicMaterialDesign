// Controller will call ContractDB Services to present data to html view.
//
// For using sqlite you have to install $cordovaSQLite by running the following
// command in your cmd.exe for windows or terminal for mac:
// $ cd your_project_path
// $ ionic plugin remove io.litehelpers.cordova.sqlite
// $ ionic plugin add https://github.com/litehelpers/Cordova-sqlite-storage.git
//
// For install $cordovaSQLite plugin you also have to install this following plugin to get $cordovaSQLite work :
// $ ionic plugin add com.ionic.keyboard
//
// Learn more about $cordovaSQLite :
// http://ngcordova.com/docs/plugins/sqlite/
//
// Controller of Contract List Page.
appControllers.controller('contractListCtrl', function ($scope, $stateParams,$filter, $mdDialog, $timeout, $ionicModal, $state, $mdBottomSheet, ContractDB) {
    
    // initialForm is the first activity in the controller. 
    // It will initial all variable data and let the function works when page load.
    $scope.initialForm = function () {

        //$scope.isLoading is the variable that use for check statue of process.
        $scope.isLoading = true;

        //$scope.isAnimated is the variable that use for receive object data from state params.
        //For enable/disable row animation.
        $scope.isAnimated =  $stateParams.isAnimated;

        // $scope.contracts  is the variable that store data from ContractDB service.
        $scope.contracts = [];

        // $scope.filterText  is the variable that use for searching.
        $scope.filterText = "";
        
        // The function for show/hide loading progress.
        $timeout(function () {
            if ($scope.isAndroid) {
                jQuery('#contract-list-loading-progress').show();
            }
            else {
                jQuery('#contract-list-loading-progress').fadeIn(700);
            }
        }, 400);
        $timeout(function () {

            //Get all contracts.
            $scope.getContractList();

            jQuery('#contract-list-loading-progress').hide();
            jQuery('#contract-list-content').fadeIn();
            $scope.isLoading = false;
        }, 3000);// End loading progress.

    };// End initialForm.

    // getContractList is for get all contracts. 
    // By calling ContractDB.all() service.
    $scope.getContractList = function () {
        $scope.contracts = ContractDB.all();
    };//End getContractList.

    // updateContract is for update contracts. 
    // By sending contract to ContractDB.update(contract) service.
    // Parameter :  
    // contract = contract that user select from view.
    $scope.updateContract = function (contract) {
        ContractDB.update(contract);
    };// End updateContract.

    // navigateTo is for navigate to other page 
    // by using targetPage to be the destination page 
    // and sending objectData to the destination page.
    // Parameter :  
    // targetPage = destination page.
    // objectData = object that will sent to destination page.
    $scope.navigateTo = function (targetPage, objectData) {
        $timeout(function(){
            $state.go(targetPage, {
                contractdetail: objectData,
                actionDelete: (objectData == null ? false : true)
            });
        },400);
    };// End navigateTo.

    // callTo is for using mobile calling.
    // Parameter :
    // number = number that going to call.
    $scope.callTo = function (number) {
        window.open("tel:" + number);
    }// End callTo.


    $scope.initialForm();

});// End of Contract List Page  Controller.

// Controller of Contract Detail Page.
appControllers.controller('contractDetailCtrl', function ($mdBottomSheet, $mdToast, $scope, $stateParams, $filter, $mdDialog, $ionicHistory, ContractDB, $ionicHistory) {
    
    // initialForm is the first activity in the controller. 
    // It will initial all variable data and let the function works when page load.
    $scope.initialForm = function () {

        // $scope.disableSaveBtn is  the variable for setting disable or enable the save button.
        $scope.disableSaveBtn = false;

        // $scope.contract is the variable that store contract detail data that receive form contract list page.
        // Parameter :  
        // $stateParams.actionDelete(bool) = status that pass from contract list page.
        // $stateParams.contractdetail(object) = contract that user select from contract list page.
        $scope.contract = $scope.getContractData($stateParams.actionDelete, $stateParams.contractdetail);

        //$scope.actionDelete is the variable for allow or not allow to delete data.
        // It will allow to delete data when have data in the database.
        $scope.actionDelete = $stateParams.actionDelete;
    }; //End initialForm.

    // getContractData is for get contract detail data.
    $scope.getContractData = function (actionDelete, contractDetail) {
        // tempContract is  temporary contract data detail.
        var tempContract = {
            id: null,
            firstName: '',
            lastName: '',
            telephone: '',
            email: '',
            createDate: $filter('date')(new Date(), 'MMM dd yyyy'),
            age: null,
            isEnable: false
        }
        // If actionDelete is true Contract Detail Page will show contract detail that receive form contract list page.
        // else it will show tempContract for user to add new data.
        return (actionDelete ? angular.copy(contractDetail) : tempContract);
    };//End get contract detail data.

    // saveContract is for save contract.
    // Parameter :  
    // contract(object) = contract object that presenting on the view.
    // $event(object) = position of control that user tap.
    $scope.saveContract = function (contract, $event) {
        //$mdBottomSheet.hide() use for hide bottom sheet.
        $mdBottomSheet.hide();
        //mdDialog.show use for show alert box for Confirm to save data.
        $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            targetEvent: $event,
            locals: {
                displayOption: {
                    title: "Confirm to save data?",
                    content: "Data will save to SQLite.",
                    ok: "Confirm",
                    cancel: "Close"
                }
            }
        }).then(function () {

            // For confirm button to save data.
            try {
                // To update data by calling ContractDB.update(contract) service.
                if ($scope.actionDelete) {
                    if ($scope.contract.id == null) {
                        $scope.contract.id = $scope.contractList[$scope.contractList.length - 1].id;
                    }
                    ContractDB.update(contract);
                } // End update data. 

                // To add new data by calling ContractDB.add(contract) service.
                else {
                    ContractDB.add(contract);
                    $scope.contractList = ContractDB.all();
                    $scope.actionDelete = true;
                }// End  add new  data. 

                // Showing toast for save data is success.
                $mdToast.show({
                    controller: 'toastController',
                    templateUrl: 'toast.html',
                    hideDelay: 400,
                    position: 'top',
                    locals: {
                        displayOption: {
                            title: "Data Saved !"
                        }
                    }
                });//End showing toast.
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
                });//End showing toast.
            }
        }, function () {
            // For cancel button to save data.
        });// End alert box.
    };// End save contract.

    // deleteContract is for remove contract.
    // Parameter :  
    // contract(object) = contract object that presenting on the view.
    // $event(object) = position of control that user tap.
    $scope.deleteContract = function (contract, $event) {
        //$mdBottomSheet.hide() use for hide bottom sheet.
        $mdBottomSheet.hide();
        //mdDialog.show use for show alert box for Confirm to delete data.
        $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            targetEvent: $event,
            locals: {
                displayOption: {
                    title: "Confirm to remove data?",
                    content: "Data will remove form SQLite.",
                    ok: "Confirm",
                    cancel: "Close"
                }
            }
        }).then(function () {
            // For confirm button to remove data.
            try {
                // Remove contract by calling ContractDB.remove(contract)service.
                if ($scope.contract.id == null) {
                    $scope.contract.id = $scope.contractList[$scope.contractList.length - 1].id;
                }
                ContractDB.remove(contract);
                $ionicHistory.goBack();
            }// End remove contract.
            catch (e) {
                // Showing toast for unable to remove data.
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
        }, function () {
            // For cancel button to remove data.
        });// End alert box.
    };// End remove contract.

    // validateRequiredField is for validate the required field.
    // Parameter :  
    // form(object) = contract object that presenting on the view.
    $scope.validateRequiredField = function (form) {
        return !(   (form.firstName.$error.required == undefined)
        && (form.lastName.$error.required == undefined)
        && (form.telephone.$error.required == undefined));
    };// End validate the required field. 

    // showListBottomSheet is for showing the bottom sheet.
    // Parameter :  
    // $event(object) = position of control that user tap.
    // contractForm(object) = contract object that presenting on the view.
    $scope.showListBottomSheet = function ($event, contractForm) {
        $scope.disableSaveBtn = $scope.validateRequiredField(contractForm);
        $mdBottomSheet.show({
            templateUrl: 'contract-actions-template',
            targetEvent: $event,
            scope: $scope.$new(false),
        });
    };// End showing the bottom sheet.

    $scope.initialForm();

});// End  Contract Detail page Controller.

// Controller of Contract Setting Page.
appControllers.controller('contractSettingCtrl', function ($scope,$ionicViewSwitcher,$state, $timeout, $stateParams, $mdDialog, $mdBottomSheet, $mdToast, $ionicHistory, ContractDB) {
    
    // initialForm is the first activity in the controller. 
    // It will initial all variable data and let the function works when page load.
    $scope.initialForm = function () {
        
        //$scope.loading is the variable for loading progress.
        $scope.loading = true;
        
        //$scope.contractsCount is the variable for get contracts count.
        $scope.contractsCount = [];

        //To get contract count and stop loading progress.
        $timeout(function () {
            $scope.contractsCount = ContractDB.all();
            $scope.loading = false;
        }, 1000);

    }; // End initialForm.

    // clearAllData is for clear all contract data.
    // Parameter :  
    // $event(object) = position of control that user tap.
    $scope.clearAllData = function ($event) {
        //$mdBottomSheet.hide() use for hide bottom sheet.
        $mdBottomSheet.hide();
        //mdDialog.show use for show alert box for Confirm to remove all data.
        $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            targetEvent: $event,
            locals: {
                displayOption: {
                    title: "Confirm to remove all data?",
                    content: "All data will remove from SQLite.",
                    ok: "Confirm",
                    cancel: "Close"
                }
            }
        }).then(function () {
            // For confirm button to remove all data.
            try {
                // Remove all data by calling ContractDB.removeAll() service.
                ContractDB.removeAll();
                $scope.contractsCount = [];
                //Showing toast for remove data is success.
                $mdToast.show({
                    controller: 'toastController',
                    templateUrl: 'toast.html',
                    hideDelay: 400,
                    position: 'top',
                    locals: {
                        displayOption: {
                            title: "All data removed !"
                        }
                    }
                });
            }
            catch (e) {
                // Showing toast for unable to remove data.
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
            // For cancel button to remove all data.
        });// End alert box.

    };// End clear all data from sqlite

    // navigateTo is for navigate to other page
    // by using targetPage to be the destination state.
    // Parameter :
    // stateNames = target state to go.
    // objectData = Object data will send to destination state.
    $scope.navigateTo = function (stateName,objectData) {
        if ($ionicHistory.currentStateName() != stateName) {
            $ionicHistory.nextViewOptions({
                disableAnimate: false,
                disableBack: true
            });

            //Next view animate will display in back direction
            $ionicViewSwitcher.nextDirection('back');

            $state.go(stateName, {
                isAnimated: objectData,
            });
        }
    }; // End of navigateTo.

    $scope.initialForm();
});// End  Contract Setting page Controller.
