/*
 * IIFE to keep code safe and outside the global namespace
 */
(function(){

    /*
     * Declaring a factory service as part of the existing turtleFacts Module.
     */
    angular
        .module("Comments")
        .factory("CommentsInfo", CommentsInfo);

    function CommentsInfo(){

        var dataObj = {
            // baseUrl: baseUrl,
            // objName: objName,
            commentsData: CommentsData
            };

        return dataObj;
    }
    // var baseUrl = Backand.getApiUrl() + '/1/objects/';
    // var objName = 'comments';
    var CommentsData = [];

})();
