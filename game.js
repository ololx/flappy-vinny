//Hight Scores
const hightScores = document.getElementById("score");

//Canvas init
let cvs = document.getElementById("canvas");
let ctx = cvs.getContext("2d");

//Sprites init
let vinny = new Image();
let bg = new Image();
let treeTop = new Image();
let treeBottom = new Image();
let bee = new Image();
let honney = new Image();

vinny.src = "img/vinny.png";
bg.src = "img/bg.jpg";
treeTop.src = "img/tree_n_up.png";
treeBottom.src = "img/tree_n.png";
bee.src = "img/bee.png";
honney.src = "img/honney.png";

//Scores
let score = 0;
let timeOut = false;

// Vinny Positions
let xPos = 300;
let yPos = 240;
let grav = 1.5;

//Sounds effects
let boom = new Audio();
let score_audio = new Audio();

boom.src = "audio/game-over.wav";
score_audio.src = "audio/score.mp3";

function moveUp() {
	let jumpSize = 25;
	yPos  -= jumpSize;
}

//Gap params init
function getGap() {
	
	let gapMax = 200;
	let gapMin = 120;

	return Math.floor(Math.random() * (gapMax - gapMin)) + gapMin;
}

// Blocks init
let trees = [];
let bees = [];
let honneys = [];

function newHonney() {
	honneys.push({
		x : Math.floor(Math.random() * (640 - 400)) + 400,
		y : Math.floor(Math.random() * (500 - 10)) + 10,
	});
}

function newBee() {
	bees.push({
		x : 0,
		y : Math.floor(Math.random() * (500 - 10)) + 10,
	});
}

function newTrees() {
	trees.push({
		x : cvs.width,
		y : Math.floor(Math.random() * treeTop.height) - treeTop.height,
		gap: getGap()
	});
}

function draw() {
	ctx.drawImage(bg, 0, 0);

	 //FIXME: add random Gap
	 for(let i = 0; i < bees.length; i++) {
	 	ctx.drawImage(bee, bees[i].x, bees[i].y);

		bees[i].x += 3;
		bees[i].y = (Math.random() * (2  -  1) + 1) === 2 ? bees[i].y + 1 : bees[i].y  -  1;

		if ((xPos + vinny.width >= bees[i].x || xPos >= bees[i].x)
			&& (xPos + vinny.width <= bees[i].x + bee.width || xPos <= bees[i].x + bee.width)
			&& (yPos + vinny.height >= bees[i].y || yPos >= bees[i].y)
			&& (yPos + vinny.height <= bees[i].y + bee.height || yPos <= bees[i].y + bee.height)) {
			bees.pop();
	 		boom.play();


			if ((score - 10) < 0) {
				timeOut = true;
				setTimeout(function() {location.reload();} , 3000);
			} else {
				score  -= 10;
			}
		}

	 }

	 for(let i = 0; i < honneys.length; i++) {
	 	ctx.drawImage(honney, honneys[i].x, honneys[i].y);

		honneys[i].x--;

		if ((xPos + vinny.width >= honneys[i].x || xPos >= honneys[i].x)
			&& (xPos + vinny.width <= honneys[i].x + honney.width || xPos <= honneys[i].x + honney.width)
			&& (yPos + vinny.height >= honneys[i].y || yPos >= honneys[i].y)
			&& (yPos + vinny.height <= honneys[i].y + honney.height || yPos <= honneys[i].y + honney.height)) {
			honneys.pop();
			score += 10;
	 		score_audio.play();
		}

	 }

	 for(let i = 0; i < trees.length; i++) {
		 ctx.drawImage(treeTop, trees[i].x, trees[i].y);
		 ctx.drawImage(treeBottom, trees[i].x, trees[i].y + treeTop.height + trees[i].gap);

		 if (trees[i].x === (xPos - 100)) {
		 	newTrees();
		 	newBee();
		 	newHonney();
	 	}


		if (trees[i].x === xPos) {
		 	score++;
	 		score_audio.play();
	 	}

		if (xPos + vinny.width >= trees[i].x
			&& xPos <= trees[i].x + treeTop.width
			&& (yPos <= trees[i].y + treeTop.height
			|| yPos + vinny.height >= trees[i].y + treeTop.height + trees[i].gap) 
			|| yPos + vinny.height >= cvs.height) {
			 	
			timeOut = true;
			updateHightScore(score);
			boom.play();

			setTimeout(
				function() {
					score = 0;
					timeOut = false;
					xPos = 300;
					yPos = 240;
					trees = [];
					bees = [];
					honneys = [];
					newTrees();
					draw();
				} , 
				3000
			);
		}

		trees[i].x--;

	}

	//Phisics
	ctx.drawImage(vinny, xPos, yPos);
	yPos += grav;
	
	//Scores
	ctx.fillStyle = "Red";
	ctx.font = "24px Verdana";
	ctx.fillText("Score: " + score, 20, cvs.height - 20);

	if (timeOut !== true) {
		requestAnimationFrame(draw);
	}
	
}

function updateHightScore(score) {
	if (hightScores.innerHTML < score) hightScores.innerHTML = score;
}

newTrees();
document.addEventListener("keydown", moveUp);
treeBottom.onload = draw;