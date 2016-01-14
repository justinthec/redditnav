var toastActive = false;
function triggerToast () {
  if (toastActive)
    return;

  toastActive = true;
  Materialize.toast('Refresh to see changes!', 4000, '', function() {
    toastActive = false
  });
}

Array.from(document.querySelectorAll("button.color")).forEach(function(button) {
  button.addEventListener("click", function(event) {
    chrome.storage.sync.set({
      color: window.getComputedStyle(button).backgroundColor
    }, function() {
      triggerToast();
    });
  });
});

Array.from(document.querySelectorAll("input[type=radio]")).forEach(function(input) {
  input.addEventListener("change", function(event) {
    if (!input.checked)
      return;

    chrome.storage.sync.set({
      buttonPos: input.value
    }, function() {
      triggerToast();
    });
  });
});

document.querySelector("a[href=\"#ButtonTab\"]").addEventListener("click", function(event) {
  chrome.storage.sync.get({
    buttonPos: 'right'
  }, function(items) {
    document.querySelector(`#${items.buttonPos}`).checked = true;
  });
});

Array.from(document.querySelectorAll("a.js-author-link")).forEach(function(link) {
  link.addEventListener("click", function(event) {
    chrome.tabs.create({url: link.href});
    return false;
  });
});
