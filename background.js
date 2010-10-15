/**
 * Add number to the browser icon
 **/
var addNum = function(num, tab){
    if(num > 9999) {
        var z = "";
        for(var i = 0; i < String(num).length - 4; i++)
            z += "0";
        num = String(num)[0] + z + "K";
        chrome.browserAction.setBadgeText({tabId: tab.id, text:String(num)});
    }else if(num > 0)
        chrome.browserAction.setBadgeText({tabId: tab.id, text:String(num)});
    else chrome.browserAction.setBadgeText({tabId: tab.id, text:""});
};

/**
 * When a page is complete to load, get the number of 
 * Share/Like on the page.
 **/
chrome.tabs.onUpdated.addListener(function(tabId, inf, tab) {
    if( !tab.url.match(/^https:\/\/.*/) && inf.status === "complete"){
        (function(url){
            var l1 = "http://api.facebook.com/restserver.php?method=links.getStats&urls=";
            var l2 = "&format=json";
	    
            var xhr = new XMLHttpRequest();
            xhr.open("GET", l1 + encodeURIComponent(url) + l2, true);
            xhr.onload = function(){
                var re = JSON.parse(xhr.responseText);
                var s = re[0].share_count;
                //var l = re[0].like_count;
                //var c = re[0].comment_count;
                //var t = re[0].total_count;
		addNum(s, tab);
            }
            xhr.send();
        })(tab.url);
    }
    
});

/**
 * When you click the browser icon, a new window will
 * appear and you can share the page with your friend.
 **/
chrome.browserAction.onClicked.addListener(function(tab) {
    if( !tab.url.match(/https:\/\/.*/)){
	(function(url, title){
	    chrome.windows.create({
		url: "http://www.facebook.com/sharer.php?u=" +
		    encodeURIComponent(url) + "&t=" + title,
		height: 500,
		width: 600,
		type: "popup"});
	})(tab.url, tab.title);
    }
});