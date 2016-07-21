/***************************************************************
 The script is written in Javascript with a little use of jQuery 
 This script is includes event handlers
****************************************************************/

/**
 * Lazy load 10 videos at a time when user scrolls down
 * Starts loading when user scrolls down to page bottom - video card height
 */
document.onscroll=function(){
    var offsetY;
    if(window.pageYOffset!== undefined)
        offsetY=window.pageYOffset;
    else
        offsetY= document.documentElement.scrollTop || document.body.scrollTop || 0;
    var hgt=document.getElementsByClassName("vidCard")[0].offsetHeight || document.getElementsByClassName("vidCard")[0].clientHeight;
    var wid = window.offsetWidth || window.innerWidth;
    var numChild = document.getElementsByClassName("videos")[0].children.length;
    
    /*
    var child=document.getElementsByClassName("videos")[0].children;
    if(child.length === 2){
        child = document.getElementsByClassName("smallPane")[0].children;
    }
    var numChild = child.length;
    */
    
    if(wid>760){
        if(offsetY>=hgt*(numChild-3)/3){
            //lazy load
            if(sessionId)
                fetchVids(numChild);
             else
                console.error("Error fetching videos");
        }
    } else if(wid<=760 && wid>=540){
        if(offsetY>=hgt*(numChild-4)/2){
            //lazy load
            if(sessionId)
                fetchVids(numChild);
             else
                console.error("Error fetching videos");
        }
    } else{
        if(offsetY>=hgt*(numChild-3)){
            //lazy load
            if(sessionId)
                fetchVids(numChild);
             else
                console.error("Error fetching videos");
        }
    }
};

/**
 * in page anchor smoothening function
 */
smoothScroll();

/**
 * Store sessionid and username in local memory to avoid login again on page refresh
 */
window.onbeforeunload = function(){
    sessionStorage.setItem("sessionId", sessionId);
    sessionStorage.setItem("userName", userName);
};

/** 
 * Handles Hamburger menu button toggling. 
 * It is visible on smaller screens 
 * @params
 *    state: controls whether the class is to be removed or added/removed. 
 *           when state is false, the class is only removed
 */
function toggleHamburger(state){
    //IE and Safari do not support default function parameter values
    if(typeof(state) === 'undefined')state=true;
    
    var e=document.getElementsByClassName("nav-links")[0].children[0];
    if(state)
        $(e).toggleClass("active");
    else 
        $(e).toggleClass("active", state);
}

/**
 * Handles navigation links active state
 * @param
 *    bb: is the anchor tag that triggered the call to this function
 */
function toggleNavLinks(bb){
    var e=document.getElementsByClassName("nav-links")[0].children[0].children;
    $(e).each(function(k,v){
        if($(v).hasClass("active")){
            $(v).removeClass("active");
            $(bb).parent().addClass("active");
            toggleHamburger(false);
            return;
        }
    });
}

/**
 * smoothens the in-page anchor scrolling
 */
function smoothScroll() {
  $('a[href^="#"]:not([href="#"])').click(function(event) { 
      event.preventDefault();    
      var id = $(event.target.hash);
      if (id.length) {
        $('html, body').animate({
          scrollTop: id.offset().top - 150
        }, 1000);
        return false;
      }                
   });
 }