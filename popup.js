var tabId;

window.addEventListener("load", () => {
    chrome.tabs.getSelected(null, function(tab) {
        tabId = tab.id;
        chrome.tabs.sendMessage(tab.id, {text: 'getImages'}, (imageLinks) => {
            chrome.tabs.sendMessage(tab.id, {text: `getThreadNumber`}, (threadNumber) => {
                createDownloadPage(imageLinks, threadNumber);
            })
        });
    });
});

function createDownloadPage(imageLinks, threadNumber) {
    console.log(imageLinks);
    console.log(threadNumber);
    chrome.storage.sync.set({imageLinks: imageLinks}, function() {
        chrome.storage.sync.set({threadNumber: threadNumber}, function() {
            chrome.storage.sync.set({tabId: tabId}, function() {
                window.open("downloadPage.html");
            });
        });
    });
}