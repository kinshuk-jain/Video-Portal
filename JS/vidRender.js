/********************************************************* 

  The script is written in Javascript with a little use of jQuery 
  This script controls video rendering and playing

***********************************************************/


//global variable that holds the id of the video that is currently playing
var playing="";

/**
 * retrieve all the videos and display them to the user
 * @param
 *    skip: number of videos to be skipped
 *    limit: number of videos to be fetched. Default value is 10
 *    vidId: when specified this single video will be fetched
 *    singleVid: when true only a single video will be fetched and shown in expanded form
 */
function fetchVids(skip, limit, vidId, singleVid){
    //safari and IE do not support default parameters as of now. Workaround for that
    if(typeof(skip) === 'undefined')skip=0;
    if(typeof(limit) === 'undefined')limit=10;
    if(typeof(vidId) === 'undefined')vidId="";
    if(typeof(singleVid) === 'undefined')singleVid=false;
    
    try{
        getData("http://localhost:3000/video" + (!singleVid ? "s" : ""), skip, limit, vidId, singleVid);
    }catch(err){
        alert("Please Check your connection to the internet and try again later.");
        console.error(err);
    }
}

/**
 * gets a single video
 * @param 
 *    vidId: id of the video to be fetched
 */
function fetchSingleVid(vidId){
    fetchVids(0,0,vidId, true);
}

/**
 * retrieve video information using GET method
 * @param
 * url: url to send GET request to
 * skip: number of videos to be skipped
 * limit: number of videos to be retrieved
 * singleVid: if true, retrieves only one video information
 */
function getData(url, skip, limit, vidId, singleVid){
    var params={}; 
    params["sessionId"]=sessionId;
    if(vidId!==""){
        params["videoId"]=vidId;    
    }else{
        params["skip"]=skip;
        params["limit"]=limit;
    }
    $.get(
        url,
        params,
        function(res, stat){
            try{
                var dat=JSON.stringify(res);
                dat=JSON.parse(dat);
                console.log("retrieving" + limit + " data, skipping "+skip);
                //do something with data
                if(stat==="success" && dat.status==="success"){
                    paintVideos(dat, singleVid);
                }
            }catch(err){
                alert("There was an error fetching data. Videos could not be loaded. Please refresh the page \
                      and try again");
                console.error(stat+": "+err);
            }
        }, 
        "json"
    )
    .done(function(){
        console.log("Data successfully retrieved");
        
    })
    .fail(function(){
        console.error("call rejected");
    });
}

/**
 * takes the data obtained from getData function and uses it to show videos to the user.  
 * @param
 *    dat: all data retrieved from call to getData
 *    singleVid: a boolean value when true renders only a single video
 */
function paintVideos(dat, singleVid){
    var l=document.getElementsByClassName("bigPane").length===0;
    var len=dat.data.length, i;
    //if not a request for a single video and big pane does not exist, i.e. it is the index page
    if(!singleVid && l){
        for(i=0;i<len;i++){
            addVideo(dat.data[i], "videos", "vidCard", "vidHead", "vidText");
        }
    }
    //if big pane exists i.e. it is the video page but not a request for a single video
    else if(!l && !singleVid){
        for(i=0;i<len;i++){
            if(dat.data[i]._id !== $(".bigVidCard video").attr("id"))
                addVideo(dat.data[i], "smallPane", "vidCard smallVidCard", "vidHead", "vidText", true, false);
        }
    }
    //request to fetch a single video. Show it on the video page
    else{
        playSingleVid(dat.data);
    }
}

/**
 * add videos retrieved from call to getData dynamically to the page
 * @param vidObj: the object returned from the server containing video information
 *        cl: class of the element to add video to
 *        card: class name of video card
 *        hd: class name of the header of video card
 *        txt: class name of the description of the video card
 *        compress: whether to compress the video description to 80 chars. Compresses if its true. Defaults to false
 *        noHandle: if true, video header cannot be clicked to expand the video. Defaults to false  
 */
