/*******************************************************
  
  The script is written in Javascript with little JQuery 
  This script controls video ratings.
  
*********************************************************/

/**
 * star rating class
 * @param 
 *    id: video id
 */
function StarRating(id){
    if(typeof(id) !== 'string' || id==="" || id===null){
        console.error("Invalid Video ID");
        return "Invalid Video ID";
    }
    this.id=id;
    //when true, user has submitted video rating once. 
    this.submitted=false;
    this.init();
};

/**
 * initialize and attach event handlers to the stars
 */
StarRating.prototype.init = function() {
    try{
        var elem = document.getElementById(this.id).nextElementSibling;
    }catch(err){
        console.error("No Element with ID: "+this.id);
        return "No Element with this ID";
    }
    this.stars = elem.children;
  
    for (var i = 0; i < this.stars.length; i++) {
        this.stars[i].setAttribute('data-count', i);
        $(this.stars[i]).on('mouseenter', this.enterStarListener.bind(this));
        $(this.stars[i]).on('click', this.rateVideo.bind(this));  
    }
    $(elem).on('mouseleave', this.leaveStarListener.bind(this));
};
 
/** 
 * this method is used to rate video
 * @param 
 *    e: element that fired the event
 */
StarRating.prototype.rateVideo = function(e){
    if(!isValidArgument(e, true))
        return "Error Occurred";
    if(this.submitted){
        //indicate to the user the rating cannot be submitted
        this.showToolTip("Rating already submitted for this video");
    }else{
        var rating=parseInt(e.target.getAttribute('data-count'))+1;
        try{
            getUserRating(this.id, rating, this);
            this.submitted=true;
            //thank user for rating the video
            this.showToolTip("Thanks for Rating!");
        }catch(err){
            this.submitted=false;
            alert("Could not contact the server. Please check your internet connection and try again");
            console.error(this.id+": "+rating+"stars - "+err);
        }
    }
};

/**
 * shows a tooltip response to user after rating a video
 * @param
 *    str: the text to display
 */
StarRating.prototype.showToolTip = function(str){
    if(!isValidArgument(str, false))
        return "Error Occurred";
    var elem=document.getElementById(this.id).parentElement;
    elem=elem.getElementsByClassName("tooltip")[0].children[0];
    elem.innerHTML=str;
    elem.style.visibility="visible";
    var timer=setInterval(function(){
        elem.style.visibility="hidden";
        clearInterval(timer);
    }, 5000);
};

/**
 * This method is fired when a user hovers over a single star
 * @params
 *    e: element that fired the event
 */
StarRating.prototype.enterStarListener = function(e) {
    if(!isValidArgument(e, true))
        return "Error Occurred";
    this.fillStarsUpToElement(e.target);
};
 
/** 
 * This method is fired when the user leaves the stars, resets them to video rating
 * @params
 *    e: event that fired the event
 */
StarRating.prototype.leaveStarListener = function(e) {
    if(!isValidArgument(e, true))
        return "Error Occurred";
    setRating(this.id, this);
};
 
/**
 * Fill the star ratings up to a specific position.
 * @params
 *    el: The element upto which stars are to be filled or emptied
 */
StarRating.prototype.fillStarsUpToElement = function(el) {
  for (var i = 0; i < this.stars.length; i++) {
    if (this.stars[i].getAttribute('data-count') > el.getAttribute('data-count')) {
      this.myRemoveClass(this.stars[i],'hover');
    } else {
      this.myAddClass(this.stars[i],'hover');
    }
  }
};

/**
 * removes a class from class list of the element
 * @params
 *   el: element from which to remove the class
 *   cl: class to remove
 */
StarRating.prototype.myRemoveClass = function(el, cl){
    if(Object.prototype.toString.call(document.body.classList) == "[object DOMTokenList]"){
        el.classList.contains(cl) ? el.classList.remove(cl) : "";
    } else
        el.className = (" " + el.className + " ").indexOf(" " + cl + " ") > -1 ? (" "+el.className+" ").replace(" "+cl+" ", " ") : el.className;
};

/**
 * add a class to the element
 * @params
 *   el: element to add the class to
 *   cl: class to add
 */
StarRating.prototype.myAddClass = function(el, cl){    
    if(Object.prototype.toString.call(document.body.classList) == "[object DOMTokenList]"){
        el.classList.contains(cl) ? "" : el.classList.add(cl);    
    } else
        (" " + el.className + " ").indexOf(" " + cl + " ") > -1 ? "" : el.className = el.className + " " + cl;
};