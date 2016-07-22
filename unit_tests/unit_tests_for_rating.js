/****************************************
 Unit Tests for Rating.js and vidRender.js
 ****************************************/
 
//Expected Ouput = Invalid Video ID
//console.log((StarRating()));

try{
    if((StarRating()) === "Invalid Video ID") 
        console.log("Passed Test 1");
    else 
        console.debug("Failed Test 1: " + rres);

    if(StarRating(-1) === "Invalid Video ID") 
        console.log("Passed Test 2");
    else 
        console.debug("Failed Test 2");

    if(StarRating(NaN) === "Invalid Video ID") 
        console.log("Passed Test 3");
    else 
        console.debug("Failed Test 3");
    //debugger;
    if(StarRating("") === "Invalid Video ID") 
        console.log("Passed Test 4");
    else 
        console.debug("Failed Test 4");
    }catch(err){
        console.error(err);
}
if(StarRating.prototype.rateVideo(null) === "Error Occurred")
    console.log("Passed Test 5");
else 
    console.debug("Failed Test 5");

if(StarRating.prototype.rateVideo(undefined) === "Error Occurred")
    console.log("Passed Test 6");
else 
    console.debug("Failed Test 6");

var star=new StarRating("578b5e45a4351d8d7951ea8e");
star.submitted=true;
star.rateVideo(document.getElementById("578b5e45a4351d8d7951ea8e").nextElementSibling.children[1]);
var elem=document.getElementById("578b5e45a4351d8d7951ea8e").parentElement;
elem=elem.getElementsByClassName("tooltip")[0].children[0];

if(elem.innerHTML === "Rating already submitted for this video")
    console.log("Passed Test 7");
else 
    console.debug("Failed Test 7");

star.submitted=false;
var e = jQuery.Event( "click" );
jQuery(document.getElementById("578b5e45a4351d8d7951ea8e").nextElementSibling.children[1]).trigger( e );
if(star.submitted===true)
    console.log("Passed Test 8");
else 
    console.debug("Failed Test 8");

elem=document.getElementById("578b5e45a4351d8d7951ea8e").nextElementSibling.children[1];
$(elem).trigger(jQuery.Event("mouseenter"));
if((" "+ elem.className+ " ").indexOf(" " + "hover" + " ")>-1)
    console.log("Passed Test 9");
else 
    console.debug("Failed Test 9");

try{
    fetchSingleVid("578b5e45a4351d8d7951ea8e");
    console.log("Passed Test 10");
}catch(err){
    console.debug("Failed Test 10");
}