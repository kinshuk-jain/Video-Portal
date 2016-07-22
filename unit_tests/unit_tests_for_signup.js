/*****************************************
 Unit Tests for signup.js & vidRender.js 
 & lazy load in main.js
 ****************************************/

auth();
if(sessionId===userName && userName==="" && sessionStorage.getItem("sessionId")===""){
    console.log("passed test 1");
    if(document.getElementById("loginModal").style.display === "block")
    console.log("passed test 2");
    else 
        console.debug("failed test 2");

    if(document.getElementById("nav4").children[0].innerHTML === "Login" )
        console.log("passed test 3");
    else 
        console.debug("failed test 3");
}
else
    console.debug("failed test 1");

//debugger;
if(verifyCred(document.getElementById("mySignin").elements["uname"], "uname", document.getElementById("mySignin").elements["passwd"], "passwd"))
    console.log("passed test 6");
else 
    console.debug("failed test 6");

try{
    login();
    console.log("passed test 8");
}catch(err){
    console.debug("failed test 8"+err);
}

//calls estConnection, fetchVids, signinHandler
setTimeout(function(){
        try{
            estConnection("http://localhost:3000/user/auth", "ali", CryptoJS.MD5("password").toString());
            console.log("passed test 7");
        }catch(err){
            console.debug("failed test 7");
        }
}, 1000);

setTimeout(function(){
        if(sessionStorage.getItem("sessionId")!==""){
            if(sessionId)
                console.log("passed test 4")
            else 
                console.debug("failed test 4");

            if(document.getElementById("nav3").children[0].innerHTML === "Welcome "+userName )
                console.log("passed test 5");
            else 
                console.debug("failed test 5");
        }
}, 2000);

setTimeout(function(){
    //debugger;
    /*var scr = document.createElement("script");
    scr.type="text/javascript";
    scr.setAttribute('src', "./unit_tests_for_rating.js");
    document.body.appendChild(scr); */
    $("<script src='./unit_tests_for_rating.js'></script>").appendTo("body");
    //auto scroll to check lazy loading - wait for time to lapse before it scrolls
    document.body.scrollTop=4000;
    document.documentElement.scrollTop=4000;
}, 3000);

setTimeout(function(){
    try{
    logout();
        setTimeout(function(){
                console.log("passed test 9");
                if(sessionStorage.getItem("sessionId") ==="" && sessionStorage.getItem("userName")===""){
                    console.log("passed test 10");
                }
                else
                    console.debug("failed test 10: "+sessionId+"...");
        }, 2000);
    
}catch(err){
    console.debug("failed test 9");
}
}, 5000);