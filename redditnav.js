$(window).load({})

// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
UP = 0
DOWN = 1
/**
 * Get the current URL.
 *
 * @param {function(string)} callback - called when the URL of the current tab
 *   is found.
 */
function getCurrentTab(callback) {
  // Query filter to be passed to chrome.tabs.query - see
  // https://developer.chrome.com/extensions/tabs#method-query
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    // chrome.tabs.query invokes the callback with a list of tabs that match the
    // query. When the popup is opened, there is certainly a window and at least
    // one tab, so we can safely assume that |tabs| is a non-empty array.
    // A window can only have one active tab at a time, so the array consists of
    // exactly one tab.
    var tab = tabs[0];

    callback(tab);
  });

  // Most methods of the Chrome extension APIs are asynchronous. This means that
  // you CANNOT do something like this:
  //
  // var url;
  // chrome.tabs.query(queryInfo, function(tabs) {
  //   url = tabs[0].url;
  // });
  // alert(url); // Shows "undefined", because chrome.tabs.query is async.
}

document.addEventListener('DOMContentLoaded', function() {
  getCurrentTab(function(tab) {
    chrome.tabs.executeScript(null, {
        file: "redditnav.js"
    });
    alert(tab); 
  });
});

console.log("WUBBA LUBBA DUB DUB");
var parentComments = $(".sitetable.nestedlisting").children(".comment").toArray();
parentComments = parentComments.map(function(commentElement){
	return $(commentElement);

});

function gotoNextParent(pos, direction) {
	var scrollTo;
	if(parentComments[0].offset().top > pos){
		if(direction == DOWN)
			scrollTo = parentComments[0]
		else
			return;
	}
	if(parentComments[parentComments.length - 1].offset().top < pos){
		if(direction == UP)
			scrollTo = parentComments[parentComments.length-1];
		else
			return;
	}
	for(var i = 0; i < parentComments.length - 1; i++){
		if(parentComments[i].offset().top <= pos && pos < parentComments[i + 1].offset().top){
			console.log(parentComments[i].offset().top);
			if(direction == UP){
				if(parentComments[i].offset().top == pos && i > 0){
					scrollTo = parentComments[i-1];
				}
				else{
					scrollTo = parentComments[i];
				}
			}
			else if(direction == DOWN) {
				scrollTo = parentComments[i+1];
			}
		}

	}

    console.log(scrollTo)
    $("body, html").animate({
        scrollTop: scrollTo.offset().top
    });
}

$(document).keydown(function(e) {
	var pos = $(window).scrollTop();
	if(e.keyCode == 81){
			gotoNextParent(pos, UP);
	}
	else if (e.keyCode == 87){
			gotoNextParent(pos, DOWN);
	}
});
