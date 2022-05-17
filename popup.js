var tabId;

window.addEventListener("load", () => {
    chrome.tabs.getSelected(null, function(tab) { if (chrome.runtime.lastError) {}
        tabId = tab.id;

        chrome.tabs.sendMessage(tab.id, {text: 'getImageLinks'}, (imageLinks) => { if (chrome.runtime.lastError) {}
            chrome.tabs.sendMessage(tab.id, {text: 'getCurrentBoard'}, (currentBoard) => { if (chrome.runtime.lastError) {}
                chrome.tabs.sendMessage(tab.id, {text: `getThreadNumber`}, (threadNumber) => { if (chrome.runtime.lastError) {}
                    chrome.tabs.sendMessage(tab.id, {text: 'getThreadSubject'}, (threadSubject) => { if (chrome.runtime.lastError) {}
                        chrome.tabs.sendMessage(tab.id, {text: `getThreadTitle`}, (threadTitle) => { if (chrome.runtime.lastError) {}
    
                            createDownloadPage(imageLinks, currentBoard, threadNumber, threadSubject, threadTitle);
    });});});});});});
});

function createDownloadPage(imageLinks, currentBoard, threadNumber, threadSubject, threadTitle) {
    console.log(imageLinks);
    console.log(currentBoard);
    console.log(threadNumber);
    console.log(threadSubject);
    console.log(threadTitle);

    chrome.storage.sync.set({imageLinks: imageLinks}, function() {
        chrome.storage.sync.set({currentBoard: currentBoard}, function() {
            chrome.storage.sync.set({threadNumber: threadNumber}, function() {
                chrome.storage.sync.set({threadSubject: threadSubject}, function() {
                    chrome.storage.sync.set({threadTitle: threadTitle}, function() {
                        chrome.storage.sync.set({tabId: tabId}, function() {
        
                            window.open("downloadPage.html");
    });});});});});});
}
