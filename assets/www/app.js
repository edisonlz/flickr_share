// JavaScript Document

var baseurl = "http://www.gabereiser.com/flickr/";


//Allows for chaging the resolution of main focused image from medium to high or vice versa..
function changeRez(url) {
	if($('#focusImg').attr('src')!=url)
	{
		$('#loadingImg').fadeIn('slow');
		$('#loading').fadeIn('slow');
		$('#descriptionSpan').fadeOut('slow');
		$('#focusImg').fadeOut('slow', function(){
			$('#focusImg').attr('src', url);
			$('#focusImg').load(function(){
				
				$('#loadingImg').fadeOut('slow');
				$('#loading').fadeOut('slow');
				$('#focusImg').fadeIn('slow');
				$('#descriptionSpan').fadeIn('slow');
			});
		});
	}
}

//Fetches the description for a specific photo id from our backend php service....
function fetchDescription(photo_id) {
	$('#descriptionSpan').load(base_url+"service.php?request=getdescription&id="+photo_id+"", function(data){
		var url = $('#focusImg').attr("src");
		var base_url = url.replace("_b.jpg", "").replace("_o.jpg", "").replace(".jpg", "");
		var medium_url = base_url + ".jpg";
		var large_url = base_url + "_b.jpg";
		$('#descriptionSpan').html(data);
	});
}

//When clicking on a side thumbnail, it loads the image in the focusImg div and calls fetchDescription on that photo id.
function thumbClick(url, photo_id) {
	if($('#focusImg').attr('src')!=url)
	{
		var base_url = url.replace("_b.jpg", "").replace("_o.jpg", "").replace(".jpg", "");
		var medium_url = base_url + ".jpg";
		var large_url = base_url + "_b.jpg";

		clearInterval(timeout);
		timeout = 0;
		
		$('#loadingImg').fadeIn('slow');
		$('#loading').fadeIn('slow');
		$('#descriptionSpan').fadeOut('slow');
		$('#focusImg').fadeOut('slow', function(){
		
		//fetchDescription(photo_id);
		//$('#descriptionSpan').html("Fetching Description...");
		$('#focusImg').attr('src', url);
		$('#focusImg').load(function(){
				$('#loadingImg').fadeOut('slow');
				$('#loading').fadeOut('slow');
				$('#focusImg').fadeIn('slow');
				$('#descriptionSpan').fadeIn('slow');
		});
	
		
	});
	}
}
var div;
var isWebKit;
var isiPhone;

//Initial load, checks if it's webkit and if it's on an iPhone device...
$(document).ready(function(){
	
		$('#thumbnails').css({ "height":$(document).height()-20 });
		$(window).resize(function(){
			$('#thumbnails').css({ "height":$(window).height()-20 });
		});
		$('div.search').mouseenter(function(){
			$('img.search').animate({opacity:1}, 200);
			$('input.search').animate({background:"#666"}, 200);
		});
		$('div.search').mouseleave(function(){
			$('img.search').animate({opacity:0.5}, 200);
			$('input.search').animate({background:"#222"}, 200);
		});
		
		if($.browser.webkit){
			isWebKit = true;
		}
		
		if(navigator.userAgent.match(/iPhone/i)){
			isiPhone = true;
			if(navigator.standalone) {
				$('div.search').css({ "top":60 });
				$('div.content').css({ "top":100 });
				$('div.sliderDiv').css({ "top":100 });
				$('body').css({"margin-top":40 });
			}
		}
		
		div = $('#thumbnails');
		
	    //When user move mouse over menu
		if(!isiPhone){
	    	div.mousemove(function(e){over(e);});
			div.mouseleave(function(){
				clearInterval(timeout);
				timeout = 0;
			});
		}
		
		$(document).ajaxError(function(){
			//alert("Error!");
		});
		$(document).ajaxComplete(function(){
			//used for debugging a successful ajax call...
			//alert("complete");
		});
		
		
		initThumbs();

		fetchThumbs("interestingness", null, null, 1);

	
});

//Used to make the side thumbnails scroll...
$(document).mousemove(function(e){
	if(!isiPhone){
		mouseY = e.pageY;
	}
});

