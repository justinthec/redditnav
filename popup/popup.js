var toastActive = false;
function triggerToast () {
  if (!toastActive) {
    toastActive = true;
    Materialize.toast('Refresh to see changes!', 4000, '', function() {
      toastActive = false
    });
  }
}

$(function() {
  $("button.color").click(function() {
    var color = $(this).css('background-color');
    chrome.storage.sync.set({
      color: color
    }, function() {
      triggerToast();
    });
  });

  $('input[type=radio]').on('change', function() {
    var buttonPos = $('input[name="pos"]:checked').val();
    chrome.storage.sync.set({
      "buttonPos": buttonPos
    }, function() {
      triggerToast();
    });
  });

  $('a[href="#ButtonTab"').on('click', function() {
    chrome.storage.sync.get({
      buttonPos: 'right'
    }, function(items) {
      $('#' + items.buttonPos + '').prop('checked', true);
    });
  });

  $('a.js-author-link').on('click', function() {
    chrome.tabs.create({url: $(this).attr('href')});
    return false;
  });
});
