var downloadAllButton      = document.querySelector(`#downloadAllButton`);
var selectAllButton        = document.querySelector(`#selectAllButton`);
var selectNoneButton       = document.querySelector(`#selectNoneButton`);
var invertSelectionButton  = document.querySelector(`#invertSelectionButton`);
var downloadSelectedButton = document.querySelector(`#downloadSelectedButton`);
var refreshButton          = document.querySelector(`#refreshButton`);
var scrollToBottomButton   = document.querySelector(`#scrollToBottomButton`);

var downloadAllButton2      = document.querySelector(`#downloadAllButton2`);
var selectAllButton2        = document.querySelector(`#selectAllButton2`);
var selectNoneButton2       = document.querySelector(`#selectNoneButton2`);
var invertSelectionButton2  = document.querySelector(`#invertSelectionButton2`);
var downloadSelectedButton2 = document.querySelector(`#downloadSelectedButton2`);
var refreshButton2          = document.querySelector(`#refreshButton2`);
var scrollToTopButton       = document.querySelector(`#scrollToTopButton`);

var collapsible = document.querySelector(`#collapsible`);
var hiddenOptionsContent = document.querySelector(`#hiddenOptionsContent`);

var imageSizeSlider = document.querySelector(`#imageSizeSlider`);
var imageSizeBox    = document.querySelector(`#imageSizeBox`);

var checkboxScaleSlider = document.querySelector(`#checkboxScaleSlider`);
var checkboxScaleBox    = document.querySelector(`#checkboxScaleBox`);

var borderSizeSlider = document.querySelector(`#borderSizeSlider`);
var borderSizeBox    = document.querySelector(`#borderSizeBox`);

var imageFitDropdown = document.querySelector(`#imageFitDropdown`);

var autoplayVideosCheckbox = document.querySelector(`#autoplayVideosCheckbox`);
var loopVideosCheckbox     = document.querySelector(`#loopVideosCheckbox`);
var playVideoSoundCheckbox = document.querySelector(`#playVideoSoundCheckbox`);
var videoControlsCheckbox  = document.querySelector(`#videoControlsCheckbox`);

// top buttons
downloadAllButton     .addEventListener(`click`, downloadAll);
selectAllButton       .addEventListener(`click`, selectAll);
selectNoneButton      .addEventListener(`click`, selectNone);
invertSelectionButton .addEventListener(`click`, invertSelection);
downloadSelectedButton.addEventListener(`click`, downloadSelected);
refreshButton         .addEventListener(`click`, () => {refreshImages(false)});
scrollToBottomButton  .addEventListener(`click`, scrollToBottom);

// bottom buttons
downloadAllButton2     .addEventListener(`click`, downloadAll);
selectAllButton2       .addEventListener(`click`, selectAll);
selectNoneButton2      .addEventListener(`click`, selectNone);
invertSelectionButton2 .addEventListener(`click`, invertSelection);
downloadSelectedButton2.addEventListener(`click`, downloadSelected);
refreshButton2         .addEventListener(`click`, () => {refreshImages(true)});
scrollToTopButton      .addEventListener(`click`, scrollToTop);

// collapsible options
collapsible.addEventListener(`click`, () => {
    if (hiddenOptionsContent.style.display == `block`) {
        hiddenOptionsContent.style.display = `none`;
        collapsible.value = `\u25ba Options`;
    } else {
        hiddenOptionsContent.style.display = `block`;
        collapsible.value = `\u25bc Options`;
    }
});

// image size
imageSizeSlider.addEventListener(`input`, updateImageSizeValue);
imageSizeSlider.addEventListener(`change`, recreateImageGrid);

// checkbox scale
checkboxScaleSlider.addEventListener(`input`, updateCheckboxScaleValue);
checkboxScaleSlider.addEventListener(`change`, recreateImageGrid);

// border size
borderSizeSlider.addEventListener(`input`, updateBorderSizeValue);
borderSizeSlider.addEventListener(`change`, recreateImageGrid);

// image fit
imageFitDropdown.addEventListener(`change`, () => {recreateImageGrid(); updateImageFitValue();});

// video controls
autoplayVideosCheckbox.addEventListener(`change`, () => {recreateImageGrid(); updateAutoplayVideosValue();});
loopVideosCheckbox.addEventListener(`change`, () => {recreateImageGrid(); updateLoopVideosValue();});
playVideoSoundCheckbox.addEventListener(`change`, () => {recreateImageGrid(); updatePlayVideoSoundValue();});
videoControlsCheckbox.addEventListener(`change`, () => {recreateImageGrid(); updateVideoControlsValue();});

