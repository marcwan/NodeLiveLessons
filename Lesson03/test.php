<?php


$f = fopen('test.txt', 'r');

$contents = fread($f, 100000);

echo $contents;

fclose($f);

