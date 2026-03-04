const currenturl=window.location.href;


switch (currenturl){
    case "http://localhost:3003/upload":
        document.getElementById('upload').style.borderBottom= "thick solid blue";
        break;
    case "http://localhost:3003/":
        document.getElementById('home').style.borderBottom = "thick solid blue";
        break;
    case "http://localhost:3003/signup":
        document.getElementById('signup').style.borderBottom = "thick solid blue";
        break;

}