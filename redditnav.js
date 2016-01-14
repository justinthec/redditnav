// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
UP = 0
DOWN = 1

function getParentComments(){
  if ($(".RES-keyNav-activeElement").parent().hasClass("comment")){
    return $(".RES-keyNav-activeElement").closest(".sitetable[class*=listing]").children(".comment").toArray();
  }
  return $(".sitetable.nestedlisting").children(".comment").toArray();
}

function goToNextParent(pos, direction) {
  var parentComments = getParentComments()
  parentComments = parentComments.map(function(commentElement){
    return $(commentElement);
  });

  var $scrollTo = getNextParent(Math.ceil(pos), direction, parentComments);
  if($scrollTo == null){
    return;
  }
  console.log("to: " + getPos($scrollTo) + ", from: " + Math.ceil(pos)  + ", " + direction)

  $("body, html").animate({
      scrollTop: getPos($scrollTo)
  });
  $scrollTo.children(".entry").click();
}

function getNextParent(pos, direction, parentComments) {
  if(pos < getPos(parentComments[0])){
    if(direction == DOWN)
      return parentComments[0];
    else
      return null;
  }

  if(pos > getPos(parentComments[parentComments.length-1])){
    if(direction == UP)
      return parentComments[parentComments.length-1];
    else
      return null;
  }

  if(pos == getPos(parentComments[parentComments.length-1])){
    if(direction == UP)
      return parentComments[parentComments.length-2];
    else
      return null;
  }

  for(var i = 0; i < parentComments.length - 1; i++){
    if(getPos(parentComments[i]) <= pos && pos < getPos(parentComments[i+1])){
      if(direction == UP){
        if(getPos(parentComments[i]) == pos && i > 0){
          return parentComments[i-1];
        }
        else{
          return parentComments[i];
        }
      }
      else if(direction == DOWN) {
        return parentComments[i+1];
      }
    }
  }

  return null;
}

function getPos($node) {
  return Math.round($node.offset().top);
}

function findHighestZIndex() {
  var elems = $(".titlebox");
  var highest = parseInt($(".titlebox").children()[1].style.zIndex);
  return highest;
}

function setUpButton($floatingButton, items) {
  $floatingButton.css('z-index', findHighestZIndex() + 1);
  $floatingButton.find('.mfb-component__button--main, .mfb-component__button--child').css('background-color', items.color);
  var buttonClass;
  switch(items.buttonPos){
    case "right":
      buttonClass = "mfb-component--br mfb-slidein-spring";
      break;
    case "left":
      buttonClass = "mfb-component--bl mfb-slidein-spring";
      break;
    case "hide":
      buttonClass = "mfb-component--hide";
      break;
  }
  $floatingButton.attr('class', buttonClass);
}

$(function() {
  chrome.storage.sync.get({
    color: '#FF5722',
    buttonPos: 'right'
  }, function(items) {
    $("head").append('<link href="https://code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css" rel="stylesheet" type="text/css">');
    var $floatingButton = $('<ul class="mfb-component--br mfb-slidein-spring" data-mfb-toggle="hover">\
      <li class="mfb-component__wrap">\
      <a id="redditNavDown" data-mfb-label="Next Thread (W)" class="mfb-component__button--main">\
        <i class="mfb-component__main-icon--resting ion-compass"></i>\
        <i class="mfb-component__main-icon--active ion-chevron-down"></i>\
      </a>\
      <ul class="mfb-component__list">\
        <li>\
          <a id="redditNavUp" data-mfb-label="Previous Thread (Q)" class="mfb-component__button--child">\
            <i class="mfb-component__child-icon ion-chevron-up"></i>\
          </a>\
        </li>\
      </ul>\
    </li></ul>');
    setUpButton($floatingButton, items);
    $("body").append($floatingButton);
    $("a#redditNavUp").click(function() {
      var pos = $(window).scrollTop();
      console.log(pos);
      goToNextParent(pos, UP);
    });
    $("a#redditNavDown").click(function() {
      var pos = $(window).scrollTop();
      console.log(pos);
      goToNextParent(pos, DOWN);
    });
  });



  $(document).keydown(function(e) {
	if (!$(e.target).is('input, textarea')) {
		var pos = $(window).scrollTop();
		console.log(pos);

		if(e.keyCode == 81){
			e.preventDefault();
			goToNextParent(pos, UP);
		}
		else if (e.keyCode == 87){
			e.preventDefault();
			goToNextParent(pos, DOWN);
		}
	}
  });

  if (!$("body").hasClass("res")){
    $(document).click(function(e) {
      var clicked = $(e.target).closest(".thing").children(".entry").addClass("RES-keyNav-activeElement");
      if (clicked.length != 0){
        $(".RES-keyNav-activeElement").each(function(){
          if ($(this).parent().attr("id") != clicked.parent().attr("id")){
           $(this).removeClass("RES-keyNav-activeElement");
          }
        });
     }
    });

    $(".self").addClass("RES-keyNav-activeElement");
  }
});
