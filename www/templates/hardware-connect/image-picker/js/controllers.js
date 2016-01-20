// For using imagePicker you have to install $cordovaImagePicker by running the following 
// command in your cmd.exe for windows or terminal for mac:
// $ cd your_project_path
// $ ionic plugin remove com.synconset.imagepicker
// $ ionic plugin add https://github.com/wymsee/cordova-imagePicker.git
// 
// Learn more about $cordovaImagePicker :
// http://ngcordova.com/docs/plugins/imagePicker/
//
// Controller of image picker page.
appControllers.controller('imagePickerCtrl', function ($scope, $mdBottomSheet, $cordovaImagePicker) {

    // initialForm is the first activity in the controller. 
    // It will initial all variable data and let the function works when page load.
    $scope.initialForm = function () {
        // $scope.imageList is for store image data.
        $scope.imageList = [];
    };// End initialForm.

    // selectImage is for select image from mobile gallery
    // Parameter :  
    // limit = limit number that can select images.
    $scope.selectImage = function (limit) {
        //hide BottomSheet.
        $mdBottomSheet.hide();
        // Set options for select image from mobile gallery.
        var options = {
            maximumImagesCount: limit,
            width: 300,
            height: 300,
            quality: 100
        }; // End Set options.

        // select image by calling $cordovaImagePicker.getPictures(options)
        // Parameter :  
        // options = options of select image.
        $cordovaImagePicker.getPictures(options)

            .then(function (results) {
                // store image data to imageList.
                $scope.imageList = [];
                for (var i = 0; i < results.length; i++) {
                    $scope.imageList.push(results[i]);
                }
            }, function (error) {
                console.log(error);
            });
    };// End selectImage.

    // showListBottomSheet for show BottomSheet.
    $scope.showListBottomSheet = function ($event) {
        $mdBottomSheet.show({
            templateUrl: 'image-picker-actions-template',
            targetEvent: $event,
            scope: $scope.$new(false),
        });
    }; // End showListBottomSheet.

    $scope.initialForm();

});// End of image picker Controller.