chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    var messageText = msg.text;
    console.log(`Received message: ${messageText}`);

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
            console.log(`Unknown message`);
            break;
    }
});

function getImageLinks() {
    var imageLinks = [];

    document.querySelectorAll(`.fileThumb`).forEach((element) => {
        imageLinks.push(element.href);
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
    var threadNumber = ``;

    try {
        threadNumber = document.querySelectorAll(`.opContainer`)[0].childNodes[0].childNodes[2].childNodes[9].childNodes[1].innerText;
    } catch (e) {
        threadNumber = document.querySelectorAll(`.opContainer`)[0].childNodes[0].childNodes[2].childNodes[8].childNodes[1].innerText;
    }

    return threadNumber;
}

function getThreadSubject() {
    var threadSubject = document.querySelectorAll(`.opContainer`)[0].childNodes[0].childNodes[2].childNodes[3].innerText;

    if (threadSubject == undefined) {
        threadSubject = document.querySelectorAll(`.opContainer`)[0].childNodes[0].childNodes[2].childNodes[2].innerText;
    }

    return threadSubject;
}

function getThreadTitle() {
    var threadTitle = document.querySelectorAll(`.opContainer`)[0].childNodes[0].childNodes[3].innerText;

    return threadTitle;
}

console.log(`4chan Image Downloader ready!`);