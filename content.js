chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    var messageText = msg.text;
    console.log(`4chan Image Downloader: Received message: ${messageText}`);

    switch (messageText) {
        case `getImageLinks`:
            sendResponse(getImageLinks());
            break;

        case `getCurrentBoard`:
            sendResponse(getCurrentBoard());
            break;
            
        case `getThreadNumber`:
            sendResponse(getThreadNumber());
            break;

        case `getThreadSubject`:
            sendResponse(getThreadSubject());
            break;

        case `getThreadTitle`:
            sendResponse(getThreadTitle());
            break;

        default:
            console.log(`4chan Image Downloader: Unknown message`);
            break;
    }
});

function getImageLinks() {
    var imageLinks = [];

    document.querySelectorAll(`.fileThumb`).forEach((element) => {
        var parent = element.parentNode.parentNode.parentNode.parentNode;

        if (parent.className != `inline`) {
            imageLinks.push(element.href);
        }
    });

    return imageLinks;
}

function getCurrentBoard() {
    var currentUrl = window.location.href;
    var urlSegments = currentUrl.split(`/`);
    var currentBoard = urlSegments[3];

    return currentBoard;
}

function getThreadNumber() {
    var threadNumber = document.querySelectorAll(`.opContainer`)[0].querySelectorAll(`.postInfo`)[0].querySelectorAll(`.postNum`)[0].childNodes[1].innerText;

    return threadNumber;
}

function getThreadSubject() {    
    var threadSubject = document.querySelectorAll(`.opContainer`)[0].querySelectorAll(`.postInfo`)[0].querySelectorAll(`.subject`)[0].innerText;

    return threadSubject;
}

function getThreadTitle() {
    var threadTitle = document.querySelectorAll(`.opContainer`)[0].querySelectorAll(`.postMessage`)[0].innerText;

    return threadTitle;
}

console.log(`4chan Image Downloader ready!`);