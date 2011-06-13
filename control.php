<?php

    include("core.php");
    
    if(isset($_POST['control']) && !empty($_POST['control']))
    {
        connectToDB();
        $sql = "UPDATE command SET text='" . $_POST['control'] . "' WHERE id = 1";
        mysql_query($sql);
        exit();
    }
    
    include("control.tpl");

?>