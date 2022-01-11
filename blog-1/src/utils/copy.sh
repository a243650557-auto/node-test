#!/bin/sh
cd /Users/linxiaoling/Desktop/node-test/blog-1
cp ./logs/access.log  ./logs/$(date +%y-%m-%d-%H).access.log
echo "" > ./logs/access.log