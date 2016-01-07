var toastActive = false;
function triggerToast () {
  if (toastActive)
    return;

  toastActive = true;
  Materialize.toast('Refresh to see changes!', 4000, '', function() {
    toastActive = false
  });
}

Array.prototype.forEach.call(document.querySelectorAll("button.color"), function(button) {
  button.addEventListener("click", function(event) {
    chrome.storage.sync.set({
      color: window.getComputedStyle(button).backgroundColor
    }, function() {
      triggerToast();
    });
  });
});

Array.prototype.forEach.call(document.querySelectorAll("input[type=radio]"), function(input) {
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

Array.prototype.forEach.call(document.querySelectorAll("a.js-author-link"), function(link) {
  link.addEventListener("click", function(event) {
    chrome.tabs.create({url: link.href});
    return false;
  });
});
