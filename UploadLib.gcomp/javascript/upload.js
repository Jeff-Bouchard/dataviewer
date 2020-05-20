// Use the built-in browser dialog box to select and then open file.
//
// This example creates a function literal, and adds
// the function as a property of the Window object.
// The functions are defined within an anonymous function ( (function(){}()); )
// as a closure to prevent polluting the global namespace with our variables.
// If 'window.' is removed from 'window.OpenFileWebVI' then the function
// is no longer accessible from the WebVI. This is because it is only in the scope of
// this anonymous function, and not the global scope of the browser.
//
// From more information see:
// https://github.com/ni/webvi-examples
// https://developer.mozilla.org/en-US/docs/Web/API/Window

var fileText ="";
var fileRead = false;	
var inputElementName = "myFile"; 

(function () {
// Use strict prevents silent and common JavaScript errors.
'use strict';		
window.OpenFileWebVI = function () {
    console.log("start")
    // For debugging, uncomment this line.
    //console.log("in openfilewebti");
    document.getElementById(inputElementName).click();

    document.getElementById(inputElementName).onchange = function (){
        window.LoadFile();
    };
    console.log(inputElementName)
}	

window.LoadFile = function () {
    var myFile = document.getElementById(inputElementName).files[0];
    var reader = new FileReader();
    console.log(myFile)

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

    //button.classList.add("loading")
    var blob = new Blob(
      [
        "<html><head><title>Welcome To Skybin</title><head><body><pre>" +
        snippet +
        "</pre></body></html>"
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

    
    fetch(`https://siasky.net/skynet/skyfile/${uuid}?filename=skybin.html`, {
      method: "POST",
      body: formData
    })
      .then(response => response.json())
      .then(result => {
        //button.classList.remove("loading")
        var newLink = document.createElement("a")

        console.log(result.skylink)
        
        newLink.href = result.skylink
        newLink.classList.add("skylink")
        newLink.setAttribute("target", "_blank")
        newLink.textContent = "https://" + "siasky.net" + "/" + result.skylink
        //"https://" + window.location.hostname + "/" + result.skylink

          
        document.getElementById("skylinks").appendChild(newLink)
        var linkBreak = document.createElement("br")
        document.getElementById("skylinks").appendChild(linkBreak)
      })
      .catch(error => {
        button.classList.remove("loading")
        console.error("Error:", error)
      })


    return fileText;
}

}());

