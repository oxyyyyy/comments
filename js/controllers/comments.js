(function(){

    angular
        .module("Comments")
        .controller("commentCtrl", ['$http', 'Backand', 'AuthService', CommentController]);

    function CommentController($http, Backand, AuthService){
        var vm = this;

        var baseUrl = Backand.getApiUrl() + '/1/objects/';
        var objectName = 'comments';

        vm.currentUser = AuthService.currentUser;
        
        vm.author = "";
        vm.text = "";

        vm.addComment = addComment;

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
