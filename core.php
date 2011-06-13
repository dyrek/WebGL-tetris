<?php

    function connectToDB()
    {
        $conn = mysql_connect("", "", "");
        mysql_select_db("", $conn);
    }

?>