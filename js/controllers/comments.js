(function(){

    angular
        .module("Comments")
        .controller("commentCtrl", ['$http', 'Backand', 'AuthorizationData', CommentController]);

    function CommentController($http, Backand, CommentsInfo, AuthorizationData){
        var vm = this;

        var baseUrl = Backand.getApiUrl() + '/1/objects/';
        var objectName = 'comments';

        vm.authData = AuthorizationData;

        vm.author = "";
        vm.text = "";

        vm.addComment = addComment;

        vm.logIn = logIn;

        function logIn() {
            console.log(vm.authData.signedIn);
            vm.authData.loggining();
            console.log(vm.authData.signedIn);
        }

        function addComment() {
          if(vm.author != "" && vm.text != ""){
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
