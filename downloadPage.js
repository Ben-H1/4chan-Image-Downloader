document.getElementById(`downloadAllButton`)     .addEventListener(`click`, downloadAll);
document.getElementById(`selectAllButton`)       .addEventListener(`click`, selectAll);
document.getElementById(`selectNoneButton`)      .addEventListener(`click`, selectNone);
document.getElementById(`invertSelectionButton`) .addEventListener(`click`, invertSelection);
document.getElementById(`downloadSelectedButton`).addEventListener(`click`, downloadSelected);
document.getElementById(`refreshButton`)         .addEventListener(`click`, refreshImages);

var imageLinks = null;
var tabId = null;

chrome.storage.sync.get([`imageLinks`], function(data) {
    imageLinks = data.imageLinks;
    chrome.storage.sync.get([`tabId`], function(data) {
        tabId = data.tabId;
        createImages();
    });
});

var imagesPerRow   = 5;
var imageSize      = 200;
var checkboxScale  = 2;
var checkboxMargin = 8 * checkboxScale;

function createImages() {
    for (var i = 0; i < imageLinks.length; i += imagesPerRow) {
        var table    = document.getElementById(`imageTable`);
        var tableRow = document.createElement(`tr`);
        
        for (var j = i; j < i + imagesPerRow; j++) {
            try {
                var currentImageLink = imageLinks[j];

                var tableData = document.createElement(`td`);
                var element   = document.createElement(`div`);
                var subElement;
    
                if (currentImageLink.includes(`webm`)) {
                    subElement          = document.createElement(`video`);
                    subElement.autoplay = true;
        
                    var source  = document.createElement(`source`);
                    source.src  = currentImageLink;
                    source.type = `video/webm`;
        
                    subElement.appendChild(source);
                    subElement.load();
    
                    subElement.width  = `${imageSize}`;
                    subElement.height = `${imageSize}`;
                    subElement.style.objectFit = `cover`;
                } else {
                    subElement        = document.createElement(`img`);
                    subElement.src    = currentImageLink;
                    subElement.width  = `${imageSize}`;
                    subElement.height = `${imageSize}`;
                    subElement.style.objectFit = `cover`;
                }

                subElement.style.zIndex = `1`;
                subElement.ondragstart = function() {return false;}
                element.className = `image`;

                var checkbox = document.createElement(`input`);
                checkbox.type             = `checkbox`;
                checkbox.className        = `checkbox`;
                checkbox.style.zIndex     = `2`;
                checkbox.style.position   = `absolute`;
                checkbox.style.transform  = `scale(${checkboxScale})`;
                checkbox.style.marginTop  = `${checkboxMargin}px`;
                checkbox.style.marginLeft = `${checkboxMargin}px`;
                element.appendChild(checkbox);

                var link = document.createElement(`a`);
                link.href = currentImageLink;
                link.style.display = `none`;
                checkbox.appendChild(link);

                subElement.addEventListener(`click`, check);
                element.appendChild(subElement);
                tableData.appendChild(element);
                tableRow.appendChild(tableData);
            } catch {}
        }
        
        table.appendChild(tableRow);
    }

    document.querySelector(`#topButtons`).style.display = `block`;
}

function check(element) {
    var checkbox = element.target.parentNode.childNodes[0];
    checkbox.checked = ! checkbox.checked;
}

function downloadAll() {
    document.querySelectorAll(`.checkbox`).forEach((element) => {
        var link = element.childNodes[0];
        chrome.downloads.download({url: link.href});
    });
}

function selectAll() {
    document.querySelectorAll(`.checkbox`).forEach((element) => {
        element.checked = true;
    });
}

function selectNone() {
    document.querySelectorAll(`.checkbox`).forEach((element) => {
        element.checked = false;
    });
}

function invertSelection() {
    document.querySelectorAll(`.checkbox`).forEach((element) => {
        element.checked = ! element.checked;
    });
}

function downloadSelected() {
    document.querySelectorAll(`.checkbox`).forEach((element) => {
        if (element.checked) {
            var link = element.childNodes[0];
            chrome.downloads.download({url: link.href});
        }
    });
}

function refreshImages() {
    chrome.tabs.getSelected(null, function(tab) {
        chrome.tabs.sendMessage(tabId, {text: 'getImages'}, (result) => {
            imageLinks = result;

            chrome.storage.sync.set({imageLinks: imageLinks});

            var table = document.querySelector(`#imageTable`);
            table.innerHTML = ``;

            createImages();
        });
    });
}