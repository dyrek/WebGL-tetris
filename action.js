
    $(document).ready(function(){
               
        getAction();
         
    });
    
    function getAction(){
        $.ajax({
            url: 'action.php',
            type: 'post',
            data: 'action=true',
            success: function(msg){
                switch (msg) {
			case 'up':
				engine.rotatePiece();
				break;
			case 'down':
				engine.moveDown();
				break;
			case 'left':
				engine.moveLeft();
				break;
			case 'right':
				engine.moveRight();
				break;
	};
                getAction();
            }
        });
    }
