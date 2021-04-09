chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    var messageText = msg.text;
    console.log(`Received message: ${messageText}`);

    switch (messageText) {
        case `getImages`:
            sendResponse(getImageLinks());
            break;

        case `getThreadNumber`:
            sendResponse(getThreadNumber());
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

function getThreadNumber() {
    var threadNumber = document.querySelectorAll(`.opContainer`)[0].childNodes[0].childNodes[2].childNodes[9].childNodes[1].innerText;
    
    return threadNumber;
}

function getThreadTitle() {
    var threadTitle = document.querySelectorAll(`.opContainer`)[0].childNodes[0].childNodes[3].innerText;

    return threadTitle;
}

console.log(`4chan Image Downloader ready!`);