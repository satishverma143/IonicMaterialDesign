// Controller of Notes List Page.
// It will call NoteDB Services to present data to html view.
appControllers.controller('noteListCtrl', function ($scope,$stateParams, $timeout, NoteDB, $state) {

    // initialForm is the first activity in the controller. 
    // It will initial all variable data and let the function works when page load.
    $scope.initialForm = function () {

        //$scope.isLoading is the variable that use for check statue of process.
        $scope.isLoading = true;

        //$scope.isAnimated is the variable that use for receive object data from state params.
        //For enable/disable row animation.
        $scope.isAnimated =  $stateParams.isAnimated;

        // $scope.noteList is the variable that store data from NoteDB service.
        $scope.noteList = [];

        // $scope.filterText is the variable that use for searching.
        $scope.filterText = "";

        // The function for loading progress.
        $timeout(function () {
            if ($scope.isAndroid) {
                jQuery('#note-list-loading-progress').show();
            }
            else {
                jQuery('#note-list-loading-progress').fadeIn(700);
            }
        }, 400);
        $timeout(function () {

            //Get all notes from NoteDB service.
            $scope.noteList = NoteDB.selectAll();

            jQuery('#note-list-loading-progress').hide();
            jQuery('#note-list-content').fadeIn();
            $scope.isLoading = false;
        }, 3000);// End loading progress.

    };//End initialForm.

    // navigateTo is for navigate to other page 
    // by using targetPage to be the destination page 
    // and sending objectData to the destination page.
    // Parameter :  
    // targetPage = destination page.
    // objectData = object that will sent to destination page.
    $scope.navigateTo = function (targetPage, objectData) {
        $state.go(targetPage, {
            noteDetail: objectData,
            actionDelete: (objectData == null ? false : true)
        });
    };// End navigateTo.

    $scope.initialForm();
});// End of Notes List Page  Controller.

// Controller of Note Setting Page.
appControllers.controller('noteSettingCtrl', function ($scope, NoteDB,$state, $ionicViewSwitcher,$stateParams, $ionicHistory, $mdBottomSheet, $mdDialog, $mdToast) {
    
    // initialForm is the first activity in the controller. 
    // It will initial all variable data and let the function works when page load.
    $scope.initialForm = function () {

        //$scope.noteLenght is is the variable for get note count.
        $scope.noteLenght = NoteDB.count();
    };// End initialForm.

    // clearAllData is for remove all notes data.
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
                    content: "All data will remove from local storage.",
                    ok: "Confirm",
                    cancel: "Close"
                }
            }
        }).then(function () {
            // For confirm button to remove all data.
            try {
                //To remove all notes data by calling NoteDB.clear() service.
                NoteDB.clear();
                $scope.initialForm();

                // Showing toast for remove data is success.
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
                //Showing toast for unable to remove data.
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
        });
    }// End clearAllData.

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
});// End of Notes Setting Page  Controller.

// Controller of Note Detail Page.
appControllers.controller('noteDetailCtrl', function ($scope, NoteDB, $stateParams, $filter, $mdBottomSheet, $mdDialog, $mdToast, $ionicHistory) {

    // initialForm is the first activity in the controller. 
    // It will initial all variable data and let the function works when page load.
    $scope.initialForm = function () {

        // $scope.actionDelete is the variable for allow or not allow to delete data.
        // It will allow to delete data when found data in the database.
        // $stateParams.actionDelete(bool) = status that pass from note list page.
        $scope.actionDelete = $stateParams.actionDelete;

        // $scope.note is the variable that store note detail data that receive form note list page.
        // Parameter :  
        // $scope.actionDelete = status that pass from note list page.
        // $stateParams.contractdetail(object) = note data that user select from note list page.
        $scope.note = $scope.getNoteData($scope.actionDelete, $stateParams.noteDetail);
        
        // $scope.noteList is the variable that store data from NoteDB service.
        $scope.noteList = [];
    };// End initialForm.

    //getNoteData is for get note detail data.
    $scope.getNoteData = function (actionDelete, noteDetail) {
        // tempNoteData is temporary note data detail.
        var tempNoteData = {
            id: null,
            title: '',
            detail: '',
            createDate: $filter('date')(new Date(), 'MMM dd yyyy'),
        };

        // If actionDelete is true note Detail Page will show note detail that receive form note list page.
        // else it will show tempNoteData for user to add new data.
        return (actionDelete ? angular.copy(noteDetail) : tempNoteData);
    };// End getNoteData.

    // showListBottomSheet is for showing the bottom sheet.
    // Parameter :  
    // $event(object) = position of control that user tap.
    // noteForm(object) = note object that presenting on the view.
    $scope.showListBottomSheet = function ($event, noteForm) {

        $scope.disableSaveBtn = $scope.validateRequiredField(noteForm);

        $mdBottomSheet.show({
            templateUrl: 'contract-actions-template',
            targetEvent: $event,
            scope: $scope.$new(false),
        });
    };// End showing the bottom sheet.

    // validateRequiredField is for validate the required field.
    // Parameter :  
    // form(object) = note object that presenting on the view.
    $scope.validateRequiredField = function (form) {
        return !(form.noteTitle.$error.required == undefined);
    };// End validate the required field.

    // saveNote is for save note.
    // Parameter :  
    // note(object) = note object that presenting on the view.
    // $event(object) = position of control that user tap.
    $scope.saveNote = function (note, $event) {
        // $mdBottomSheet.hide() use for hide bottom sheet.
        $mdBottomSheet.hide();

        // mdDialog.show use for show alert box for Confirm to save data.
        $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            targetEvent: $event,
            locals: {
                displayOption: {
                    title: "Confirm to save data?",
                    content: "Data will save to Local Storage.",
                    ok: "Confirm",
                    cancel: "Close"
                }
            }
        }).then(function () {

            // For confirm button to save data.
            try {
                // To update data by calling  NoteDB.update($scope.note) service.
                if ($scope.actionDelete) {

                    if ($scope.note.id == null) {
                        $scope.note.id = $scope.noteList[$scope.noteList.length - 1].id;
                    }
                    NoteDB.update($scope.note);
                } // End update data. 

                // To add new data by calling NoteDB.insert(note) service.
                else {
                    NoteDB.insert(note);
                    $scope.noteList = NoteDB.selectAll();
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
                });// End showing toast.
            }

        }, function () {
            // For cancel button to save data.
        });// End alert box.
    };// End save note.

    // deleteNote is for remove note.
    // Parameter :  
    // note(object) = note object that presenting on the view.
    // $event(object) = position of control that user tap.
    $scope.deleteNote = function (note, $event) {
        // $mdBottomSheet.hide() use for hide bottom sheet.
        $mdBottomSheet.hide();

        // mdDialog.show use for show alert box for Confirm to delete data.
        $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            targetEvent: $event,
            locals: {
                displayOption: {
                    title: "Confirm to remove data?",
                    content: "Data will remove from Local Storage.",
                    ok: "Confirm",
                    cancel: "Close"
                }
            }
        }).then(function () {
            // For confirm button to remove data.
            try {
                // Remove note by calling  NoteDB.delete(note) service.
                if ($scope.note.id == null) {
                    $scope.note.id = $scope.noteList[$scope.noteList.length - 1].id;
                }
                NoteDB.delete(note);
                $ionicHistory.goBack();
            }// End remove note.
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
                });//End showing toast.
            }

        }, function () {
            // For cancel button to remove data.
        });// End alert box.
    };// End remove note.

    $scope.initialForm();
});// End of Notes Detail Page  Controller.
