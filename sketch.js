function preventArrowScroll(e) {
    if ([37, 38, 39, 40].includes(e.keyCode)) { // Arrow key codes
        e.preventDefault();
    }
}

window.addEventListener("keydown", preventArrowScroll);


let x; // Current X position
let y; // Current Y position
let step = 1; // Step size for movement
let isUpPressed = false; // To track if the up arrow is pressed
let isDownPressed = false; // To track if the down arrow is pressed
let isLeftPressed = false; // To track if the left arrow is pressed
let isRightPressed = false; // To track if the right arrow is pressed
let penColor = "#000000"; // Default pen color is black
let penSize = 4; // Default pen size
let brushType = "point";
let dotCounter = 0; // Counter to track distance for dotted line brush
let prevX, prevY; // Previous positions for some brushes


function setup() {
    const canvas = createCanvas(906, 563); // 50% of window size
    canvas.position(((windowWidth - width) / 2) - 4, ((windowHeight - height) / 2) - 58); // Center the canvas
    //canvas.style('border', '5px solid black'); // Add a border
    //canvas.style('background-color', '#FFFFFF'); // Set canvas background color

    // Initialize positions
    x = width / 2;
    y = height / 2;
    prevX = x;
    prevY = y;

    strokeWeight(penSize);
}


function draw() {


    // Check if any arrow keys are pressed
    if (isUpPressed) {
        y -= step; // Move up
    }
    if (isDownPressed) {
        y += step; // Move down
    }
    if (isLeftPressed) {
        x -= step; // Move left
    }
    if (isRightPressed) {
        x += step; // Move right
    }

    // Ensure the drawing stays within the canvas bounds
    x = constrain(x, 0, width);
    y = constrain(y, 0, height);

    // Draw based on the current brush type
    if (brushType === "point") {
        stroke(penColor);
        strokeWeight(penSize);
        point(x, y);
    }  else if (brushType === "spray") {
        noStroke();
        fill(penColor);
        for (let i = 0; i < 10; i++) {
            let offsetX = random(-penSize, penSize);
            let offsetY = random(-penSize, penSize);
            circle(x + offsetX, y + offsetY, 2); // Random tiny circles
        }
    } else if (brushType === "firework") {
        let numRays = 15; // Number of lines in the firework burst
        let radius = penSize * 2; // Length of the firework rays
        fireworkSpacing = penSize * 20; // Spacing proportional to pen size

        stroke(penColor);
        strokeWeight(penSize / 8); // Smaller stroke for the rays
    
        for (let i = 0; i < numRays; i++) {
            let angle = TWO_PI * (i / numRays); // Angle for each ray
            let endX = x + cos(angle) * radius; // End X position
            let endY = y + sin(angle) * radius; // End Y position
            line(x, y, endX, endY); // Draw the firework ray
        }
    } else if (brushType === "snake") {
        let wobbleRange = penSize * 2; // Amount of wiggle depends on the pen size
    
        stroke(penColor);
        strokeWeight(penSize);
    
        // Random offsets to create the wavy snake effect
        let offsetX = random(-wobbleRange, wobbleRange);
        let offsetY = random(-wobbleRange, wobbleRange);
    
        // Draw the line from the previous position to the new wiggled position
        line(prevX, prevY, x + offsetX, y + offsetY);
    
        // Update the previous position to the current wiggled position
        prevX = x + offsetX;
        prevY = y + offsetY;
    } else if (brushType === "shadow") {
        let r = red(penColor);
        let g = green(penColor);
        let b = blue(penColor);
    
        for (let i = 0; i < 10; i++) {
            noStroke();
            fill(r, g, b, 50); // Semi-transparent shadow color
            let offsetX = random(-penSize * 2, penSize * 2);
            let offsetY = random(-penSize * 2, penSize * 2);
            circle(x + offsetX, y + offsetY, penSize * 2); // Shadow circles
        }
    } else if (brushType === "confetti") {
        for (let i = 0; i < 10; i++) {
            let randomColor = color(random(255), random(255), random(255)); // Random colors
            fill(randomColor);
            noStroke();
            let rectSize = random(1, penSize); // Varying rectangle sizes
            let offsetX = random(-penSize , penSize );
            let offsetY = random(-penSize , penSize );
            rect(x + offsetX, y + offsetY, rectSize, rectSize); // Tiny confetti rectangles
        }
    } else if (brushType === "ribbon") {
        noFill();
        stroke(penColor);
        strokeWeight(penSize / 2);
        let controlX1 = x + random(-penSize * 5, penSize * 5);
        let controlY1 = y + random(-penSize * 5, penSize * 5);
        let controlX2 = x + random(-penSize * 5, penSize * 5);
        let controlY2 = y + random(-penSize * 5, penSize * 5);
        let endX = x + random(-penSize * 2, penSize * 2);
        let endY = y + random(-penSize * 2, penSize * 2);
        bezier(x, y, controlX1, controlY1, controlX2, controlY2, endX, endY);
    } else if (brushType === "pixel") {
        noStroke();
        fill(penColor);
        let pixelSize = penSize; // Each square is the size of the pen
        rect(x, y, pixelSize, pixelSize); // Draw a single square
    } else if (brushType === "dottedLine") {
        // Dotted line brush
        dotCounter += step; // Increment the counter based on movement step size

        // Check if it's time to draw the next dot
        if (dotCounter >= penSize * 2) { // Spacing proportional to pen size
            noStroke();
            fill(penColor);
            circle(x, y, penSize); // Draw the dot
            dotCounter = 0; // Reset the counter
        }
    } else if (brushType === "triangle") {
        noStroke();
        fill(penColor);
        
        // Calculate the triangle's vertices based on the pen size
        let halfSize = penSize / 2;
        let height = penSize * sqrt(3) / 2; // Height of an equilateral triangle
    
        // Triangle vertices relative to the (x, y) position
        let x1 = x;
        let y1 = y - height / 2; // Top vertex
        let x2 = x - halfSize;
        let y2 = y + height / 2; // Bottom-left vertex
        let x3 = x + halfSize;
        let y3 = y + height / 2; // Bottom-right vertex
    
        // Draw the triangle
        triangle(x1, y1, x2, y2, x3, y3);
    }
    
    prevX = x;
    prevY = y;

}


