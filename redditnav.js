var directions = {
  UP: "up",
  DOWN: "down"
};
var scrolling = false;

// http://gizma.com/easing/#quad3
function easeInOutQuad(n,u,e,t){return n/=t/2,1>n?n*n*(e/2)+u:(--n,(n*(n-2)-1)*(-e/2)+u)}

function animateScrollTo(position, duration) {
  if (scrolling)
    return;

  var start = null;
  var scrollY = window.scrollY;
  function step(timestamp) {
    scrolling = true;
    if (!start)
      start = timestamp;

    var progress = timestamp - start;
    var top = easeInOutQuad(progress, scrollY, position - scrollY, duration);
    window.scroll(0, top);
    if (progress < duration)
      window.requestAnimationFrame(step);
    else
      scrolling = false;
  }
  window.requestAnimationFrame(step);
}

function getPos(node) {
  return Math.ceil(node.getBoundingClientRect().top + document.body.scrollTop);
}

function getNextParent(pos, direction, parentComments) {
  var currentIndex = 0;
  for (var i = 0; i < parentComments.length; ++i) {
    var parentPos = getPos(parentComments[i]);
    if (pos > parentPos || (direction === directions.DOWN && pos === parentPos))
      continue;

    currentIndex = i;
    break;
  }

  if (direction === directions.UP)
    return currentIndex > 0 ? parentComments[currentIndex - 1] : null;

  if (direction === directions.DOWN)
    return currentIndex < parentComments.length - 1 ? parentComments[currentIndex] : null;

  return null;
}

function goToNextParent(pos, direction) {
  var parentComments = Array.from(document.querySelectorAll(".sitetable.nestedlisting > .comment"));
  var scrollTo = getNextParent(Math.ceil(pos), direction, parentComments);
  if (!scrollTo)
    return;

  animateScrollTo(getPos(scrollTo), 800);
  Array.prototype.forEach.call(scrollTo.querySelectorAll(".entry"), (element) => element.click());
}

chrome.storage.sync.get({
  color: '#FF5722',
  buttonPos: 'right'
}, function(items) {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET", chrome.extension.getURL("redditnav.html"), false);
  xmlhttp.send();

  var container = (new DOMParser()).parseFromString(xmlhttp.responseText, "text/html").getElementById("redditNavContainer");
  Array.prototype.forEach.call(container.getElementsByTagName("a"), (element) => element.style.color = items.color);
  if (items.buttonPos === "hide")
    container.classList.add("hide");
  else if (items.buttonPos === "left")
    container.classList.add("left");
  else // if (items.buttonPos === "right")
    container.classList.add("right");

  document.body.appendChild(container);

  document.getElementById("redditNavUp").addEventListener("click", function() {
    goToNextParent(window.scrollY, directions.UP);
  });

  document.getElementById("redditNavDown").addEventListener("click", function() {
    goToNextParent(window.scrollY, directions.DOWN);
  });
});

document.addEventListener("keydown", function(event) {
  if (event.target.value)
    return;

  if (event.keyCode == 81)
    goToNextParent(window.scrollY, directions.UP);
  else if (event.keyCode == 87)
    goToNextParent(window.scrollY, directions.DOWN);
});
