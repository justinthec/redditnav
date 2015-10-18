// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

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
var parentComments = $(".sitetable.nestedlisting").children(".comment");
var counter = 0;
function gotoNextParent(location) {
	var scrollTo = $(parentComments[location]);

    console.log(scrollTo)
    $("body, html").animate({
        scrollTop: scrollTo.offset().top
    });
}

$(document).keydown(function(e) {
	if(e.keyCode == 81){
		if(counter == 0)
			return;
		else{
			counter--;
			gotoNextParent(counter);
		}
	}
	else if (e.keyCode == 87){
		if(counter >= parentComments.length){
			counter = parentComments.length - 1;
			return;
		}
		else{
			counter++;
			gotoNextParent(counter);
		}
	}
});
