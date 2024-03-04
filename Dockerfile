FROM cypress/base:18.16.0
# to create a working directory.. directory is named app
RUN mkdir /app 
# to set this app as the working directory
WORKDIR /app 

#COPY source dest  // copy all files from the project into the container
# source is sort of empty.. we need to put the files we shall be working with

#COPY source dest 
COPY . /app
# . ==> represents the root folder
# /app ==> destination is the app folder

# since we don't want node modules which will be generated during the npm install command
# create .dockerignore file
# now during copying process, all files will be copied except node modules

RUN npm install cypress@latest
RUN npm install --force
# RUN $(npm bin)/cypress verify
RUN ["npx", "cypress", "verify"]
RUN ["npm", "run", "cypress:complete"]
