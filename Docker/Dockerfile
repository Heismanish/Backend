# Base image
FROM node:14

# Define work directory in the container
WORKDIR /usr/src/app 

COPY package*.json ./
COPY tsconfig.json ./
RUN npm install

# Copy everything from the dir where dockerfile is to the work directory(WORKDIR)
COPY . .

# Install node_modules and then compile to js.
RUN npm run build

# start the project 
CMD ["npm", "start"]

# expose the ports in the container
EXPOSE 3000