function addVideo(vidObj, cl, card, hd, txt, compress, noHandle){
    //Safari and IE do not support default values to function parameters
    if(typeof(compress) === 'undefined')compress=false;
    if(typeof(noHandle) === 'undefined')noHandle=false;
    
    var avgRating=Math.round((vidObj.ratings.reduce(function(p,c){return p+c;}))/vidObj.ratings.length);
    var ratin="<div class='rating'>" +
                      "<span>★</span>" +
                      "<span>★</span>" +
                      "<span>★</span>" +
                      "<span>★</span>" +
                      "<span>★</span>" +
                    "</div>";
    
    var element = 
        "<div class='" + card + "'>" +
            "<h4 class='" + hd + " text-center'>"+
                "<a class='pointer' onclick='" + (noHandle?"":"playVidBig(this);return false;") + "'>" +        vidObj.name + 
                "</a>" +
            "</h4>" + 
            "<video onplay='playVid(this)' id='" + vidObj._id + "' src='" + vidObj.url + "' data-avg='" + avgRating + "' controls>" +
                "Unable to Load Video" +
            "</video>" +
            ratin + "<div class='tooltip'><span class='text-center'></span></div>" + 
            "<p class='" + txt + "'>" + 
        (compress?(vidObj.description.substring(0,150)+ (vidObj.description.length>80?" ...":"")) : vidObj.description) + "</p>"+
        "</div>";
    
    //vidObj.description.substring(0,150) + (vidObj.description.length>150?"...":"")
    
    $("."+cl).append(element);
    setRating(vidObj._id);
}

/**
 * gets the average user rating of the video and shows it
 * @param
 *    id: id of the video
 *    obj: the object handling the entire rating system for the video 
 */
function setRating(id, obj){
    var e=document.getElementById(id);
    var rating=parseInt(e.getAttribute("data-avg"));
    e=e.nextElementSibling.children[rating-1];
    try{
        if(!obj)
            (new StarRating(id)).fillStarsUpToElement(e);
        else
            obj.fillStarsUpToElement(e);
    }catch(err){
        alert("There was an error setting ratings. We are sorry for the incovenience. Please try again or file a bug with us");
        console.error("Error Setting ratings:"+err);
    }
}

/** 
 * Get the rating on the video from the user
 * @param 
 *   vidId: video Id
 *   rating: rating given to the video by the user
 *   obj: the rating object handling entire rating system for the video
 */
function getUserRating(vidId, rating, obj){
    $.post(
        "http://localhost:3000/video/ratings?sessionId="+sessionId,
        {
            "videoId":vidId,
            "rating":rating
        },
        function(res, stat){
            try{
                var data = JSON.parse(JSON.stringify(res));
                //update rating and give user some indication that his/her request is successful
                setRating(vidId, obj);
                console.log(vidId+": "+rating+"star submitting");
            }catch(err){
                alert("Could not submit your request. Please try again");
                console.error(vidId+": "+stat+" - "+err);
            }
        }, 
        "json"
    )
    .done(function(){
        console.log("Ratings submitted");
    })
    .fail(function(){
        console.error("Call rejected: "+vidId);
    });
}

/**
 * Plays the single video in large size when user clicks on its header
 * @param
 *    vid: the video element whose header has been clicked
 */
function playVidBig(vid){
    var id = vid.parentElement.nextSibling.getAttribute("id");
    fetchSingleVid(id);
}

/**
 * Builds the video page after user has clicked the header of one of the videos i.e
 * when user has requested the video to be expanded
 * @param
 *      vidData: information about the videos
 */
function playSingleVid(vidData){
    //play and render the single video
    console.log("Single Video: " + vidData._id);
    $(".videos").empty();
    $(".banner").empty();
    $(".banner").css("height", "50px");
    $("<div class='bigPane'></div><div class='smallPane'></div>").appendTo(".videos");
    addVideo(vidData, "bigPane", "bigVidCard", "vidHead", "vidText", false, true);
    //fetch videos for the small pane
    fetchVids();
    
    //comment out this line to enable lazy loading in video page mode
    document.onscroll=function(){};
}

/** 
 * play one video at a time
 * @param e: video that is playing
 */
function playVid(e){
    if(playing!=="" && playing!==e.getAttribute("id")){
        document.getElementById(playing).pause();
    }
    playing=e.getAttribute("id");
}