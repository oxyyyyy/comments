(function(){

    angular
        .module("Comments")
        .factory("AuthorizationData", Auth);

    function Auth(){

        var authObj = {
            newUser: false,

            loggingIn: logIn,

            toggleAuth: switchAuth,
            setAuth: setAuth,
            setReg: setReg
        };

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

        return authObj;
    }
})();
