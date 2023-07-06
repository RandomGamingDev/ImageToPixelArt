function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

let fileInput;
let img;
let downScaler;
let colors;
let numColors;
let pColors;

function colorDif(col1, col2) {
  let dif = 0;
  for (const i in col1._array)
    dif += Math.abs(col1._array[i] - col2._array[i]);
  return dif;
}

function handleImg(img) {
  numColors = prompt("Enter the number of colors you want");
  if (numColors > 1) {
    pColors = new Array(numColors);
    for (let i = 0; i < numColors; i++)
      pColors[i] = color(prompt(`Enter the color you want in slot ${i + 1}:`));
  }
  
  downScaler.resizeCanvas(
          prompt("What do you want the new width to be?"),
          prompt("What do you want the new height to be?")
    );
  downScaler.image(img, 0, 0, downScaler.width, downScaler.height);
  
  if (numColors < 2)
    return;
    
  downScaler.loadPixels();
  for (let x = 0; x < downScaler.width; x++)
    for (let y = 0; y < downScaler.height; y++) {
      let dif = 4;
      let pixCol = downScaler.get(x, y);
      for (let i in pixCol)
        pixCol[i] = pixCol[i] / 255;
      pixCol = color(pixCol[0], pixCol[1], pixCol[2], pixCol[3]);

      let newCol = color(0);
      
      for (const pColor of pColors) {
        let nDif = colorDif(pixCol, pColor);
        if (nDif >= dif)
          continue;
        dif = nDif;
        newCol = pColor;
      }
      
      downScaler.set(x, y, newCol);
    }
  downScaler.updatePixels();
}

function handleFile(file) {
  if (file.type === 'image') {
    img = loadImage(file.data, handleImg);
  } else {
    img = null;
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(RGB, 1);
  noSmooth();
  
  downScaler = createGraphics(1,1);
  downScaler.colorMode(RGB, 1);
  downScaler.noSmooth();
  
  fileInput = createFileInput(handleFile);
  fileInput.position(0, 0);
}

function draw() {
  background(220);
  image(downScaler, 0, 0, width, height);
}