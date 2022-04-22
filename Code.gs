const slideId = Your_Template_Slide_ID;
const driveId = Your_Target_Folder_ID;
//Example url: WWW.PUBLICSCRIPT.URL/exec?NAME={{ 2g2pd }}&LOCATION={{ 67mj5 }}&GOAL={{ 46egt }}&URL={{ a3v4 }}
function doGet(e) {
  var presentation = SlidesApp.openById("slideId")
  var slide = presentation.getSlides()[0];
  var dupSlide = slide.duplicate().getObjectId();
  var urlParameters = e.parameter;
  var keys = Object.keys(urlParameters);
  
  for (i = 0; i < keys.length; i++) {
    replaceThings(keys[i], urlParameters[keys[i]], presentation.getSlideById(dupSlide));
  }
  var qrImage = generateQr(keys.URL);
  presentation.getSlideById(dupSlide).insertImage(qrImage, 441.36, 529.92, 198.72, 198.72);
  presentation.getSlideById(dupSlide).insertImage(qrImage, 1170, 529.92, 198.72, 198.72);  
  
  var downloadSlide1 = downloadSlide("Fundraising Brochure" + dupSlide, presentation.getId(), dupSlide);
  return HtmlService.createHtmlOutput('<h1>Dupslide id: '+ dupSlide +'</h1><h1>2nd id: '+ presentation.getSlides()[1].getPageElements()[6].getParentPage().getObjectId() +'</h1><iframe src="https://drive.google.com/file/d/'+ downloadSlide1 +'/preview" width="640" height="480"></iframe>')

}
function downloadSlide(name, presentationId, slideId) {
  var url = 'https://docs.google.com/presentation/d/' + presentationId +
    '/export/pdf?id=' + presentationId //+ '&pageid=' + slideId;
  var options = {
    headers: {
      Authorization: 'Bearer ' + ScriptApp.getOAuthToken()
    },
    "contentType" : "application/pdf",
    "muteHttpExceptions" : true
  };
  var response = UrlFetchApp.fetch(url, options);
  var image = response.getAs(MimeType.PDF);
  image.setName(name);
  return DriveApp.getFolderById(driveId).createFile(image).getId();
}
//Credit: https://stackoverflow.com/questions/31662455/how-to-download-google-slides-as-images

function saveSlideAsPdf(name, presentationId, slideId) {
  var url = "https://docs.google.com/presentation/d/" + presentationId +
    "/export/pdf?id=" + presentationId + "&pageid=" + slideId;
  var options = {
    'muteHttpExceptions': true
  };
  var response = UrlFetchApp.fetch(url, options);
  var image = response.getAs(MimeType.PDF);
  image.setName(name);
  return DriveApp.getFolderById(driveId).createFile(image).getId();
}

//Replaces text in slide, case sensitive.
function replaceThings (replacing, replacement, slide) {
  slide.replaceAllText(replacing, replacement, true);
}
//GeneratesQR code from //https://developers.google.com/chart/infographics/docs/qr_codes
function generateQr (url) {
  //Image size
  var imageSize= "&chs=" + "265x265";
  //Data to encode
  var encodeUrl = "&chl="+encodeURIComponent(url);
  //URL with QR image
  return "https://chart.googleapis.com/chart?cht=qr&chld=L|0" + encodeUrl + imageSize;
}