var timeout = 0;
var startY;
var current_page = 1;

//Does the fetch against the service to get the list of thumbnails from flickr's Interestingness list or from a search...
function fetchThumbs(op, name, searchterms, page){
	mouseX = 0;
	startY = 0;
	current_page = page;
	if(searchterms == '' && name == null)
		op = 'interestingness';
	$('#loadingThumbsImg').fadeIn('slow');
	$('#loadingThumbs').fadeIn('slow');
	var url = baseurl+"service.php?request="+op+"&user="+name+"&tags="+searchterms+"&page="+page+"";
	fetchThumbs_from_server(op, name, searchterms, page,url);
};

function initThumbs(){
	mouseX = 0;
	startY = 0;
	current_page = page;
	$('#loadingThumbsImg').fadeIn('slow');
	$('#loadingThumbs').fadeIn('slow');
	var url = "data.html";
	fetchThumbs_from_server(null,null,null,1,url);
};


function fetchThumbs_from_server(op, name, searchterms, page,url){
	$('#thumbnails').load(url, function(text){
		$('#thumbnails').html(stripslashes(text));
		$('#loadingThumbsImg').fadeOut('slow');
		$('#loadingThumbs').fadeOut('slow');
		var previouspage = current_page - 1;
		var nextpage = current_page + 1;
		if($('input.search').val() != "")
		{	
			if(previouspage > 0)
				$('#page').html("<a href=\"javascript:fetchThumbs('"+op+"', '"+name+"', '"+searchterms+"', "+previouspage+");\">previous</a>  |  <a href=\"javascript:fetchThumbs('"+op+"', '"+name+"', '"+searchterms+"', "+nextpage+");\">next</a>");
			else
				$('#page').html("<a href=\"javascript:fetchThumbs('"+op+"', '"+name+"', '"+searchterms+"', "+nextpage+");\">next</a>");
		}
		
		var div = $('#thumbnails');
		var firstImg = div.find('img:first-child');
		if(firstImg)
			firstImg.click();
	});
	
}

//Utility function to strip slashes from text, needed because on the service backend we add slashes to keep text from breaking javascript calls that use single-quote...
function stripslashes (str) {
    //Needed for photo titles from php proxy's addslashes method...  otherwise 's would break the onclick javascript calls...
    return (str+'').replace(/\\(.?)/g, function (s, n1) {
        switch (n1) {
            case '\\':
                return '\\';
            case '0':
                return '\u0000';
            case '':
                return '';
            default:
                return n1;
        }
    });
}

//Touch handler for iPhone/iPad
function touchstart(e){
	mouseY = 0;
	startY = e.touches[0].pageY;

}

//Touch handler for iPhone/iPad
function touchover(e){
	
	mouseY -= e.touches[0].pageY - (startY);
	move();
	e.preventDefault();
	
}

//Mouse over handler to start a loop if one hasn't been started already...
function over(e){
	if(timeout == 0)
	{ 
		timeout = setInterval(move, 5);
	}
}

var mouseY = 0;
var left = 0;

//The move handler which will scroll thumbnails up and down based on relative mouse Y coord to center of the div...
function move()
{
	//Get our elements for faster access and set overlay width
	var div = $('#thumbnails'),
	                 div2 = $('#thumbs'),
	                 // unordered list's left margin
	                 padding = 45;
	
	//Get menu width
	var divHeight = div.height();
	//Remove scrollbars
	div.css({overflow: 'hidden'});

	//Find last image container
	var lastImg = div.find('img:last-child');
	if(lastImg[0] != null)
	{
	//As images are loaded div2 width increases,
  	//so we recalculate it each time
  	var dHeight = lastImg[0].offsetTop + lastImg.outerHeight() + padding;
  	
	var relativeY = ((mouseY) - (document.body.clientHeight/2));
  	
	left = left + (relativeY*0.01);
	
	if(left < 0)
	left = 0;
	if(left > (dHeight-divHeight))
	left = dHeight-divHeight;
	//var divOffset = div.offset().top;
  	div.scrollTop(left);
	}

}

