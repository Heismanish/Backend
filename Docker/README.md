# Docker

Docker is a container runtime that allows developers to build, deploy, and test containerized applications on various platforms.

## 1. Containers:
A container is a lightweight, standalone, executable package that includes everything needed to run a piece of software, including the code, a runtime, libraries, environment variables, and dependencies.

- Containerization involves building self-sufficient software packages that perform consistently, regardless of the machines they run on.

- It basically takes a snapshot of a machine, the filesystem, and lets you use and deploy it as a construct.

### Advantages:
- **Isolation:** Containers isolate applications from each other and from the underlying system.
- **Portability:** Containers can run on any machine that supports the container platform.
- **Resource Efficiency:** They share the host system's OS kernel, using fewer resources than virtual machines.

## Docker has 3 parts:
- **Docker Engine:** Runs Docker locally on your machine.
- **CLI:** Used to interact with the Docker Engine.
- **Docker Hub:** Container registry, similar to GitHub for images. Images can be directly pulled from Docker Hub by EC2 instances and other platforms.

## Image vs Containers:

- **Image:** A Docker image behaves like a template from which consistent containers can be created. It defines the initial filesystem state of the new containers. Images bundle your application's source code and its dependencies into a self-contained package that's ready to use with a container runtime. Within the image, filesystem content is represented as multiple independent layers.
  
- **Containers:** Images in execution are called containers.

### How to describe your container?
**Answer:** Dockerfile

## Dockerfile
It's a file that describes your image.

1. Start from a base image (ubuntu/alpine/node).
2. Add all the software to install.
3. Copy over the files you want present in the container (your frontend and backend code).
4. Build the project (npm install, npm run dev, npm run build, and more...).
5. Expose the right set of ports.
6. Start your process.

## How to run?

1. **Build the image:**
   ```shell
   docker build -t <your_image_tag> .
   ```

2. **Running the image:**
   ```shell
   docker run <your_image_tag>
   ```

   Example: Mapping port 3000 of the container to port 3001 of the host:
   ```shell
   docker run -p 3001:3000 express-app-1
   ```

## Docker Commands:

1. **To see all the containers:**
   ```shell 
   docker ps
   ```

2. **To go inside the container (similar to ssh inside a server on AWS) or run a command inside the container:**
   ```shell
   docker exec -it <container_id> /bin/bash
   ```
   
3. **To kill a Docker container:**
   ```shell
   docker kill <container_id>
   ```

## Question: Why not copy dist and node_modules rather than building and installing it inside the container? Why fresh npm install and npm run build?
**Answer:**
1. **Environment-specific binaries:** Build might be different for different OS; hence, to avoid conflicts with the OS, we do this.
2. Can run `npm install --omit=dev` to only have production dependencies, reducing the size of deployment packages.
3. Layer Optimization.

## Layers in Docker
Layers are the result of how Docker images are built. Each step in a Dockerfile creates a new "layer" that's essentially a diff of the filesystem changes since the last step.

Building Docker images is a very heavy (time-consuming) process, so Docker caches the layers. Layers are created so that Docker can cache them and save a lot of build time. Docker caches the layers and during the subsequent builds, it uses them and rebuilds only the lines/layers which have changed.

Example:
```shell
docker build -t express-app-4 .
```

The build time has been significantly reduced because Docker uses cached layers until `CACHED [5/7] RUN npm install` because until that point, there was no change from the previous build, and only after that where there was a change found, Docker rebuilt it.

## How to use external libraries?
Here is an example showing how to use the MongoDB image to run MongoDB in Docker:

```shell
docker run -d -p 27017:27017 mongo
```

- `-d` here is for detached mode, allowing the process to run in the background. This helps run multiple containers simultaneously.

Example of running 2 instances of MongoDB locally on the host machine:

```shell
docker run -d -p 27017:27017 mongo
docker run -d -p 27018:27017 mongo
```

## Docker in the Real World
- For deployment (backends).
- Environment variables.
- For monorepos.
- When you have multiple applications (frontend/backend).
- Docker Compose.

## Publishing an Image to Docker Hub

**Note:** Make sure to keep the name of the local image the same as the name of the repository where you are pushing your image.

```shell
docker login -u <your_dockerhub_username>
docker build -t <your_dockerhub_username>/<your_repository_name> .
docker push <your_dockerhub_username>/<your_repository_name>
```

## To Pull and Run a Docker Image from Docker Hub

```shell
docker run -p 3001:3000 <your_dockerhub_username>/<your_repository_name>
```

## Dockerfile in Monorepos (Multiple Frontends and Backends)

- Create a docker folder in the root directory.
- Create respective directories for all the backends that exist in your monorepo.
- In their Dockerfiles, provide the base image, define the working directory, then copy all the common packages that are shared between them.

Example:
```shell
COPY ["packages/common", "./packages/common"]
```

[Reference](https://github.com/coral-xyz/backpack/blob/master/docker/backpack-api/Dockerfile)

- Note that before we start building these Docker images, we move these Dockerfiles to the root directory. Whenever a new change/commit is made, this is done in the GitHub workflows, and that's how all the files are reached and executed.

# Environment Variables

- Variables/values that influence the way an app behaves.
- For developers, they offer a mechanism to store secrets, credentials, or general settings without hardcoding them into the source code.
- Standard practice to use env variables is to use .env files to keep all the environment variables.

Alternatively, you can create environment variables by exporting a variable in the directory:

```shell
export MONGO_URL=123
node index.js
```

### Adding Environment Variables from Your Dockerfile

```shell
ENV MONGO_URL=123
```

# Docker Compose

Docker Compose is a tool for defining and managing multi-container Docker applications.

It allows you to define an entire application stack, including the services, networks, and volumes, in a single `docker-compose.yml` file.

## Volumes in Docker

Volumes in Docker are a way to persist data generated by and used by Docker containers. Volumes can be mounted from the host system or created as Docker-managed volumes.

Example:

```shell
docker volume create volume1
docker run -v volume1:/

data/db -p 27017:27017 mongo
```

MongoDB stores all the data in the `/data/db` directory.

## Networks

Networking is a fundamental part of Docker containers, allowing them to communicate with each other and the outside world.

Steps:

1. Create a custom network:

```shell
docker network create my_custom_network
```

2. Run a container in the created network:

```shell
docker run --name webserver --network my_custom_network -d nginx
```

3. Run another container in the same network and test connectivity:

```shell
docker run --name testbox --network my_custom_network -it busybox sh
ping webserver
```

In summary, Docker Compose simplifies the management and deployment of interconnected services. It automatically creates a named bridge network for your composition, allowing for automatic service discovery using service names as DNS. This enables services to communicate with each other seamlessly.
