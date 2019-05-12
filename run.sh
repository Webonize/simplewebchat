#!/bin/bash
#Run.sh
while [ ${#} -gt 0 ];do OPTERR=0;OPTIND=1;getopts "hdr" arg;case "$arg" in
  h) help=true
  ;;
  d) dev=true
  ;;
  r) rebuild=true
  ;;
  \?) SET+=("$1")
  ;;
  *) printf "\n./run.sh <name> [ -h | [ -r [-d ] ] ]\n\n">&2
  ;;
esac;shift;[ "" != "$OPTARG" ] && shift;done
[ ${#SET[@]} -gt 0 ] && set "" "${SET[@]}" && shift



printf "\n\n"

if [[ ! -z "$help" ]]; then
  printf "=-=-= Run.sh help page\n\n"
  printf "./run.sh <name> [ -h | [ -r [-d ] ] ]\n\n"
  printf "<name> is the optional container name"
  printf " -d   Development mode. Starts the server with auto-restart on file change.\n"
  printf "      Production mode. Starts the server without auto-restart on file change.\n      Default mode if -d is not provided.\n"
  printf " -r   Rebuild. Rebuilds the container from current source code and starts the container up."
  printf " -h   Shows this help menu\n"
  printf "\n\n"
  exit
fi

if [[ ! -z "$rebuild" ]]; then
  printf "\n=-= REBUILD MODE\n"
  echo "- Stopping container"
  docker container stop simplewebchat
  echo "- Removing container"
  docker container rm simplewebchat
  echo "- Building the image"
  docker build --tag simplewebchat .

  echo "- Creating a new container"
  docker container create --name simplewebchat --restart always --publish 3000:3000 simplewebchat
  if [[ ! -z "$dev" ]]; then
    echo "- Starting the container in development mode"
    docker container start simplewebchat "npm run dev"
  else 
    echo "- Starting the container in production mode"
    docker container start simplewebchat "npm start"
  fi
  echo "- Attaching to container console"
  docker container logs -f simplewebchat
else 
  printf "\n=-= RESUME MODE\n"
  echo "- Stopping container"
  docker container stop simplewebchat
  echo "- Starting container"
  docker container start simplewebchat
  echo "- Attaching to container console"
  docker container logs -f simplewebchat
fi