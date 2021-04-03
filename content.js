chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg.text === 'getImages') {
        var imageLinks = [];
        document.querySelectorAll(`.fileThumb`).forEach((element) => {
            imageLinks.push(element.href);
        });
        sendResponse(imageLinks);
    }
});