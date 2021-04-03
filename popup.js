var tabId;

window.addEventListener("load", () => {
    chrome.tabs.getSelected(null, function(tab) {
        tabId = tab.id;
        chrome.tabs.sendMessage(tab.id, {text: 'getImages'}, createDownloadPage);
    });
});

function createDownloadPage(imageLinks) {
    console.log(imageLinks);
    chrome.storage.sync.set({imageLinks: imageLinks}, function() {
        chrome.storage.sync.set({tabId: tabId}, function() {
            window.open("downloadPage.html");
        });
    });
}