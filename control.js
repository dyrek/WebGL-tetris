
    $(document).ready(function(){
        
        $('div.button').each(function(){
            $(this).click(function(){
                $.ajax({
                url: 'control.php',
                type: 'post',
                data: 'control=' + $(this).attr('title')
            });
            });
        });
         
    });