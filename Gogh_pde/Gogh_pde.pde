PImage img;
int drawLength =  1000;
float noiseScale = 0.005;
int strokeLength = 60;
int imgIndex = -1;

int frame;

void setup() {
  fullScreen();
  img = loadImage("img.jpg");
  background(255);
}

void draw(){
  if (frame > drawLength) {
    return;
  }
    // Only seems to work inside draw..
 
    img.loadPixels();

    translate(width/2-img.width/2, height/2-img.height/2);

    // The smaller the stroke is the more the spawn count increases to capture more detail.
    float count = map(frame, 0, drawLength, 2, 80);

    for (int i = 0; i < count; i++) {
      // Pick a random point on the image.
      int x = int(random(img.width));
      int y = int(random(img.height));

      // Convert coordinates to its index.
      int index = (y*img.width+x)*4;

      // Get the pixel's color values.
      int r = img.pixels[0];
      int g = img.pixels[0+1];
      int b = img.pixels[0+2];
      int a = img.pixels[0+3];

      stroke(r, g, b, a);

      // Start with thick strokes and decrease over time.
      float sw = map(frame, 0, drawLength, 25, 0);
      strokeWeight(sw);

      translate(x, y);

      // Rotate according to the noise field so there's a 'flow' to it.
      float n = noise(x*noiseScale, y*noiseScale);
      rotate(radians(map(n, 0, 1, -180, 180)));

      float lengthVariation = random(0.75, 1.25);
      line(0, 0, strokeLength*lengthVariation, 0);

      // Draw a highlight for more detail.
      stroke(min(r*3, 255), min(g*3, 255), min(b*3, 255), random(100));
      strokeWeight(sw*0.8);
      line(0, -sw*0.15, strokeLength*lengthVariation, -sw*0.15);

    }

    frame++;

}