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

var numberOfImagesBox            = document.querySelector(`#numberOfImagesBox`);
var numberOfImagesBox2           = document.querySelector(`#numberOfImagesBox2`);
var numberOfDownloadedImagesBox  = document.querySelector(`#numberOfDownloadedImagesBox`);
var numberOfDownloadedImagesBox2 = document.querySelector(`#numberOfDownloadedImagesBox2`);

var downloadPathBox         = document.querySelector(`#downloadPathBox`);
var invalidCharacterWarning = document.querySelector(`#invalidCharacterWarning`);

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

var backgroundColorInput = document.querySelector(`#backgroundColorInput`);
var textColorInput       = document.querySelector(`#textColorInput`);
var borderColorInput     = document.querySelector(`#borderColorInput`);
//var buttonColorInput     = document.querySelector(`#buttonColorInput`);

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

// download path
downloadPathBox.addEventListener(`input`, checkDownloadPath);

// collapsible options
collapsible.addEventListener(`click`, () => {
    if (hiddenOptionsContent.style.display == `block`) {
        hiddenOptionsContent.style.display = `none`;
        collapsible.value = `Show Options`;
    } else {
        hiddenOptionsContent.style.display = `block`;
        collapsible.value = `Hide Options`;
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
loopVideosCheckbox    .addEventListener(`change`, () => {recreateImageGrid(); updateLoopVideosValue();});
playVideoSoundCheckbox.addEventListener(`change`, () => {recreateImageGrid(); updatePlayVideoSoundValue();});
videoControlsCheckbox .addEventListener(`change`, () => {recreateImageGrid(); updateVideoControlsValue();});

// color
backgroundColorInput.addEventListener(`input`, () => {document.body.style.background = backgroundColorInput.value});
backgroundColorInput.addEventListener(`change`, updateBackgroundColorValue);

textColorInput.addEventListener(`input`, () => {changeTextColor(textColorInput.value);});
textColorInput.addEventListener(`change`, updateTextColorValue);

borderColorInput.addEventListener(`input`, () => {changeBorderColor(borderColorInput.value);});
borderColorInput.addEventListener(`change`, updateBorderColorValue);

//buttonColorInput.addEventListener(`input`, );
//buttonColorInput.addEventListener(`change`, updateButtonColorValue);

// viewport
window.addEventListener('resize', checkViewport);

var canDownload = true;

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
var borderSize     = null;

var selectedImages   = [];

var downloadedHue    = -80;
var downloadedFilter = `hue-rotate(${downloadedHue}deg)`;
var downloadedImages = [];
var numberOfDownloadedImages = 0;

var autoplayVideos = null;
var loopVideos     = null;
var playVideoSound = null;
var videoControls  = null;

var backgroundColor = null;
var textColor       = null;
var borderColor     = null;
var buttonColor     = null;

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
                                        imageSize = parseInt(data.defaultImageSize);
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

                                                                chrome.storage.sync.get([`defaultBackgroundColor`], function(data) {
                                                                    if (isEmpty(data.defaultBackgroundColor)) {
                                                                        backgroundColor = `#202020`; // rgb(32, 32, 32)
                                                                    } else {
                                                                        backgroundColor = data.defaultBackgroundColor;
                                                                    }

                                                                    backgroundColorInput.value     = backgroundColor;
                                                                    document.body.style.background = backgroundColor;

                                                                    chrome.storage.sync.get([`defaultTextColor`], function(data) {
                                                                        if (isEmpty(data.defaultTextColor)) {
                                                                            textColor = `#FFFFFF`; // rgb(255, 255, 255)
                                                                        } else {
                                                                            textColor = data.defaultTextColor;
                                                                        }

                                                                        textColorInput.value = textColor;

                                                                        changeTextColor(textColor);

                                                                        chrome.storage.sync.get([`defaultBorderColor`], function(data) {
                                                                            if (isEmpty(data.defaultBorderColor)) {
                                                                                borderColor = `#FFFFFF`; // rgb(255, 255, 255)
                                                                            } else {
                                                                                borderColor = data.defaultBorderColor;
                                                                            }

                                                                            borderColorInput.value = borderColor;

                                                                            changeBorderColor(borderColor);

                                                                            chrome.storage.sync.get([`defaultButtonColor`], function(data) {
                                                                                updateButtonColorValue();

                                                                                createImages();
    });});});});});});});});});});});});});});});});});});});
}

function checkDownloadPath() {
    var ignore = `${downloadFolder}\\${currentBoard}\\`
    var name = downloadPathBox.value.substring(ignore.length);
    
    if (containsInvalidCharacter(name)) {
        canDownload = false;
        invalidCharacterWarning.style.display = `block`;
    } else {
        canDownload = true;
        invalidCharacterWarning.style.display = `none`;
    }
}

