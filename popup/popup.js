let toastActive = false;
function triggerToast () {
  if (toastActive)
    return;

  toastActive = true;
  Materialize.toast('Refresh to see changes!', 4000, '', () => {
    toastActive = false;
  });
}

const colorMap = {
  'rgb(244, 67, 54)' : 'red',
  'rgb(255, 87, 34)' : 'orange',
  'rgb(255, 193, 7)' : 'yellow',
  'rgb(76, 175, 80)' : 'green',
  'rgb(96, 125, 139)' : 'grey',
  'rgb(103, 58, 183)' : 'purple',
  'rgb(33, 150, 243)' : 'blue',
  'rgb(0, 188, 212)' : 'cyan'
};

window.addEventListener('load', () => {
  chrome.storage.sync.get({
    buttonPos: 'right',
    color: 'rgb(255, 87, 34)'
  }, (items) => {
    document.getElementById(`${items.buttonPos}`).checked = true;
    document.querySelector(`.color--${colorMap[items.color]}`).classList.add('activeColor');
  });
});

document.querySelectorAll('button.color').forEach(button => {
  button.addEventListener('click', () => {
    chrome.storage.sync.set({
      color: window.getComputedStyle(button).backgroundColor
    }, () => {
      document.querySelector('.activeColor').classList.remove('activeColor');
      button.classList.add('activeColor');
      triggerToast();
    });
  });
});

document.querySelectorAll('input[name=pos]').forEach(input => {
  input.addEventListener('change', () => {
    if (!input.checked)
      return;

    chrome.storage.sync.set({
      buttonPos: input.value
    }, () => {
      triggerToast();
    });
  });
});

document.querySelector('a[href="#ScrollTab"]').addEventListener('click', () => {
  chrome.storage.sync.get({
    scrollSpeed: '1'
  }, (items) => {
    document.querySelector(`input[name='speed'][value='${items.scrollSpeed}']`).checked = true;
  });
});

document.querySelectorAll('input[name=speed]').forEach(input => {
  input.addEventListener('change', () => {
    if (!input.checked)
      return;

    chrome.storage.sync.set({
      scrollSpeed: input.value
    }, () => {
      triggerToast();
    });
  });
});

document.querySelectorAll('a.js-author-link').forEach((link) => {
  link.addEventListener('click', () => {
    chrome.tabs.create({url: link.href});
    return false;
  });
});
