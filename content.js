chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg.text === 'getImages') {
        var imageLinks = [];
        document.querySelectorAll(`.fileThumb`).forEach((element) => {
            imageLinks.push(element.href);
        });
        sendResponse(imageLinks);
    }
});

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg.text === 'getThreadNumber') {
        var threadNumber = document.querySelectorAll(`.opContainer`)[0].childNodes[0].childNodes[2].childNodes[9].childNodes[1].innerText;
        sendResponse(threadNumber);
    }
});