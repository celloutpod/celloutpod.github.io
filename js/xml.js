function loadXMLDoc() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        episodes(this);
      }
    };
    xmlhttp.open("GET", "https://anchor.fm/s/6a6cc108/podcast/rss", true);
    xmlhttp.send();
  }

function addToRow(row, className, ele){
    var x=document.createElement("div");
    x.className=className;
    x.appendChild(ele);
    row.appendChild(x);
    return(row);
}

function date(string){
    var d = new Date(string);
    var dateString = d.getMonth() + "/" + d.getDate() + "/" + d.getFullYear();
    return(dateString);
}

function srcConvert(string){
    var parts=string.split("/");
    var name=parts[parts.length - 1];
    var url="https://anchor.fm/cellout/embed/episodes/"+name;
    return(url);
}

function makeModal(title, description, id, url){
    var modal=document.createElement("div");
    modal.className="modal fade";
    modal.id=id;
    // dialogue
    var dialogue=document.createElement("div");
    dialogue.className="modal-dialog modal-dialog-centered modal-lg";
    // content
    var content=document.createElement("div");
    content.className="modal-content";
    // header
    var header=document.createElement("div");
    header.className="modal-header";
    // title
    var modalTitle=document.createElement("h4");
    modalTitle.innerHTML=title;
    modalTitle.className="modal-title";
    header.appendChild(modalTitle);
    // close button
    var button=document.createElement("button");
    button.type="button";
    button.className="btn-close";
    var dataBsDismiss=document.createAttribute("data-bs-dismiss");
    dataBsDismiss.value="modal";
    button.setAttributeNode(dataBsDismiss);
    header.appendChild(button);
    // button.onclick=delIframe(id);
    button.addEventListener('click', delIframe);
    // body
    var modalBody=document.createElement("div");
    modalBody.className="modal-body";
    var container=document.createElement("div");
    container.className="container";
    container.innerHTML=description;   
    // audio
    // var audio=document.createElement("audio");
    // audio.controls="controls";
    // var source=document.createElement("source");
    // source.src=url;
    // source.type="audio/mp4";

    // iframe
    // var iframe=document.createElement("iframe");
    // iframe.src=srcConvert(url);
    // iframe.height="100px";
    // iframe.width="100%";
    // iframe.frameborder="0";
    // iframe.scrolling="no";

    var container1=document.createElement("div");
    container1.className="container";
    // container1.appendChild(iframe); 
    container1.id=id + " iframeContainer";   
    modalBody.appendChild(container1);
    modalBody.appendChild(container);

    content.appendChild(header);
    content.appendChild(modalBody);
    dialogue.appendChild(content);
    modal.appendChild(dialogue);
    return(modal);

}

function makeIframe(){
    var parentID=this.getAttribute("modalID");
    var url=this.getAttribute("url");
    var iframeContainer=document.getElementById(parentID + " iframeContainer");

    var iframe=document.createElement("iframe");
    iframe.src=srcConvert(url);
    iframe.height="100px";
    iframe.width="100%";
    iframe.frameborder="0";
    iframe.scrolling="no";

    iframeContainer.appendChild(iframe);

    
}

function delIframe(){
    var parent=this.parentNode.parentNode.parentNode.parentNode;
    // var parent=document.getElementById(parentID); // modal ID
    var iframe=parent.getElementsByTagName('IFRAME')[0]; // find iframe
    var iframeContainer=document.getElementById(parent.id+" iframeContainer");
    iframeContainer.removeChild(iframe); // remove it to stop playing audio
    return;
}

function episodes(xml) {
    var xmlDoc = xml.responseXML;
    var container=document.createElement("div");
    container.className="container";

    var x = xmlDoc.getElementsByTagName("item");
    for (var i = 0; i < x.length; i++) { 
        // create anchor
        var a=document.createElement("a");
        var title=x[i].getElementsByTagName("title")[0].childNodes[0].nodeValue;
        var tag=title.replace(/\s/g, '');
        a.href="#"+tag;
        var dataBsToggle=document.createAttribute("data-bs-toggle");
        dataBsToggle.value="modal";
        a.setAttributeNode(dataBsToggle);
        // create row
        var row=document.createElement("div");
        row.className="row container border rounded";
        // add image
        src = x[i].getElementsByTagName("itunes:image")[0].getAttributeNode("href").nodeValue;
        var img = document.createElement("img");
        img.src = src;
        img.className="img-fluid";
        img.style.maxWidth="100%";
        row=addToRow(row, "col-6 col-md-2", img);
        // get name and time and duration
        var rawDate=x[i].getElementsByTagName("pubDate")[0].childNodes[0].nodeValue;
        var dateString = date(rawDate);
        var duration=x[i].getElementsByTagName("itunes:duration")[0].childNodes[0].nodeValue;
        var min=Math.floor(duration/60);
        // var s=Math.round((duration/60-min)*60);
        var text=
        title +
        "<br>" +
        dateString +
        "<br>" +
        min + " min";
        // min + "min, " + s + "s";
        var p=document.createElement("p");
        p.innerHTML=text;
        row=addToRow(row,"col-6 col-md-3",p);
        // add description
        var desc=x[i].getElementsByTagName("description")[0].childNodes[0].substringData(0,500).split("</p>")[0];
        var p2=document.createElement("p");
        p2.innerHTML=desc;

        row=addToRow(row, "d-none d-md-block col-12 col-md-7",p2);
        row.style.paddingTop="20px";
        row.style.paddingBottom="20px";

        a.appendChild(row);


        var description=x[i].getElementsByTagName("description")[0].childNodes[0].nodeValue;
        // var audioUrl=x[i].getElementsByTagName("enclosure")[0].getAttributeNode("url").nodeValue
        var src=x[i].getElementsByTagName("link")[0].childNodes[0].nodeValue;
        a.setAttribute('url', src);
        a.setAttribute('modalID', tag);
        a.addEventListener('click', makeIframe); 
        var modal=makeModal(title, description, tag, src);
;
        container.appendChild(a);
        container.appendChild(modal);
        container.appendChild(document.createElement("br"));
        document.getElementById("c1").appendChild(container);
    }

}