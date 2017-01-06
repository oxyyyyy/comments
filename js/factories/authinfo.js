/*
 * IIFE to avoid global namespace pollution and keep code safe.
 */
(function(){

    /*
     * creating a factory called quizMetrics and attaching that to the
     * turtleFacts module.
     *
     * This factories job is to hold all the data the pertains to the quiz.
     * This could be:
     *          -the questions themselves. What kind of question it is(text or
     *              image)
     *          -Whether the current question has been answered or is still
     *              blank.
     *          -Hold data to show if quiz is active, results are active or
     *              neither
     *          -Method to change the state of the quiz and results (active or
     *              inactive)
     *          -Hold what the actual correct answers are
     *          -Method to mark the answers
     *          -hold how many correct answers the user gave
     *
     */
    angular
        .module("Comments")
        .factory("AuthorizationData", Auth);

        /*
         * dependency injection as seen in all the controllers. See comment
        /*
         * function definition for the factory
         */
        function Auth(){

            /*
             * quizObj is an object that will hold all of the above mentioned
             * properties and methods and will be the return value of the
             * factory
             *
             * As per pattern used in the controllers, the methods will
             * reference named functions that are at the bottom of this function
             */
            var authObj = {
                want2reg: false,
                registered: false,
                signedIn: false,
                cnfrmBtn: "Вход",
                tglBtn: "Регистрация",

                loggingIn: logIn,
                
                toggleAuth: switchAuth,
                setAuth: setAuth,
                setReg: setReg
            };

            return authObj;

            function switchAuth() {
                authObj.want2reg = !authObj.want2reg;
                if(authObj.want2reg){
                    authObj.tglBtn = "Bxod";
                    authObj.cnfrmBtn = "REG";
                } else{
                    authObj.tglBtn = "REG";
                    authObj.cnfrmBtn = "Bxod";
                }
            };
            function setReg() {
                authObj.want2reg = true;
                authObj.tglBtn = "Bxod";
                authObj.cnfrmBtn = "REG";
            };
            function setAuth() {
                authObj.want2reg = false;
                authObj.tglBtn = "REG";
                authObj.cnfrmBtn = "Bxod";
            };

            function logIn() {
                authObj.signedIn = true;
            };
        }

})();
