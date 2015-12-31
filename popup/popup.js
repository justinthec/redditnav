$(function() {
  $("button.color").click(function() {
    var color = $(this).css('background-color');
    chrome.storage.sync.set({
      color: color
    }, function() {
      console.log("Updated color to " + color);
      Materialize.toast('Refresh to see changes!', 4000);
    });
  });
});