function updateImageSizeValue() {
    imageSize = parseInt(imageSizeSlider.value);
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

function updateBackgroundColorValue() {
    backgroundColor = backgroundColorInput.value;

    updateButtonColorValue();

    chrome.storage.sync.set({defaultBackgroundColor: backgroundColor});
}

function changeTextColor(color) {
    var elements = document.getElementsByTagName(`span`);

    for (var i = 0; i < elements.length; i++) {
        elements[i].style.color = color;
    }
}

function updateTextColorValue() {
    textColor = textColorInput.value;

    chrome.storage.sync.set({defaultTextColor: textColor});
}

function changeBorderColor(color) {
    var images = document.getElementsByTagName(`img`);
    var videos = document.getElementsByTagName(`video`);

    for (var i = 0; i < images.length; i++) {
        images[i].style.borderColor = color;
    }

    for (var i = 0; i < videos.length; i++) {
        videos[i].style.borderColor = color;
    }
}

function updateBorderColorValue() {
    borderColor = borderColorInput.value;

    chrome.storage.sync.set({defaultBorderColor: borderColor});
}

function updateButtonColorValue() {
    if (lightnessFromHex(backgroundColor) > 50) {
        setButtonsToBlack();
        buttonColor = `black`;
    } else {
        setButtonsToWhite();
        buttonColor = `white`;
    }

    chrome.storage.sync.set({defaultButtonColor: buttonColor});
}

function checkViewport() {
    if (window.innerWidth != viewportWidth) {
        recreateImageGrid();
    }

    viewportWidth = window.innerWidth;
}

function createImages() {
    viewportWidth  = document.documentElement.clientWidth;
    imagesPerRow   = Math.floor(viewportWidth / (imageSize + (borderSize * 2) + 4 + 3));
    checkboxMargin = 8 * checkboxScale;
    objectFit      = imageFitDropdown.value;

    autoplayVideos = autoplayVideosCheckbox.checked;
    loopVideos     = loopVideosCheckbox.checked;
    playVideoSound = playVideoSoundCheckbox.checked;
    videoControls  = videoControlsCheckbox.checked;

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
                    subElement.style.border = `${borderSize}px solid ${borderColor}`;
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
                if (selectedImages.includes(currentImageLink)) {
                    checkbox.checked = true;
                }
                if (downloadedImages.includes(currentImageLink)) {
                    checkbox.checked = true;
                    checkbox.style.filter = downloadedFilter;
                }
                element.appendChild(checkbox);

                var link = document.createElement(`a`);
                link.href = currentImageLink;
                link.style.display = `none`;
                checkbox.appendChild(link);

                checkbox.addEventListener(`click`, check2);
                subElement.addEventListener(`click`, check);
                element.appendChild(subElement);
                tableData.appendChild(element);
                tableRow.appendChild(tableData);
            } catch {}
        }
        
        table.appendChild(tableRow);
    }

    numberOfImagesBox.innerText  = imageLinks.length;
    numberOfImagesBox2.innerText = imageLinks.length;
    numberOfDownloadedImagesBox.innerText  = numberOfDownloadedImages;
    numberOfDownloadedImagesBox2.innerText = numberOfDownloadedImages;

    document.querySelector(`#topButtons`).style.display = `block`;
}

function check(element) {
    var checkbox = element.target.parentNode.childNodes[0];
    var link = checkbox.childNodes[0].href;
    checkbox.checked = ! checkbox.checked;

    if (checkbox.checked) {
        selectedImages.push(link);
    } else {
        selectedImages.splice(selectedImages.indexOf(link), 1);
    }
}

function check2(element) {
    var checkbox = element.target;
    var link = checkbox.childNodes[0].href;

    if (checkbox.checked) {
        selectedImages.push(link);
    } else {
        selectedImages.splice(selectedImages.indexOf(link), 1);
    }
}

function downloadAll() {
    if (canDownload) {
        document.querySelectorAll(`.checkbox`).forEach((element) => {
            if (element.style.filter != downloadedFilter) {
                var link = element.childNodes[0];
                downloadFile(link.href, element);
            }
        });
    }
}

function selectAll() {
    document.querySelectorAll(`.checkbox`).forEach((element) => {
        element.checked = true;
    });
}

function selectNone() {
    document.querySelectorAll(`.checkbox`).forEach((element) => {
        if (element.style.filter != downloadedFilter) {
            element.checked = false;
        }
    });
}

function invertSelection() {
    document.querySelectorAll(`.checkbox`).forEach((element) => {
        if (element.style.filter != downloadedFilter) {
            var link = element.childNodes[0].href;
            element.checked = ! element.checked;

            if (element.checked) {
                selectedImages.push(link);
            } else {
                selectedImages.splice(selectedImages.indexOf(link), 1);
            }
        }
    });
    console.log(selectedImages);
}

function downloadSelected() {
    if (canDownload) {
        document.querySelectorAll(`.checkbox`).forEach((element) => {
            if (element.checked) {
                if (element.style.filter != downloadedFilter) {
                    var link = element.childNodes[0];
                    downloadFile(link.href, element);
                }
            }
        });
    }
}