function keyPressed() {
    // Update the pressed state for the arrow keys
    if (keyCode === UP_ARROW) {
        isUpPressed = true;
    } else if (keyCode === DOWN_ARROW) {
        isDownPressed = true;
    } else if (keyCode === LEFT_ARROW) {
        isLeftPressed = true;
    } else if (keyCode === RIGHT_ARROW) {
        isRightPressed = true;
    // Change the pen color with the letter keys
    } else if (key === 'Q' || key === 'q') {
        penColor = "#FF0000";
    } else if (key === 'W' || key === 'w') {
        penColor = "#ff4500";
    } else if (key === 'E' || key === 'e') {
        penColor = "#ff7f00";
    } else if (key === 'R' || key === 'r') {
        penColor = "#ffa500";
    } else if (key === 'T' || key === 't') {
        penColor = "#ffd700";
    } else if (key === 'Y' || key === 'y') {
        penColor = "#ffff00";
    } else if (key === 'U' || key === 'u') {
        penColor = "#adff2f";
    } else if (key === 'I' || key === 'i') {
        penColor = "#7fff00";
    } else if (key === 'O' || key === 'o') {
        penColor = "#00ff00";
    } else if (key === 'P' || key === 'p') {
        penColor = "#32cd32";
    } else if (key === 'A' || key === 'a') {
        penColor = "#4b9b5b";
    } else if (key === 'S' || key === 's') {
        penColor = "#00ff7f";
    } else if (key === 'D' || key === 'd') {
        penColor = "#40e0d0";
    } else if (key === 'F' || key === 'f') {
        penColor = "#1e90ff";
    } else if (key === 'G' || key === 'g') {
        penColor = "#0000ff";
    } else if (key === 'H' || key === 'h') {
        penColor = "#8a2be2";
    } else if (key === 'J' || key === 'j') {
        penColor = "#9400d3";
    } else if (key === 'K' || key === 'k') {
        penColor = "#9932cc";
    } else if (key === 'L' || key === 'l') {
        penColor = "#dda0dd";
    } else if (key === 'Z' || key === 'z') {
        penColor = "#ff00ff";
    } else if (key === 'X' || key === 'x') {
        penColor = "#ff1493";
    } else if (key === 'C' || key === 'c') {
        penColor = "#ff69b4";
    } else if (key === 'V' || key === 'v') {
        penColor = "#ffffff";
    } else if (key === 'B' || key === 'b') {
        penColor = "#000000";
    } else if (key === 'N' || key === 'n') {
        penColor = "#808080";
    } else if (key === 'M' || key === 'm') {
        penColor = "#8b4513";
    // Change the pen size with the plus and minus
    } else if (key === '=' || key === '+') {
        penSize += 2; // Increase pen size
    } else if (key === '-' || key === '_') {
        penSize -= 2; // Decrease pen size
        if (penSize < 1) {
            penSize = 1; // Ensure pen size doesn't go below 1
          }
    // Change the brush type with number keys
    } else if (key === '1') {
        brushType = "point";
    } else if (key === '5') {
        brushType = "spray";
    } else if (key === '6') {
        brushType = "firework";
    } else if (key === '7') {
        brushType = "snake";
    } else if (key === '8') {
        brushType = "shadow";
    } else if (key === '0') {
        brushType = "confetti";
    } else if (key === '9') {
        brushType = "ribbon";
    } else if (key === '2') {
        brushType = "pixel";
    } else if (key === '4') {
        brushType = "dottedLine";
    } else if (key === '3') {
        brushType = "triangle";
     //Change return key to eraser
    } else if (key === "Enter") {
        penColor = "#ffffff";
        brushType = "point";
    // Clears canvas
    } else if (keyCode === DELETE || keyCode === BACKSPACE) {  // Check if the Delete key is pressed
        clear();  // Clears the entire canvas
    // Save button with command S
    } else if (keyIsDown(SHIFT)) {
        saveCanvas('MyDrawing', 'png'); // Save the canvas as a PNG
      }
}

function keyReleased() {
    // Reset the pressed state for the arrow keys
    if (keyCode === UP_ARROW) {
        isUpPressed = false;
    } else if (keyCode === DOWN_ARROW) {
        isDownPressed = false;
    } else if (keyCode === LEFT_ARROW) {
        isLeftPressed = false;
    } else if (keyCode === RIGHT_ARROW) {
        isRightPressed = false;
    }
}


function windowResized() {
  //resizeCanvas(windowWidth * 0.5, windowHeight * 0.5);
 const canvas = select('canvas');
   canvas.position((windowWidth - width) / 2, (windowHeight - height) / 2);
}