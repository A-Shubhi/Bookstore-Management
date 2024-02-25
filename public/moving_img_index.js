function displayNextImage1() {
    x = (x === images.length - 1) ? 0 : x + 1;
    document.getElementById("img1").src = images[x];
    
}

function displayNextImage2() {
    x2 = (x2 === images.length - 1) ? 0 : x2 + 1;
    document.getElementById("img2").src = images[x2];
    
}

function displayPreviousImage() {
    x = (x <= 0) ? images.length - 1 : x - 1;
    document.getElementById("img1").src = images[x];
    
}

function startTimer() {
    setInterval(displayNextImage1, 2000);
    setInterval(displayNextImage2, 2000);
}

var images = [], x = -1, x2=0;
images[0] = "img1.jpg";
images[1] = "img2.jpg";
images[2] = "img3.jpg";