// viewport
window.addEventListener('resize', checkViewport);

var imageLinks    = null;
var tabId         = null;
var currentBoard  = null;
var threadNumber  = null;
var threadSubject = null;
var threadTitle   = null;

var viewportWidth  = window.innerWidth;

var downloadFolder = null;
var imageSize      = null;
var viewportWidth  = null;
var imagesPerRow   = null;
var checkboxScale  = null;
var checkboxMargin = null;
var objectFit      = null;
var useBorder      = true;
var borderSize     = 2;

var autoplayVideos = null;
var loopVideos     = null;
var playVideoSound = null;
var videoControls  = null;

initialiseValues();

function initialiseValues() {
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
                    
                            chrome.storage.sync.get([`defaultDownloadFolder`], function(data) { //IMPLEMENT
                                if (isEmpty(data.defaultDownloadFolder)) {
                                    downloadFolder = `4chan`;
                                } else {
                                    downloadFolder = data.defaultDownloadFolder;
                                }

                                document.querySelector(`#downloadPathBox`).value += `${downloadFolder}\\`;
                                document.querySelector(`#downloadPathBox`).value += `${currentBoard}\\`;
                                document.querySelector(`#downloadPathBox`).value += `${threadNumber}`;
                                if (threadSubject != `` && threadSubject != null && threadSubject != undefined) {
                                    document.querySelector(`#downloadPathBox`).value += ` - ${threadSubject}`;
                                }
                                if (threadTitle != `` && threadTitle != null && threadTitle != undefined) {
                                    document.querySelector(`#downloadPathBox`).value += ` - ${threadTitle}`;
                                }
    
                                chrome.storage.sync.get([`defaultImageSize`], function(data) {
                                    if (isEmpty(data.defaultImageSize)) {
                                        imageSize = 300;
                                    } else {
                                        imageSize = data.defaultImageSize;
                                    }

                                    imageSizeSlider.value  = imageSize;
                                    imageSizeBox.innerText = imageSize;

                                    chrome.storage.sync.get([`defaultCheckboxScale`], function(data) {
                                        if (isEmpty(data.defaultCheckboxScale)) {
                                            checkboxScale = 2;
                                        } else {
                                            checkboxScale = data.defaultCheckboxScale;
                                        }

                                        checkboxScaleSlider.value  = checkboxScale;
                                        checkboxScaleBox.innerText = checkboxScale;

                                        chrome.storage.sync.get([`defaultBorderSize`], function(data) {
                                            if (isEmpty(data.defaultBorderSize)) {
                                                borderSize = 2;
                                            } else {
                                                borderSize = data.defaultBorderSize;
                                            }

                                            borderSizeSlider.value  = borderSize;
                                            borderSizeBox.innerText = borderSize;

                                            chrome.storage.sync.get([`defaultImageFit`], function(data) {
                                                if (isEmpty(data.defaultImageFit)) {
                                                    objectFit = `contain`; //fill, contain, cover, scale-down, none
                                                } else {
                                                    objectFit = data.defaultImageFit;
                                                }

                                                imageFitDropdown.value = objectFit;

                                                chrome.storage.sync.get([`defaultAutoplayVideos`], function(data) {
                                                    if (isEmpty(data.defaultAutoplayVideos)) {
                                                        autoplayVideos = true;
                                                    } else {
                                                        autoplayVideos = data.defaultAutoplayVideos;
                                                    }

                                                    autoplayVideosCheckbox.checked = autoplayVideos;

                                                    chrome.storage.sync.get([`defaultLoopVideos`], function(data) {
                                                        if (isEmpty(data.defaultLoopVideos)) {
                                                            loopVideos = true;
                                                        } else {
                                                            loopVideos = data.defaultLoopVideos;
                                                        }
   
                                                       loopVideosCheckbox.checked = loopVideos;

                                                        chrome.storage.sync.get([`defaultPlayVideoSound`], function(data) {
                                                            if (isEmpty(data.defaultPlayVideoSound)) {
                                                                playVideoSound = false;
                                                            } else {
                                                                playVideoSound = data.defaultPlayVideoSound;
                                                            }
       
                                                           playVideoSoundCheckbox.checked = playVideoSound;

                                                            chrome.storage.sync.get([`defaultVideoControls`], function(data) {
                                                                if (isEmpty(data.defaultVideoControls)) {
                                                                    videoControls = false;
                                                                } else {
                                                                    videoControls = data.defaultVideoControls;
                                                                }

                                                                videoControlsCheckbox.checked = videoControls;

                                                                createImages();
    });});});});});});});});});});});});});});});
}

