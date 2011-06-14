<?php

    include("core.php");
    
    if(isset($_POST['action']) && !empty($_POST['action']))
    {
        connectToDB();
        $stop = false;
        $time = time();
        while(1)
        {
            if(time() - $time > 50)
                break;
            $sql = "SELECT text FROM command WHERE id = 1";
            $result = mysql_query($sql);
            while($array = mysql_fetch_array($result))
            {
                if($array['text'] != "")
                {
                    print $array['text'];
                    $stop = true;
                }
            }
            if($stop)
            {
                $sql = "UPDATE command SET text='' WHERE id = 1";
                mysql_query($sql);
                break;
            }
        }
        exit();
    }
    
    include("action.tpl");

?>