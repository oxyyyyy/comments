(function(){

    angular
        .module("Comments")
        .controller("commentsCtrl", ['$scope', '$http', 'Backand', 'AuthService', CommentsController]);

    function CommentsController($scope, $http, Backand, AuthService){
        var vm = this;

        var baseUrl = Backand.getApiUrl() + '/1/objects/';
        var objectName = 'comments';

        vm.currentUser = AuthService.currentUser;

        vm.localEditor = false;
        vm.error = "";

        //---
        //postcomment-data
        vm.anonymous = false;
        vm.author = vm.currentUser.name || "";
        vm.text = "";
        vm.answerTo = {
                          id:"",
                          name:""
                      }; //accessable from commentslist

        vm.popoverOnAnon = {
            isOpen: true,
            templateUrl: 'myPopoverTemplate.html',
            close : function () {
                vm.popoverOnAnon.isOpen = false;
            },
            autoClose : function () {
                setTimeout(function () {
                    vm.popoverOnAnon.close();
                },1000)
            },
            auth : function () {
                vm.popoverOnAnon.close();
                setTimeout(function () {
                    vm.showAuth();
                },500)
            }
        };

        //---

        //---
        //postcomment-methods

        vm.setAnonymousPost = setAnonymousPost;

        vm.initPostComment = initPostComment;
        vm.addComment = addComment;

        vm.showAuth = AuthService.showAuth;
        vm.logout = AuthService.logout;
        //---

        //---
        //commentlist-data
        vm.data = [];
        vm.commentsOnPage = 10;
        vm.commentsDisplayIndex = 1;
        vm.totalRows = 0;

        vm.newActions = false;
        //---

        //---
        //commentlist-methods
        vm.actionPerformed = actionPerformed;
        vm.loadNewData = loadNewData;
        vm.removeComment = deleteComment;
        vm.readComments = readCommentsList;
        vm.commentOnCreation = initComment;
        vm.allowUpdate = editComment;
        vm.saveUpdatedComment = updateComment;

        vm.setAnswerTo = setAnswerTo;
        vm.clearAnswerTo = clearAnswerTo;

        vm.validateDate = validateDate;

        vm.nextComments = nextComments;
        //---

        //---
        //postcomment-funcs
        function actionPerformed() {
            vm.newActions = true;
        }

        function loadNewData() {
            vm.newActions = false;
            vm.readComments();
        }

        function initPostComment() {
            vm.text = "";
            vm.author = "";
            vm.answerTo.name = "";
            vm.answerTo.id = "";
        }

        function setAnonymousPost() {
            vm.anonymous = true;
        }

        function addComment() {
            if (vm.currentUser.name) {
                vm.anonymous = false;
            }
            if((vm.currentUser.name != "" || vm.author != "") && vm.text != ""){
                sendToServer();
                vm.initPostComment();
                vm.anonymous = false;
            } else {
                errHandler("Пустой комментарий");
            }
        };

        function sendToServer() {
            vm.localEditor = true;
            return $http({
                method: 'POST',
                url : baseUrl + objectName,
                data: {
                    author: vm.currentUser.name || vm.author,
                    comment: vm.text,
                    anonymous: vm.anonymous,
                    in_answer_to: vm.answerTo.id
                },
                params: {
                    returnObject: true
                }
            }).then(function(response) {
                console.log(response.data);
                return response.data;
            }, errHandler);
        };

        function errHandler(err) {
            console.error(err);
            vm.error = err.data || err;
            setTimeout(function() {
                vm.error = null;
            },1000);
        };
        //---

        //---
        //commentlist-funcs
        Backand.on('comments_updated', function (data) {
            if (!vm.localEditor) {
                vm.actionPerformed();
            }
            else {
                vm.readComments();
            }

            vm.localEditor = false;
        });

        function readCommentsList() {
            return $http({
                method: 'GET',
                url: baseUrl + objectName,
                params: {
                    pageSize: (vm.commentsOnPage *  vm.commentsDisplayIndex),
                    pageNumber: 1,
                    sort: [{
                        "fieldName" : "id",
                        "order" : "desc"
                    }]
                }
            }).then(function(response) {
                vm.totalRows = response.data.totalRows;
                return response.data.data;
            }).then(function(data){
                vm.data = data;
                vm.data.forEach(function (element, id, arr) {
                    if(element.in_answer_to) {
                        arr.forEach(function (singleComment) {
                            if (singleComment.id == element.in_answer_to)
                            {
                                element.answer = singleComment.author;
                            }
                        });
                    };
                })
                console.log(vm.data);
                // for (var i = 0; i < parents.length; i++) {
                //     if(parents[i].has_children){
                //         getChildren(parents[i].id);
                //     }
                // }
                // vm.data = vm.data.concat(parents);
            });
        };

        function getChildren(id) {
            return $http ({
                method: 'GET',
                url: Backand.getApiUrl() + '/1/query/data/getChildren',
                params: {
                    parameters: {
                        index: id
                    }
                }
            }).then(function(response) {
                return response.data;
            }).then(function(data){
                vm.data = vm.data.concat(data);
            });
        };

        function initComment(singleComment) {
            vm.error = null;
            singleComment.editable = false;
        };

        function editComment(singleComment){
            singleComment.editable = true;
        };

        function updateComment(singleComment) {
            singleComment.editable = false;
            vm.localEditor = true;
            return $http({
                method: 'PUT',
                data: {
                    author: singleComment.author,
                    comment: singleComment.comment
                },
                url: baseUrl + objectName + '/' + singleComment.id
            }).then(function (response) {
                return response.data;
            }, errHandler);
        }

        function deleteComment(singleComment) {
            vm.localEditor = true;
            return $http({
                method: 'DELETE',
                url : baseUrl + objectName + '/' + singleComment.id
            }).then(function(response) {
                return response.data;
            }, errHandler);
        };

        function nextComments() {
            if ((vm.commentsDisplayIndex++)*vm.commentsOnPage<=vm.totalRows)
            vm.readComments();
        }

        function validateDate(date) {
            var newDate = new Date(date.toString());
            //newDate.setTime (newDate.getTime() - newDate.getTimezoneOffset()*60*1000 );
            return newDate.toString().slice(0,21);
        }

        function setAnswerTo(singleComment) {
            vm.answerTo.name = singleComment.author;
            vm.answerTo.id = singleComment.id;
        }

        function clearAnswerTo(){
            vm.answerTo.name = null;
            vm.answerTo.id = null;
        }
        //---

    }
})();
