echo ""
printf "\n-> Removing simplewebchat container if exists\n"
docker kill simplewebchat &>/dev/null
docker rm simplewebchat &>/dev/null
printf "\n-> Starting new container called "simplewebchat"\n"
docker run -d --rm --name simplewebchat -p 0.0.0.0:90:3000 webonize/simplewebchat
echo ""