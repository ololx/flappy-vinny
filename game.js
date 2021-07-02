/**
 * The type Score.
 *
 * @author Alexander A. Kropotin
 * @project flappy-vinny
 * @created 04.01.2020 15:40
 */ 
class Score {

	static ofInitialZero() {
		return new Score(0);
	}

	static of(initialValue) {
		return new Score(initialValue);
	}

	_value = 0;

	constructor(initialValue) {
		if (initialValue == null) console.error(`The value couldn't be ${initialValue}`);
		else if (!Number.isInteger(initialValue)) console.error(`The value must be an integer`);

		this._value = initialValue;
	}

	get value() {
		return this._value;
	}

	set value(value) {
		this._value = value;
	}

	increase() {
		this.increase(1);
	}

	increase(value) {
		this._value += value;
	}

	decrease() {
		this.decrease(1);
	}

	decrease(value) {
		this._value -= value;
	}

	reset() {
		this._value = 0;
	}
}

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
let score = Score.ofInitialZero();
let timeOut = false;

// Vinny Positions
let xPos = 300;
let yPos = 240;
let speed = 1.5;

//Sounds effects
let boom = new Audio();
let scoreAudio = new Audio();

boom.src = "audio/game-over.wav";
scoreAudio.src = "audio/score.mp3";

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
		x : Math.floor(Math.random() * (cvs.width - (cvs.width * 0.75))) + (cvs.width  * 0.75),
		y : Math.floor(Math.random() * ((cvs.height - honney.height) - (honney.height * 0.1))) + (honney.height * 0.1),
	});
}

function newBee() {
	bees.push({
		x : Math.floor(Math.random() * ((cvs.width * 0.1) - 0)) + 0,
		y : Math.floor(Math.random() * (cvs.height - 0)) + 0,
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
	ctx.fillStyle = "Red";
	ctx.font = "24px Verdana";

	 //FIXME: add random Gap
	 for(let i = 0; i < bees.length; i++) {
	 	ctx.drawImage(bee, bees[i].x, bees[i].y);

		bees[i].x += Math.floor(speed + (3 * (score.value / 100))) * (Math.random() * (2  -  1) + 1);
		bees[i].y = (Math.random() * (cvs.width  -  1) + 1) <= cvs.width * 0.5 ? bees[i].y + (speed * 3) : bees[i].y - (speed * 3);

		if ((xPos + vinny.width >= bees[i].x || xPos >= bees[i].x)
			&& (xPos + vinny.width <= bees[i].x + bee.width || xPos <= bees[i].x + bee.width)
			&& (yPos + vinny.height >= bees[i].y || yPos >= bees[i].y)
			&& (yPos + vinny.height <= bees[i].y + bee.height || yPos <= bees[i].y + bee.height)) {
			bees.pop();
	 		boom.play();
			score.decrease(10);
			
			if (score.value < 0) {
				timeOut = true;
				setTimeout(
					function() {
						score.reset();
						timeOut = false;
						xPos = 300;
						yPos = 240;
						speed = 1.5;
						trees = [];
						bees = [];
						honneys = [];
						newTrees();
						draw();
						} , 
					3000
				);
			}
		}

	 }

	 for(let i = 0; i < honneys.length; i++) {
	 	ctx.drawImage(honney, honneys[i].x, honneys[i].y);
	 	honneys[i].x -= Math.floor(speed + (0.5 * (score.value / 100)));

		if ((xPos + vinny.width >= honneys[i].x || xPos >= honneys[i].x)
			&& (xPos + vinny.width <= honneys[i].x + honney.width || xPos <= honneys[i].x + honney.width)
			&& (yPos + vinny.height >= honneys[i].y || yPos >= honneys[i].y)
			&& (yPos + vinny.height <= honneys[i].y + honney.height || yPos <= honneys[i].y + honney.height)) {
			honneys.pop();
			score.increase(10);
	 		scoreAudio.play();
		}

	 }

	 for (let i = 0; i < trees.length; i++) {
		 ctx.drawImage(treeTop, trees[i].x, trees[i].y);
		 ctx.drawImage(treeBottom, trees[i].x, trees[i].y + treeTop.height + trees[i].gap);

		if (trees[i].x === (xPos - 100)) {
		 	newTrees();
		 	newBee();
	 	}

		if (trees[i].x === xPos) {
		 	score.increase(1);
	 		scoreAudio.play();
			newHonney();
	 	}

		if (xPos + vinny.width >= trees[i].x
			&& xPos <= trees[i].x + treeTop.width
			&& (yPos <= trees[i].y + treeTop.height
			|| yPos + vinny.height >= trees[i].y + treeTop.height + trees[i].gap) 
			|| yPos + vinny.height >= cvs.height) {
			 	
			timeOut = true;
			updateHightScore(score.value);
			boom.play();

			setTimeout(
				function() {
					score.reset();
					timeOut = false;
					xPos = 300;
					yPos = 240;
					speed = 1.5;
					trees = [];
					bees = [];
					honneys = [];
					newTrees();
					draw();
				} , 
				3000
			);
		}

		trees[i].x -= Math.floor(speed + (0.5 * (score.value / 100)));

	}

	//Phisics
	ctx.drawImage(vinny, xPos, yPos);
	yPos += speed + (0.3 * (score.value / 100));
	
	//Scores
	ctx.fillText(`Score: ${score.value}`, 20, cvs.height - 20);

	if (timeOut !== true) {
		requestAnimationFrame(draw);
	}
	
}

function updateHightScore(score) {
	if (hightScores.innerHTML < score) hightScores.innerHTML = score;
}

newTrees();
document.addEventListener("keydown", moveUp);
document.addEventListener("click", moveUp);
treeBottom.onload = draw;