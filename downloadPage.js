document.getElementById(`downloadAllButton`)     .addEventListener(`click`, downloadAll);
document.getElementById(`selectAllButton`)       .addEventListener(`click`, selectAll);
document.getElementById(`selectNoneButton`)      .addEventListener(`click`, selectNone);
document.getElementById(`invertSelectionButton`) .addEventListener(`click`, invertSelection);
document.getElementById(`downloadSelectedButton`).addEventListener(`click`, downloadSelected);
document.getElementById(`refreshButton`)         .addEventListener(`click`, refreshImages);

document.getElementById(`downloadAllButton2`)     .addEventListener(`click`, downloadAll);
document.getElementById(`selectAllButton2`)       .addEventListener(`click`, selectAll);
document.getElementById(`selectNoneButton2`)      .addEventListener(`click`, selectNone);
document.getElementById(`invertSelectionButton2`) .addEventListener(`click`, invertSelection);
document.getElementById(`downloadSelectedButton2`).addEventListener(`click`, downloadSelected);
document.getElementById(`refreshButton2`)         .addEventListener(`click`, refreshImages);

var imageLinks    = null;
var tabId         = null;
var currentBoard  = null;
var threadNumber  = null;
var threadSubject = null;
var threadTitle   = null;

var downloadFolder = `4chan`;
var imageSize      = 300;
var viewportWidth;
var imagesPerRow;
var checkboxScale  = 2;
var checkboxMargin = 8 * checkboxScale;
var objectFit      = `contain`; //fill, contain, cover, scale-down, none
var useBorder      = true;
var borderSize     = 2;

chrome.storage.sync.get([`imageLinks`], function(data) {
    imageLinks = data.imageLinks;

    chrome.storage.sync.get([`tabId`], function(data) {
        tabId = data.tabId;

        chrome.storage.sync.get([`currentBoard`], function(data) {
            currentBoard = data.currentBoard;

            chrome.storage.sync.get([`threadNumber`], function(data) {
                threadNumber = data.threadNumber;
                
                chrome.storage.sync.get([`threadSubject`], function(data) {
                    threadSubject = removeInvalidCharactersFromThreadText(data.threadSubject);

                    chrome.storage.sync.get([`threadTitle`], function(data) {
                        threadTitle = removeInvalidCharactersFromThreadText(data.threadTitle);
        
                        //document.querySelector(`#downloadPathBox`).value += `${downloadFolder}\\${currentBoard}\\${threadNumber} - ${threadTitle}`;
        
                        document.querySelector(`#downloadPathBox`).value += `${downloadFolder}\\`;
                        document.querySelector(`#downloadPathBox`).value += `${currentBoard}\\`;
                        document.querySelector(`#downloadPathBox`).value += `${threadNumber}`;
                        if (threadSubject != `` && threadSubject != null && threadSubject != undefined) {
                            document.querySelector(`#downloadPathBox`).value += ` - ${threadSubject}`;
                        }
                        if (threadTitle != `` && threadTitle != null && threadTitle != undefined) {
                            document.querySelector(`#downloadPathBox`).value += ` - ${threadTitle}`;
                        }

                        chrome.storage.sync.get([`imageSize`], function(data) {
                            //imageSize = data.imageSize;
                            createImages();
                        });
                    });
                });
            });
        });
    });
});

function createImages() {
    viewportWidth = document.documentElement.clientWidth;
    imagesPerRow  = Math.floor(viewportWidth / imageSize);

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
                    subElement.loop     = true;
                    subElement.muted    = true;
        
                    var source  = document.createElement(`source`);
                    source.src  = currentImageLink;
                    source.type = `video/webm`;
        
                    subElement.appendChild(source);
                    subElement.load();
                } else {
                    subElement     = document.createElement(`img`);
                    subElement.src = currentImageLink;
                }

                subElement.width           = `${imageSize}`;
                subElement.height          = `${imageSize}`;
                subElement.style.objectFit = objectFit;

                if (useBorder) {
                    subElement.style.border = `${borderSize}px solid white`;
                }

                subElement.style.zIndex = `1`;
                subElement.ondragstart  = function() {return false;}
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
        downloadFile(link.href);
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
            downloadFile(link.href);
        }
    });
}

function downloadFile(file) {
    var fileNameParts = file.split(`/`);
    var fileName = fileNameParts[fileNameParts.length - 1];
    var path = document.querySelector(`#downloadPathBox`).value;
    if (path.charAt(path.length - 1) != `\\` && path.charAt(path.length - 1) != `/`) {
        path += `\\`;
    }
    path += fileName;
    console.log(path);

    chrome.downloads.download({url: file, filename: path});
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

function removeInvalidCharactersFromThreadText(threadText) {
    var newThreadText = ``;
    var invalidChars   = [`\n`, `\\`, `/`, `:`, `*`, `?`, `"`, `<`, `>`, `|`, `.`, `~`];

    for (var i = 0; i < threadText.length; i++) {
        var currentChar = threadText.charAt(i);

        if (! invalidChars.includes(currentChar)) {
            newThreadText += currentChar;
        } else {
            if (i != threadText.length - 1) {
                newThreadText += ` `;
            }
        }
    }

    return newThreadText;
}