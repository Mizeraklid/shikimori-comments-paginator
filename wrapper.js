var pageHasCommentLoadMoreButton = false;
var timeOutTime = 2000;
var SITE_URL = 'shikimori.one';

if (location.host === SITE_URL) {

  pageUri = location.pathname;
  chrome.storage.local.get([pageUri], function (result) {
    page = result[pageUri];
    var extensionId = document.createElement('div');
    extensionId.setAttribute('data-id', chrome.runtime.id);
    extensionId.setAttribute('data-page', page);
    extensionId.setAttribute('id', 'comments-extension-data');
    document.querySelector('body').append(extensionId);
  });

  let timerId = setTimeout(function checkJQueryAndButtonLoad() {
    if (!document.querySelector('.b-comments') || !document.querySelector('.comments-loader')) {
      timerId = setTimeout(checkJQueryAndButtonLoad, timeOutTime * 2);
    } else {
      clearInterval(timerId);
      injectScript();
      // drawAndListenCommentLoader();
    }
  }, timeOutTime);
  window.addEventListener('load', function () {
    clearInterval(timerId);
    if (document.querySelector('.b-comments') && document.querySelector('.comments-loader')) {
      if (!document.getElementById('paging-block')) {
        // drawAndListenCommentLoader();
        injectScript();
      }
    }
  });
}

function drawAndListenCommentLoader() {
  // var commentsLoaded = $('.comments-loader');
  // customPerPage = commentsLoaded.data('limit');
  // customSkip = commentsLoaded.data('skip');
  // count = commentsLoaded.data('count');
  // $('.b-comments').prepend('<div><label for="per-page">Per Page</label><input type="text" value="'+customPerPage+'" id="per-page">' +
  //     '<label for="skip">Skip</label><input type="text" value="'+customSkip+'" id="skip"></div>');
  // $('#per-page').on('change', function () {
  //   var limit =  Math.max(1, Math.min(100, $(this).val()));
  //   $(this).val(limit);
  //   commentsLoaded.data('limit', limit);
  //   commentsLoaded.attr('data-limit', limit);
  //
  //   commentsLoaded.data('clickloaded-url-template', commentsLoaded.data('clickloaded-url-template').replace(/^(.*\/)\d+$/, '$1'+limit));
  //   if (commentsLoaded.data('clickloaded-url')) {
  //     commentsLoaded.data('clickloaded-url', commentsLoaded.data('clickloaded-url').replace(/^(.*\/)\d+$/, '$1' + limit));
  //   }
  //   commentsLoaded.text(commentsLoaded.text().replace(/^(.*?)\d+(.*)$/, "$1"+limit+"$2"));
  // });
  // $('#skip').on('change', function () {
  //   //   var skip = $(this).val();
  //   commentsLoaded.data('skip', skip);
  //   commentsLoaded.attr('data-skip', skip);
  // });
}

function injectScript() {
  var s = document.createElement('script');
// TODO: add "script.js" to web_accessible_resources in manifest.json
  s.src = chrome.runtime.getURL('script.js');
  s.onload = function() {
    this.remove();
  };
  (document.head || document.documentElement).appendChild(s);


}
console.log(chrome.runtime.id);

document.addEventListener("page-update", function(data) {
  chrome.storage.local.set({[pageUri]: data.detail}, function (result) {
  });
});
