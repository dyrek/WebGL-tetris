/**
 * @authors:
 * Michal Ciebiada
 * Filip Kufrej
 */

pieces = [
        [ 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0 ],
		[ 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0 ],
		[ 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0 ],
		[ 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0 ],
		[ 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0 ],
		[ 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0 ],
		[ 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0 ] ];

function Engine() {
	this.width = 10;	// width of the board (in squares)
	this.height = 20;	// height of the board
	this.board = [];	// fallen pieces (accessing: y * width + x)
	
	this.piece = [];	// 4*4 array of the current piece (acessing: y * 4 + x)
	this.pieceX;		// coordinates of the current piece
	this.pieceY;
	this.pieceRotMode;	// rotation mode - pieces usually rotate in
						// counterclockwise
						// direction, but the game is inconsistent in the way
						// that "I" piece
						// rotates first counterclockwise and then clockwise,
						// and "O" piece doesn't rotate at all
	this.nextPiece = Math.random();
	
	this.instantDrop = false;
	this.freeFall = 0;
	
	this.paused = false;			
	this.gameOver = false;
	
	this.score = 0;
	this.level = 1;
	this.linesCompleted = 0;
	
	this.delay = 500;
	
	for (var i = 0; i < this.width * this.height; i++) {
		this.board[i] = 0;
	}
	
	this.pause = function() {
		this.paused = true;
	};

	this.resume = function() {
		if (this.gameOver)
			return;

		if (this.paused) {
			this.paused = false;
			this.start();
		}
	};

	this.isGameOver = function() {
		return this.gameOver;
	};
	
	this.getWidth = function() {
		return this.width;
	};
	
	this.getHeight = function() {
		return this.height;
	};
	
	this.getPieceX = function() {
		return this.pieceX - 2;
	};
	
	this.getPieceY = function() {
		return this.pieceY - 1;
	};

	this.getScore = function() {
		return this.score;
	};
	
	this.getLevel = function() {
		return this.level;
	};
	
	this.getLinesCompleted = function() {
		return this.linesCompleted;
	};
	
	this.getBoard = function(x, y) {
		return this.board[y * this.width + x];
	};

	this.getPiece = function(x, y) {
		return this.piece[y * 4 + x];
	};
	
	this.getNextPiece = function(x, y) {
		return pieces[Math.floor(this.nextPiece * 7)][y * 4 + x];
	};

	this.newPiece = function() {
		this.instantDrop = false;
		
		this.pieceX = 5;
		this.pieceY = 0;
		
		this.pieceRotMode = 1;
		
		var r = this.nextPiece;
		this.nextPiece = Math.random();
		
		if (r < 1 / 7) {
			this.pieceRotMode = 0;
			this.piece = pieces[0];
		} else if (r < 2 / 7) {
			this.pieceRotMode = 2;
			this.piece = pieces[1];
		} else if (r < 3 / 7) {
			this.piece = pieces[2];
		}  else if (r < 4 / 7) {
			this.piece = pieces[3];
		} else if (r < 5 / 7) {
			this.piece = pieces[4];
		} else if (r < 6 / 7) {
			this.piece = pieces[5];
		} else {
			this.piece = pieces[6];
		}
		
	};

	this.rotatePiece = function() {
		if (this.paused)
			return;
		
		if (this.pieceRotMode == 0)
			return;
		
		var rotated = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
		
		if (this.pieceRotMode == 3) {	// rotate clockwise
			this.pieceRotMode = 2;		// but just this time
			
			for (var x = 0; x < 4; x++) {
				for (var y = 0; y < 4; y++) {
					var tx = x - 2;
					var ty = y - 1;
					var rx = -ty;
					var ry = tx;
					rotated[(ry + 1) * 4 + rx + 2] = this.piece[y * 4 + x];
				}
			}
			
		} else if (this.pieceRotMode > 0) {	// rotate counterclockwise
			if (this.pieceRotMode == 2)	// if in I rotation mode 
				this.pieceRotMode = 3;	// next rotation is clockwise
			
			for (var x = 0; x < 4; x++) {
				for (var y = 0; y < 4; y++) {
					var tx = x - 2;
					var ty = y - 1;
					var rx = ty;
					var ry = -tx;
					rotated[(ry + 1) * 4 + rx + 2] = this.piece[y * 4 + x];
				}
			}
		}
		
		var willCollide = false;
		
		loops:
		for (var x = 0; x < 4; x++) {
			for (var y = 0; y < 4; y++) {
				if (this.getPieceX() + x >= this.width || this.getPieceX() + x < 0) {
					var boardPiece = 1; 
				} else {
					var boardPiece = this.board[(this.getPieceY() + y) * this.width + (this.getPieceX() + x)];
				}
				
				if (rotated[y * 4 + x] +  boardPiece > 1) {
					willCollide = true;
					break loops;
				}
			}
		}
		if (!willCollide) {
			this.piece = rotated
		}
	}
	
	this.work = function() {
		if (this.paused)
			return;

		var willCollide = false;
		
		loops:
		for (var x = 0; x < 4; x++) {
			for (var y = 0; y < 4; y++) {
				if (this.getPieceY() + y + 1 > 19) {
					var boardPiece = 1;
				} else {
					var boardPiece = this.board[(this.getPieceY() + y + 1) * this.width + (this.getPieceX() + x)];
				}
				
				if (this.piece[y * 4 + x] +  boardPiece > 1) {
					willCollide = true;
					break loops;
				}
			}
		}
		
		if (!willCollide) {
			this.pieceY++;
		} else {
			if (this.getPieceY() == -1) {
				this.paused = true;
				this.gameOver = true;
				return false;
			}
			
			for (var x = 0; x < 4; x++) {
				for (var y = 0; y < 4; y++) {
					this.board[(this.getPieceY() + y) * this.width + (this.getPieceX() + x)] += this.piece[y * 4 + x];
				}
			}
			
			// scoring 
			var freeFall = this.instantDrop ? this.freeFall : this.getPieceY();
			this.score += ((21 + (3 * this.level)) - (freeFall + 1));
			
			for (var y = this.getPieceY(); y < this.getPieceY() + 4; y++) {
				if (y >= this.height)
					break;
				
				var sum = 0;
				for (var x = 0; x < this.width; x++) {
					sum += this.board[y * this.width + x];
				}
				
				if (sum == this.width) {	// got line completed
					this.linesCompleted++;
					
					if (this.linesCompleted >= 1 && this.linesCompleted <= 90) {
						this.level = Math.round(1 + ((this.linesCompleted - 1) / 10));
					} else if (this.linesCompleted >= 91) {
						this.level = 10;
					}
					
					this.delay = ((11 - this.level) * 50.0);
					
					// clearing line
					for (var x = 0; x < this.width; x++) {
						this.board[y * this.width + x] = 0;
					}
					
					// moving things down
					for (var y1 = y; y1 > 0; y1--) {
						for (var x = 0; x < this.width; x++) {
							this.board[y1 * this.width + x] = this.board[(y1 - 1) * this.width + x];
						}
					}
				}
			}
			
			this.newPiece();
		}
		
		return willCollide;
	}
	
	this.start = function() {
		var self = this;
		if (!this.paused) {
			setTimeout(function() {
				self.work();
				self.start();
			}, this.delay);
		}
	};

	this.moveLeft = function() {
		if (this.paused)
			return;
		
		var willCollide = false;
		
		loops:
		for (var x = 0; x < 4; x++) {
			for (var y = 0; y < 4; y++) {
				if (this.getPieceX() + x - 1 < 0) {
					var boardPiece = 1;
				} else {
					var boardPiece = this.board[(this.getPieceY() + y) * this.width + (this.getPieceX() + x - 1)];
				}
				
				if (this.piece[y * 4 + x] +  boardPiece > 1) {
					willCollide = true;
					break loops;
				}
			}
		}
		
		if (!willCollide) {
			this.pieceX--;
		}
	};

	this.moveRight = function() {
		if (this.paused)
			return;
		
		var willCollide = false;
		
		loops:
		for (var x = 0; x < 4; x++) {
			for (var y = 0; y < 4; y++) {
				if (this.getPieceX() + x + 1 >= this.width) {
					var boardPiece = 1;
				} else {
					var boardPiece = this.board[(this.getPieceY() + y) * this.width + (this.getPieceX() + x + 1)];
				}
				
				if (this.piece[y * 4 + x] +  boardPiece > 1) {
					willCollide = true;
					break loops;
				}
			}
		}
		
		if (!willCollide) {
			this.pieceX++;
		}
	};
	
	this.moveDown = function() {
		if (this.paused)
			return;
		
		this.instantDrop = true;
		this.freeFall = this.getPieceY();
		
		while (!this.work() && !this.paused);
	}

	this.newPiece();
}
