/*
 * IIFE to avoid polution of the global namespace.
 */
(function(){
    /*
     * Creating List controller and attaching it to the main turtleFacts module
     */
    angular
        .module("Comments")
        .controller("commentCtrl", ['$http', 'Backand', 'CommentsInfo', 'AuthorizationData', CommentController]);

    /*
     * Dependency injection. This allows the script to be minified and uglified
     * without breaking the code. This is acheived by passing the dependencies
     * as strings in an array through the $inject method to the controller.
     */

    //  CommentController.$inject = ['$http'];
    //  CommentController.$inject = ['DataService'];
    /*
     * Definition for the List controller. quizMetrics and dataService are two
     * services that are created in js/factory/quiz.js and js/factory/dataService.js
     * respectively.
     */
    function CommentController($http, Backand, CommentsInfo, AuthorizationData){
        var vm = this;

        var baseUrl = Backand.getApiUrl() + '/1/objects/';
        var objectName = 'comments';

        vm.authData = AuthorizationData;
        vm.author = "";
        vm.text = "";
        vm.data = CommentsInfo;
        vm.addComment = addComment;

        vm.logIn = logIn;

        function logIn() {
            console.log(vm.authData.signedIn);
            vm.authData.loggining();
            console.log(vm.authData.signedIn);
        }

        function addComment() {
          if(vm.author != "" && vm.text != ""){
            vm.data.commentsData.push({author: vm.author, cmText: vm.text});
            sendToServer();
            vm.author = "";
            vm.text = "";
          }
        };

        function sendToServer() {
            return $http({
                method: 'POST',
                url : baseUrl + objectName,
                data: {
                    author: vm.author,
                    comment: vm.text
                },
                params: {
                    returnObject: true
                }
            }).then(function(response) {
                return response.data;
            });
        };
    }
})();
