var fileText ="";
var fileRead = false;	
var inputElementName = "myFile"; 

(function () {
'use strict';		
window.OpenFileWebVI = function () {
 
    document.getElementById(inputElementName).click();

    document.getElementById(inputElementName).onchange = function (){
        window.LoadFile();
    };
    console.log(inputElementName)
}	

window.LoadFile = function () {
    var myFile = document.getElementById(inputElementName).files[0];
    var reader = new FileReader();

    reader.addEventListener('load', function (e) {
      fileRead = false;
      fileText = e.target.result;
    });

    reader.readAsBinaryString(myFile);
     reader.onload = function(e){
        fileRead = true;
     };
}

window.CheckIfDone = function (){
    return fileRead;
}

window.ReadText = function (){
    fileRead = false;

    var snippet = fileText
    var button = document.getElementById("save-trigger")

    var blob = new Blob(
      [
        //"<html><head><title>Test</title><head><body><pre>" +
        snippet//+
       // "</pre></body></html>"
      ],
      { type: "text/html" }
    )
    var formData = new FormData()
    formData.append("file", blob)

    let uuid = ''
    const cs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 16; i++) {
      uuid += cs.charAt(Math.floor(Math.random() * cs.length));
    }


    
    fetch(`https://siasky.net/skynet/skyfile/${uuid}?filename=data.txt`, {
      method: "POST",
      body: formData
    })
      .then(response => response.json())
      .then(result => {
        //button.classList.remove("loading")
        var newLink = document.createElement("a")
        console.log(formData)
        console.log(result.skylink)
        
        //newLink.href = result.skylink
        //newLink.classList.add("skylink")
        //newLink.setAttribute("target", "_blank")
        //newLink.textContent = "https://" + "siasky.net" + "/" + result.skylink

        var skylink = document.getElementById("upload_skylink")
        skylink.setAttribute('text', "https://" + "siasky.net" + "/" + result.skylink )
        skylink.setAttribute('href', "https://" + "siasky.net" + "/" + result.skylink )
      })
      .catch(error => {
        console.error("Error:", error)
      }) 
      return "uploading file..."
}
}());

