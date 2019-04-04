#!/bin/bash
#Build.sh
echo ""
printf "\n-> Pulling dependencies\n"
docker pull node:10
echo ""
printf "\n-> Building aljaxus/zeyra docker image\n"
docker build -t webonize/simplewebchat .
echo ""
printf "\nSuccessfully built the docker image\n"
read -p "Press any key to run the container - press ctrl+c to exit the script `echo $'\n '`"
echo ""
./start.sh