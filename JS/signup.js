/*****************************************************************
 
 The script is written in Javascript with a little use of jQuery 
 This script controls login/logout and register. 
 Register is not in the requirements, hence not implemented
 
*******************************************************************/


//global variable that holds user session id
var sessionId="";
//global variable that holds user name
var userName="";

/**
 * Checks for validity of inputs to various functions
 * @param
 * e: argument to be tested
 * isObj: is the first argument an Object
 */
function isValidArgument(e, isObj){
    if(isObj){
        if(!(e instanceof Object))
            return false;
    }
    if(e==="" || e===null || e==="undefined" || e===undefined || e===NaN)
        return false;
    return true;
}

/**
 * checks whether the user is logged in on every page load. 
 * If not popups up the login modal not allowing the user to access the app
 * saves user sessionId and username in local memory to avoid re-login on page refresh
 */
function auth(){
    sessionId=sessionStorage.getItem('sessionId');
    userName=sessionStorage.getItem('userName');
    if(sessionId==="" || sessionId=="undefined" || sessionId===undefined || sessionId===null){
        //popup login modal
        var e=document.getElementById("loginModal");
        e.style.display="block";     
        //change text from logout to login
        document.getElementById("nav4").children[0].innerHTML="Login";
    } else{
        //welcome user
        document.getElementById("nav3").children[0].innerHTML="Welcome "+userName;
        //change text from login to logout
        document.getElementById("nav4").children[0].innerHTML="Logout";
        //load videos if user on home page or video page
        fetchVids();     
    }
}

/**validates the form fields
 * @params
 *     e is the form element
 *     t is the type of form element
 */
function validate(e, t){
    switch(t){
        case "uname":   
            if(e.match(/^[a-z]([a-z0-9]|[_\.](?![_\.])){1,23}[a-z0-9]$/i)){
                return true;
            }
        case "passwd":
            if(e.match(/^[a-z]([a-z0-9]|[_\.](?![_\.])){4,18}[a-z0-9]$/i))
                return true;
        case "email":
            if(e.match(/^[a-z]([a-z0-9]|[_\.](?![_\.])){23}[a-z0-9]$/i))
                return true;
    }
    return false;
}

/**
 * function to verify correctness of user login and color code response in case of invalid input
 */
function verifyCred(){
    var len=arguments.length;
    var i=0;
    while(i<len){
        if(!validate(arguments[i].value, arguments[i+1])){
            arguments[i].style.borderColor="red";
            //console.log(arguments[i+1]);
            return false;
        } else
            arguments[i].style.borderColor="green";
        i+=2;
    }
    return true;
}

/** 
 * establish connection with the server and log the user in
 * @params
 *     url: url at which connection will be established
 *     uname: username
 *     passwd: password
 */
function estConnection(url, uname, passwd){
    $.post(
            url, 
            {
            "username":uname, 
            "password":passwd
            }, 
            function(res, stat){
                try{
                    var data=JSON.stringify(res);
                    data=JSON.parse(data);
                    if(stat==="success" && data.username===uname){
                        sessionId=data.sessionId;
                        userName=data.username;
                        console.log("Login success");
                    }
                } catch(err_res){
                   alert("There was an error processing your request. Please try again");
                    console.error(stat+": "+err_res + ": "+ res);
                }
        }, "json")
        .done(function(){
                console.log("session established");
                signinHandler(); 
            })
        .fail(function(){
                console.error("call rejected");
        });
}

/**
 * Handles login request 
 * If successful, logs the user in setting the session id
 */
function login(){
    if(isValidArgument(sessionId, false)){
        //user already logged in
        return;
    }
    var e=document.getElementById("mySignin").elements;
    var user=e["uname"];
    var pass=e["passwd"];
    if(!verifyCred(user, "uname", pass, "passwd"))
        return;  
    //send data to server and get response 
    try{
        var md5=CryptoJS.MD5(pass.value).toString();    
        estConnection("http://localhost:3000/user/auth", user.value, md5) 
    }catch(err){
        alert("Unable to establish connection with the server. Make sure you are connected to the internet and \
              try again later");
        console.error(err);
    }
}

/** 
 * called after successful login/registration
 */
function signinHandler(){
    //hide popup
    var e=document.getElementById("loginModal");
    e.style.display="none";
    //welcome user
    document.getElementById("nav3").children[0].innerHTML="Welcome "+userName;
    //change text from login to logout
    document.getElementById("nav4").children[0].innerHTML="Logout";
    //store in memory
    sessionStorage.setItem('sessionId', sessionId);
    sessionStorage.setItem('userName', userName);  
    //load videos
    fetchVids();
}

/**
 * ends user session i.e logs out
 */
function brkConnection(url){
    $.get(url,
        {
            "sessionId":sessionId
        },
        function(res, stat){
            try{
                var data=JSON.stringify(res);
                data=JSON.parse(data);
                if(stat==="success" && data.status==="success"){
                    sessionId="";
                    userName="";
                    console.log("Logout success");
                }
            }catch(err){
                alert("There was an error in processing your request. Please try again");
                console.log(stat+": "+err);
            }
        }, "json")
        .done(function(){
                console.log("session broken");
                logoutHandler();
        })
        .fail(function(){
                console.error("call rejected");
        });
}

/**
 * handles logout request: logs the user out if already logged in
 */
function logout(){
    if(!isValidArgument(sessionId, false)){
        //user not logged in - highly undesirable, means there is either a bug or code has been broken
        sessionStorage.setItem("sessionId", "");
        sessionStorage.setItem("userName", "");
        $(".videos").empty();
        document.location.href="../index.html";
    }else{
        //log the user out
        try{
            brkConnection("http://localhost:3000/user/logout");
        }catch(err){
            alert("Unable to establish connection with the server. Please check your connection to the internet \
                    and try again later");
            console.log(err);
        }
    }
}

/**
 * reset the page after user logs out successfully
 */
function logoutHandler(){
    //redirect to homepage
    document.location.href="../index.html";
    //show popup
    var e=document.getElementById("loginModal");
    e.style.display="block";
    //welcome user
    document.getElementById("nav3").children[0].innerHTML="";
    //change text from login to logout
    document.getElementById("nav4").children[0].innerHTML="Login";
    //clear web storage
    sessionStorage.setItem("sessionId", "");
    sessionStorage.setItem("userName", "");
}