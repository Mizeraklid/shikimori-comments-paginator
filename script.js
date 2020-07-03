var customPerPage = 20;
var customSkip = 20;
var count = 0;
var currentPage = 1;
var maxPage = 1;
var minPage = 1;
var pagingTimer;
var objectName = null;
var dataId = null;
var storagePage = null;
var saveCurrentPage = true;
$(function () {
    if (dataId === null) {
        dataId = $('#comments-extension-data').data('id');
    }
    if (storagePage === null) {
        storagePage = $('#comments-extension-data').data('page');
    }
    drawAndListenCustomPaging(true);
});

function drawAndListenCustomPaging(first = false) {
    var commentsLoader = document.querySelector('.comments-loader');
    // commentsLoader.prop('hidden', true);

    if (first) {
        if (commentsLoader) {
            customPerPage = parseInt(commentsLoader.getAttribute('data-limit'));
            customSkip = parseInt(commentsLoader.getAttribute('data-skip'));
            count = parseInt(commentsLoader.getAttribute('data-count'));
        }
        currentPage = Math.ceil(count / customPerPage) + 1;
        if (currentPage < 10) {
            return;
        } else {
            $('.comments-loader').prop('hidden', true);
        }
        var paging = document.createElement('ul');
        var pagingBottom = document.createElement('ul');
        paging.setAttribute('class', 'pagination');
        paging.setAttribute('id', 'paging-block');

        pagingBottom.setAttribute('class', 'pagination');
        pagingBottom.setAttribute('id', 'paging-block-bottom');
        document.querySelector('.b-comments').prepend(paging);
        document.querySelector('.b-comments').append(pagingBottom);
        maxPage = currentPage;
    }
    // console.log(currentPage, 'lul');

    drawPagingBlock();
    document.querySelectorAll('span.page-link').forEach(e => e.addEventListener('click', pageButtonClicked));
    // var page = chrome.storage.sync.get([location.href]);

    $('.custom-submit').on('click', function () {
        var page = Math.min(Math.max(parseInt($('.custom-page').val()), 1), maxPage);
        moveToPage(page);
        $('.custom-page').val(page);
    });
    $('#save-page').on('change', function () {
        saveCurrentPage = $('#save-page').is(':checked')
    });
    if (first && storagePage) {
        moveToPage(storagePage);
    }
}

function pageButtonClicked(e) {
    var commentsLoader = document.querySelector('.comments-loader');
    if (commentsLoader) {
        var clickedPage = parseInt(e.target.textContent);
        // console.log(clickedPage);
        moveToPage(clickedPage)
    }
}

function moveToPage(clickedPage) {
    // return;
    var commentsLoader = document.querySelector('.comments-loader');
    setCommentsLoaderSkip((maxPage - clickedPage) * customPerPage);
    document.querySelectorAll('.b-comment').forEach(e => e.remove());
    commentsLoader.click();
    currentPage = clickedPage;
    pagingTimer = setTimeout(function checkCommentsLoaderCreated() {
        if (!document.querySelector('.b-comment')) {
            pagingTimer = setTimeout(checkCommentsLoaderCreated, 50);
        } else {
            clearInterval(pagingTimer);
            drawAndListenCustomPaging();
            if (saveCurrentPage) {
                var event = new CustomEvent('page-update', {'detail': clickedPage});
                document.dispatchEvent(event);
            }
            // chrome.storage.sync.set({[key]: clickedPage});
            window.scrollTo(0, 0);
        }
    }, 50);
}

function setCommentsLoaderSkip(skip) {
    var commentsLoader = $('.comments-loader');
    commentsLoader.data('skip', skip);
    commentsLoader.data('count', count);
    if (commentsLoader.data('clickloaded-url')) {
        commentsLoader.data('clickloaded-url', commentsLoader.data('clickloaded-url').replace(/^(.*\/)\d+(\/\d+)$/, '$1' + (skip - customPerPage) + '$2'));
    }
    // if (commentsLoaded.data('clickloaded-url')) {
    //   commentsLoaded.data('clickloaded-url', commentsLoaded.data('clickloaded-url').replace(/^(.*\/)\d+(\/\d+)$/, '$1'+(skip - customPerPage)+'$2'));
    // }
}

function drawPagingBlock() {
    var pagingBlock = document.getElementById('paging-block');
    var pagingBlockBottom = document.getElementById('paging-block-bottom');
    pagingBlock.innerHTML = '';
    pagingBlockBottom.innerHTML = '';
    var newHtml = '';
    var pagesRendered = [];
    var i = 1;
    for (; i < 3; i++) {
        if (i <= maxPage) {
            // console.log(i, 997);
            newHtml += '<li class="page-item ' + (currentPage === i ? 'active' : '') + '" data-page="' + i + '"><span class="page-link">' + i + '</a></li>';
            // pagingBlock.append();
            pagesRendered.push(i);
        }
    }
    if (i + 2 < currentPage) {
        newHtml += '<li class="page-item disabled"><span class="page-link">...</span></li>';
    }

    i = currentPage - 2;

    for (; i < currentPage + 3; i++) {
        if (i <= maxPage && !pagesRendered.includes(i) && i > 0) {
            // console.log(i, 93);
            newHtml += '<li class="page-item ' + (currentPage === i ? 'active' : '') + '" data-page="' + i + '"><span class="page-link">' + i + '</span></li>';
            pagesRendered.push(i);
        }
    }

    if (i + 2 < maxPage) {
        newHtml += '<li class="page-item disabled"><span class="page-link">...</span></li>';
    }

    i = maxPage - 2;

    for (; i <= maxPage; i++) {
        if (!pagesRendered.includes(i) && i > 0) {
            // console.log(i, 99);
            newHtml += '<li class="page-item ' + (currentPage === i ? 'active' : '') + '" data-page="' + i + '"><span class="page-link">' + i + '</span></li>';
            pagesRendered.push(i);
        }
    }
    pagingBlockBottom.innerHTML = newHtml;
    newHtml += '<div style="margin-left:20px" class="form-inline"><div class="form-group"><label for="custom-page" class="sr-only">Email</label><input class="form-control custom-page" placeholder="Input custom page number" value="' + currentPage + '">' +
        '</div><button class="btn btn-primary mb-2 custom-submit">Submit</button></div><div style="margin-left:20px" class="form-check"><input type="checkbox" id="save-page" class="form-check-input"' + (saveCurrentPage ? 'checked' : '') + '><label class="form-check-label" for="save-page">Save current page</label></div>';
    pagingBlock.innerHTML = newHtml;

}


