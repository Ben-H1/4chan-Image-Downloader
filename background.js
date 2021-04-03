chrome.runtime.onInstalled.addListener(function() {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [new chrome.declarativeContent.PageStateMatcher({
                pageUrl: {hostEquals: 'boards.4chan.org'}
            })],
            actions: [new chrome.declarativeContent.ShowBrowserAction()]
        }]);
    });
});

chrome.browserAction.onClicked.addListener(function (tab) {
    chrome.tabs.sendMessage(tab.id, {text: 'report_back'}, doStuffWithDom);
});

function doStuffWithDom(document) {
    console.log("here");
    window.open("http://www.google.com");
}