const directions = {
  UP: 'up',
  DOWN: 'down'
};
let scrolling = false;

// http://gizma.com/easing/#quad3
function easeInOutQuad(n,u,e,t){return n/=t/2,1>n?n*n*(e/2)+u:(--n,(n*(n-2)-1)*(-e/2)+u)}

function animateScrollTo(position, duration) {
  if (scrolling)
    return;

  let start = null;
  const scrollY = window.scrollY;
  function step(timestamp) {
    scrolling = true;
    if (!start)
      start = timestamp;

    let progress = timestamp - start;
    const top = easeInOutQuad(progress, scrollY, position - scrollY, duration);
    window.scroll(0, top);
    if (progress < duration)
      window.requestAnimationFrame(step);
    else {
      window.scroll(0, position);
      scrolling = false;
    }
  }
  step(performance.now());
}

function getNodePos(node, direction) {
  const topOfNode = node.getBoundingClientRect().top + document.body.scrollTop;
  if (direction === directions.DOWN)
    return Math.floor(topOfNode);
  else
    return Math.ceil(topOfNode);
}

function getNextParent(direction, parentComments) {
  const currentPos = direction === directions.DOWN ? Math.ceil(window.scrollY) : Math.floor(window.scrollY);
  let targetIndex = 0;
  for (let i = 0; i < parentComments.length; ++i) {
    const commentPos = getNodePos(parentComments[i], direction);
    if (currentPos > commentPos || (direction === directions.DOWN && currentPos === commentPos))
      continue;

    targetIndex = i;
    break;
  }

  if (direction === directions.UP)
    return targetIndex > 0 ? parentComments[targetIndex - 1] : null;

  if (direction === directions.DOWN)
    return targetIndex <= parentComments.length - 1 ? parentComments[targetIndex] : null;

  return null;
}

function goToNextParent(direction) {
  if(scrolling)
    return;
  const parentComments = Array.from(document.querySelectorAll('.sitetable.nestedlisting > .comment:not(.deleted)'));
  const targetComment = getNextParent(direction, parentComments);
  if (!targetComment)
    return;

  targetComment.querySelector('.entry').click();
  animateScrollTo(getNodePos(targetComment), 400);
}

chrome.storage.sync.get({
  color: '#FF5722',
  buttonPos: 'right'
}, (items) => {
  const xmlhttp = new XMLHttpRequest();
  xmlhttp.open('GET', chrome.extension.getURL('redditnav.html'), false);
  xmlhttp.send();

  const container = (new DOMParser()).parseFromString(xmlhttp.responseText, 'text/html').getElementById('redditNavContainer');
  Array.from(container.getElementsByTagName('a')).forEach((element) => {
    element.style.backgroundColor = items.color;
  });
  Array.from(container.getElementsByTagName('path')).forEach((element) => {
    element.style.color = items.color;
  });
  if (items.buttonPos === 'hide')
    container.classList.add('hide');
  else if (items.buttonPos === 'left')
    container.classList.add('left');
  else
    container.classList.add('right');

  document.body.appendChild(container);

  document.getElementById('redditNavUp').addEventListener('click', () => {
    goToNextParent(directions.UP);
  });

  document.getElementById('redditNavDown').addEventListener('click', () => {
    goToNextParent(directions.DOWN);
  });
});

document.addEventListener('keydown', (event) => {
  if (event.target.value)
    return;

  if (event.keyCode === 81) // Q
    goToNextParent(directions.UP);
  else if (event.keyCode === 87) // W
    goToNextParent(directions.DOWN);
});
