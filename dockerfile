### Initialisation
#Define the base image - using node v.10, official docker image
FROM node:10
#Define the maintainer of this image
LABEL maintainer="me@aljaxus.eu"
#Define the working directory (on final container)
WORKDIR /var/chatserver
#Set the default registry for NPM
RUN npm config set registry http://registry.npmjs.org/

### Build process
# Copy the package.json, package-lock.json from host machine to build container
COPY package*.json ./
# Install all dependencies on the build container
RUN npm install
### Post build process
#Copy all the files from the build container to final container
COPY . .

#Open the 8100 port on the final container for the docker network interface (not public port)
#This is only accessable from the host device
EXPOSE 3000
#Start the server in the container
CMD [ "npm", "start" ]