function updateImageSizeValue() {
    imageSize = imageSizeSlider.value;
    imageSizeBox.innerText = imageSize;

    chrome.storage.sync.set({defaultImageSize: imageSize});
}

function updateCheckboxScaleValue() {
    checkboxScale = checkboxScaleSlider.value;
    checkboxScaleBox.innerText = checkboxScale;

    chrome.storage.sync.set({defaultCheckboxScale: checkboxScale});
}

function updateBorderSizeValue() {
    borderSize = borderSizeSlider.value;
    borderSizeBox.innerText = borderSize;

    chrome.storage.sync.set({defaultBorderSize: borderSize});
}

function updateImageFitValue() {
    chrome.storage.sync.set({defaultImageFit: objectFit});
}

function updateAutoplayVideosValue() {
    autoplayVideos = autoplayVideosCheckbox.checked;

    chrome.storage.sync.set({defaultAutoplayVideos: autoplayVideos});
}

function updateLoopVideosValue() {
    loopVideos = loopVideosCheckbox.checked;

    chrome.storage.sync.set({defaultLoopVideos: loopVideos});
}

function updatePlayVideoSoundValue() {
    playVideoSound = playVideoSoundCheckbox.checked;

    chrome.storage.sync.set({defaultPlayVideoSound: playVideoSound});
}

function updateVideoControlsValue() {
    videoControls = videoControlsCheckbox.checked;

    chrome.storage.sync.set({defaultVideoControls: videoControls});
}

function checkViewport() {
    if (window.innerWidth != viewportWidth) {
        recreateImageGrid();
    }

    viewportWidth = window.innerWidth;
}

function createImages() {
    viewportWidth  = document.documentElement.clientWidth;
    imagesPerRow   = Math.floor(viewportWidth / imageSize);
    checkboxMargin = 8 * checkboxScale;
    objectFit      = imageFitDropdown.value;

    autoplayVideos = autoplayVideosCheckbox.checked;
    loopVideos = loopVideosCheckbox.checked;
    playVideoSound = playVideoSoundCheckbox.checked;
    videoControls = videoControlsCheckbox.checked;

    for (var i = 0; i < imageLinks.length; i += imagesPerRow) {
        var table    = document.querySelector(`#imageTable`);
        var tableRow = document.createElement(`tr`);
        
        for (var j = i; j < i + imagesPerRow; j++) {
            try {
                var currentImageLink = imageLinks[j];

                var tableData = document.createElement(`td`);
                var element   = document.createElement(`div`);
                var subElement;
    
                if (currentImageLink.includes(`webm`)) {
                    subElement          = document.createElement(`video`);
                    subElement.autoplay = autoplayVideos;
                    subElement.loop     = loopVideos;
                    subElement.muted    = ! playVideoSound;
                    subElement.controls = videoControls;
        
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
    console.log(`Downloading: ${fileName}`);

    chrome.downloads.download({url: file, filename: path}, (result) => {
        console.log(`${fileName} downloaded!`);
    });
}

function recreateImageGrid() {
    var table = document.querySelector(`#imageTable`);
    table.innerHTML = ``;

    createImages();
}

function refreshImages(scrollToBottomFlag) {
    chrome.tabs.getSelected(null, function(tab) {
        chrome.tabs.sendMessage(tabId, {text: 'getImageLinks'}, (result) => {
            var newImageLinks = result;

            if (chrome.runtime.lastError) {
                console.log(`Unable to retrieve images`);
            }

            if (newImageLinks != null) {
                imageLinks = newImageLinks;

                chrome.storage.sync.set({imageLinks: imageLinks}, () => {
                    recreateImageGrid();
    
                    if (scrollToBottomFlag) {
                        scrollToBottom();
                    }
                });
            }
        });
    });
}

function scrollToBottom() {
    window.scrollTo(0,document.documentElement.scrollHeight);
}

function scrollToTop() {
    document.documentElement.scrollTop = 0;
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

function isEmpty(variable) {
    if ((variable == `` || variable == null || variable == undefined || typeof variable == undefined) && variable != true && variable != false) {
        return true;
    }

    return false;
}