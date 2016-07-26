let toastActive = false;
function triggerToast () {
  if (toastActive)
    return;

  toastActive = true;
  Materialize.toast('Refresh to see changes!', 4000, '', () => {
    toastActive = false;
  });
}

window.addEventListener('load', (event) => {
  chrome.storage.sync.get({
    buttonPos: 'right',
    color: 'F44336'
  }, (items) => {
    document.querySelector(`#${items.buttonPos}`).checked = true;
    document.getElementById(`${items.color}`).classList.add("activeColor");
  });
});

Array.from(document.querySelectorAll('button.color')).forEach((button) => {
  button.addEventListener('click', (event) => {
    chrome.storage.sync.set({
      color: window.getComputedStyle(button).backgroundColor
    }, () => {
      document.querySelector(".activeColor").classList.remove("activeColor");
      button.classList.add("activeColor");
      triggerToast();
    });
  });
});

Array.from(document.querySelectorAll('input[name=pos]')).forEach((input) => {
  input.addEventListener('change', (event) => {
    if (!input.checked)
      return;

    chrome.storage.sync.set({
      buttonPos: input.value
    }, () => {
      triggerToast();
    });
  });
});

document.querySelector('a[href="#ScrollTab"]').addEventListener('click', (event) => {
  chrome.storage.sync.get({
    scrollSpeed: '1'
  }, (items) => {
    document.querySelector(`input[value='${items.scrollSpeed}']`).checked = true;
  });
});

Array.from(document.querySelectorAll('input[name=speed]')).forEach((input) => {
  input.addEventListener('change', (event) => {
    if (!input.checked)
      return;

    chrome.storage.sync.set({
      scrollSpeed: input.value
    }, () => {
      triggerToast();
    });
  });
});

Array.from(document.querySelectorAll('a.js-author-link')).forEach((link) => {
  link.addEventListener('click', (event) => {
    chrome.tabs.create({url: link.href});
    return false;
  });
});
