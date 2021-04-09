var tabId;

window.addEventListener("load", () => {
    chrome.tabs.getSelected(null, function(tab) {
        tabId = tab.id;

        chrome.tabs.sendMessage(tab.id, {text: 'getImages'}, (imageLinks) => {
            chrome.tabs.sendMessage(tab.id, {text: `getThreadNumber`}, (threadNumber) => {
                chrome.tabs.sendMessage(tab.id, {text: `getThreadTitle`}, (threadTitle) => {

                    createDownloadPage(imageLinks, threadNumber, threadTitle);
                });
            });
        });
    });
});

function createDownloadPage(imageLinks, threadNumber, threadTitle) {
    console.log(imageLinks);
    console.log(threadNumber);
    console.log(threadTitle);

    chrome.storage.sync.set({imageLinks: imageLinks}, function() {
        chrome.storage.sync.set({threadNumber: threadNumber}, function() {
            chrome.storage.sync.set({threadTitle: threadTitle}, function() {
                chrome.storage.sync.set({tabId: tabId}, function() {

                    window.open("downloadPage.html");
                });
            });
        });
    });
}