let toastActive = false;
function triggerToast () {
  if (toastActive)
    return;

  toastActive = true;
  Materialize.toast('Refresh to see changes!', 4000, '', () => {
    toastActive = false;
  });
}

Array.from(document.querySelectorAll('button.color')).forEach((button) => {
  button.addEventListener('click', (event) => {
    chrome.storage.sync.set({
      color: window.getComputedStyle(button).backgroundColor
    }, () => {
      triggerToast();
    });
  });
});

Array.from(document.querySelectorAll('input[type=radio]')).forEach((input) => {
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

document.querySelector('a[href="#ButtonTab"]').addEventListener('click', (event) => {
  chrome.storage.sync.get({
    buttonPos: 'right'
  }, (items) => {
    document.querySelector(`#${items.buttonPos}`).checked = true;
  });
});

Array.from(document.querySelectorAll('a.js-author-link')).forEach((link) => {
  link.addEventListener('click', (event) => {
    chrome.tabs.create({url: link.href});
    return false;
  });
});
