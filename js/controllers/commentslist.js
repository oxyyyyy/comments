(function(){
    /*
     * Creating List controller and attaching it to the main turtleFacts module
     */
     angular
        .module("Comments")
        .controller("commentsListCtrl", ['$http', 'Backand', CommentListController]);

     function CommentListController($http, Backand){

        var vm = this;
        var baseUrl = Backand.getApiUrl() + '/1/objects/';
        var objectName = 'comments';

        vm.data = [];

        vm.removeComment = deleteComment;
        vm.readComments = readCommentsList;
        vm.commentOnCreation = initComment;
        vm.allowUpdate = editComment;
        vm.saveUpdatedComment = updateComment;

        Backand.on('comments_updated', function (data) {
            console.log(data);
            vm.readComments();
        });

        function readCommentsList() {
            return $http({
                method: 'GET',
                url: baseUrl + objectName
            }).then(function(response) {
                return response.data.data;
            }).then(function(data){
                vm.data = data;
            });
        };

        function initComment() {
            vm.data.editable = false;
        };

        function editComment(comment){
            console.log('to change');
            comment.editable = true;
        };

        function updateComment(comment) {
            console.log('updatedInServer');
            comment.editable = false;
            return $http({
                method: 'PUT',
                data: {
                    author: vm.author,
                    comment: vm.text
                },
                url: baseUrl + objectName + '/' + comment.id
            }).then(function (response) {
                return response.data;
            });
        }

        function deleteComment(comment) {
            console.log('deleted');
            return $http({
                method: 'DELETE',
                url : baseUrl + objectName + '/' + comment.id
            }).then(function(response) {
                // vm.readComments();
                return response.data;
            });
        };
    };
})();
