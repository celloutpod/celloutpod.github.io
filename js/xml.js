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

function episodes(xml) {
    var xmlDoc = xml.responseXML;
    var container=document.createElement("div");
    container.className="container";

    var x = xmlDoc.getElementsByTagName("item");
    for (var i = 0; i < x.length; i++) { 
        // create anchor
        var a=document.createElement("a");
        a.href=x[i].getElementsByTagName("link")[0].childNodes[0].nodeValue;
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
        x[i].getElementsByTagName("title")[0].childNodes[0].nodeValue +
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
        container.appendChild(a);
        container.appendChild(document.createElement("br"));
        document.getElementById("c1").appendChild(container);
    }

}