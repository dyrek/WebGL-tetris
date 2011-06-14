
    $(document).ready(function(){
               
        getAction();
         
    });
    
    function getAction(){
        $.ajax({
            url: 'action.php',
            type: 'post',
            data: 'action=true',
            success: function(msg){
                $('div#result > p').html(msg);
                getAction();
            }
        });
    }