function downloadFile(file, checkbox) {
    var fileNameParts = file.split(`/`);
    var fileName = fileNameParts[fileNameParts.length - 1];
    var path = document.querySelector(`#downloadPathBox`).value;
    if (path.charAt(path.length - 1) != `\\` && path.charAt(path.length - 1) != `/`) {
        path += `\\`;
    }
    path += fileName;
    console.log(`Downloading: ${fileName}`);

    chrome.downloads.download({url: file, filename: path}, () => {
        downloadedImages.push(file);
        checkbox.checked = true;
        checkbox.style.filter = downloadedFilter;
        console.log(`${fileName} downloaded!`);

        numberOfDownloadedImages += 1;
        numberOfDownloadedImagesBox.innerText  = numberOfDownloadedImages;
        numberOfDownloadedImagesBox2.innerText = numberOfDownloadedImages;
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
                    var scroll = window.pageYOffset;
                    recreateImageGrid();
    
                    if (scrollToBottomFlag) {
                        var html = document.getElementsByTagName(`html`)[0];
                        html.style.scrollBehavior = `auto`;
                        window.scrollTo(0, scroll);
                        html.style.scrollBehavior = `smooth`;
                        scrollToBottom();
                    }
                });
            }
        });
    });
}

function scrollToBottom() {
    window.scrollTo(0, document.documentElement.scrollHeight);
}

function scrollToTop() {
    document.documentElement.scrollTop = 0;
}

function removeInvalidCharactersFromThreadText(threadText) {
    var newThreadText = ``;
    
    for (var i = 0; i < threadText.length; i++) {
        var currentChar = threadText.charAt(i);

        if (! characterIsInvalid(currentChar)) {
            newThreadText += currentChar;
        } else {
            if (currentChar != `\n`) {
                newThreadText += `_`
            } else if (i != threadText.length - 1) {
                newThreadText += ` `;
            }
        }
    }

    return newThreadText;
}

function characterIsInvalid(char) {
    var invalidChars   = [`\n`, `\\`, `/`, `:`, `*`, `?`, `"`, `<`, `>`, `|`, `.`, `~`];

    if (invalidChars.includes(char)) {
        return true;
    }

    return false;
}

function containsInvalidCharacter(text) {
    for (var i = 0; i < text.length; i++) {
        var currentChar = text.charAt(i);

        if (characterIsInvalid(currentChar)) {
            return true;
        }
    }

    return false;
}

function setButtonsToBlack() {
    downloadAllButton     .src = `images/Download All Black.png`;
    selectAllButton       .src = `images/Select All Black.png`;
    selectNoneButton      .src = `images/Select None Black.png`;
    invertSelectionButton .src = `images/Invert Selection Black.png`;
    downloadSelectedButton.src = `images/Download Selected Black.png`;
    refreshButton         .src = `images/Refresh Black.png`;
    scrollToBottomButton  .src = `images/Scroll to Bottom Black.png`;

    downloadAllButton2     .src = `images/Download All Black.png`;
    selectAllButton2       .src = `images/Select All Black.png`;
    selectNoneButton2      .src = `images/Select None Black.png`;
    invertSelectionButton2 .src = `images/Invert Selection Black.png`;
    downloadSelectedButton2.src = `images/Download Selected Black.png`;
    refreshButton2         .src = `images/Refresh Black.png`;
    scrollToTopButton      .src = `images/Scroll to Top Black.png`;
}

function setButtonsToWhite() {
    downloadAllButton     .src = `images/Download All White.png`;
    selectAllButton       .src = `images/Select All White.png`;
    selectNoneButton      .src = `images/Select None White.png`;
    invertSelectionButton .src = `images/Invert Selection White.png`;
    downloadSelectedButton.src = `images/Download Selected White.png`;
    refreshButton         .src = `images/Refresh White.png`;
    scrollToBottomButton  .src = `images/Scroll to Bottom White.png`;

    downloadAllButton2     .src = `images/Download All White.png`;
    selectAllButton2       .src = `images/Select All White.png`;
    selectNoneButton2      .src = `images/Select None White.png`;
    invertSelectionButton2 .src = `images/Invert Selection White.png`;
    downloadSelectedButton2.src = `images/Download Selected White.png`;
    refreshButton2         .src = `images/Refresh White.png`;
    scrollToTopButton      .src = `images/Scroll to Top White.png`;
}

function isEmpty(variable) {
    if ((variable == `` || variable == null || variable == undefined || typeof variable == undefined) && variable != true && variable != false) {
        return true;
    }

    return false;
}

function lightnessFromHex(hex) {
    var rgb = hexToRgb(hex);

    var r = rgb[0];
    var g = rgb[1];
    var b = rgb[2];

    var rPrime = r / 255;
    var gPrime = g / 255;
    var bPrime = b / 255;

    var cMax = Math.max(rPrime, gPrime, bPrime);
    var cMin = Math.min(rPrime, gPrime, bPrime);

    var lightness = ((cMax + cMin) / 2) * 100;
    lightness = Math.round((lightness + Number.EPSILON) * 100) / 100;

    return lightness;
}

function hexToRgb(hex) {
    var rgb = hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i
               ,(m, r, g, b) => '#' + r + r + g + g + b + b)
       .substring(1).match(/.{2}/g)
       .map(x => parseInt(x, 16));
    
    return rgb;
}
