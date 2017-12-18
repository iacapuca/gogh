/*
Noise flow field painter

Paints an image with strokes that are rotated by a flow field driven from noise.

Controls:
  - Click to change to the next image.
  - Press any key to save the canvas to a jpg.

Author:
  Jason Labbe

Site:
  jasonlabbe3d.com
*/

var drawLength = 500;
var noiseScale = 0.005;
var strokeLength = 60;

var imgNames = [ "https://i.imgur.com/kp4UNgj.jpg","https://i.imgur.com/5VpXYR7.jpg", "https://www.biography.com/.image/t_share/MTE1ODA0OTcxODExNDQwMTQx/vincent-van-gogh-9515695-3-402.jpg",'https://upload.wikimedia.org/wikipedia/commons/9/95/Van_Gogh_Self-Portrait_with_Straw_Hat_1887-Detroit.jpg']; // Add your image's name here.
var imgs = [];
var imgIndex = -1;

var frame;


var capturer


function preload() {
  // Pre-load all images.
  for (let i = 0; i < imgNames.length; i++) {
    let newImg = loadImage(imgNames[i]);
    imgs.push(newImg);

  }
}


function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);

  changeImage();

  capturer = new CCapture( {
      display: true,
      format: 'png',
      verbose: true,
      quality: 99,
     });
     capturer.start();
}


function draw() {
  if (frame = drawLength){
    console.log("Saving Record");
    capturer.save();
  }
  if (frame > drawLength) {
    return;
  }
  // Only seems to work inside draw..
  let img = imgs[imgIndex];
  img.loadPixels();
  translate(width/2-img.width/2, height/2-img.height/2);

  // The smaller the stroke is the more the spawn count increases to capture more detail.
  let count = map(frame, 0, drawLength, 2, 80);

  for (let i = 0; i < count; i++) {
    // Pick a random point on the image.
    let x = int(random(img.width))
    let y = int(random(img.height))

    // Convert coordinates to its index.
    let index = (y*img.width+x)*4;

    // Get the pixel's color values.
    let r = img.pixels[index];
    let g = img.pixels[index+1];
    let b = img.pixels[index+2];
    let a = img.pixels[index+3];

    stroke(r, g, b, a);

    // Start with thick strokes and decrease over time.
    let sw = map(frame, 0, drawLength, 25, 0);
    strokeWeight(sw);

	push();
    translate(x, y)

    // Rotate according to the noise field so there's a 'flow' to it.
    let n = noise(x*noiseScale, y*noiseScale);
    rotate(radians(map(n, 0, 1, -180, 180)));

    let lengthVariation = random(0.75, 1.25);
    line(0, 0, strokeLength*lengthVariation, 0);

    // Draw a highlight for more detail.
    stroke(min(r*3, 255), min(g*3, 255), min(b*3, 255), random(100));
    strokeWeight(sw*0.8);
    line(0, -sw*0.15, strokeLength*lengthVariation, -sw*0.15);

    pop();
  }
capturer.capture(defaultCanvas0);
  frame++;
}


function changeImage() {

  background(0);

  frame = 0;

  noiseSeed(int(random(1000)));

  imgIndex++;
  if (imgIndex >= imgNames.length) {
    imgIndex = 0;
  }
}


function keyTyped() {
  if (key === "r"){
    console.log("Saving Record");
    capturer.save();
  }
  else if (key === "c"){
    changeImage();
  }
  else if (key === 'p'){
    capturer.stop();
  }
}
