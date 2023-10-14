# Docker

Docker is a container runtime that allows devs to build, deploy and test containerized applications on various platforms.


## 1. Containers:
A container is a lightweight, standalone, executable package that includes everything needed to run a piece of software, including the code, a runtime, libraries, environment variables, and dependencies.

- Containerization involves building self-sufficient software packages that perform consistently, regardless of the machines they run on.

- It basically takes a snapshot of a machine, the filesystem and letting you use and deploy it as a construct.

### Advantages:
- Isolation: Containers isolate applications from each other and from the underlying system.
- Portability: Containers can run on any machine that supports the container platform.
- Resource Efficiency: They share the host system's OS kernel, using fewer resources than virtual machines.

## Docker has 3 parts
- Docker Engine (we run docker engine locally)
- CLI (we use this to interact with docker engine)
- Docker Hub (container registry: just like github for images, images can directly be pulled from docker hub by ec2 instances)


## Image vs Containers:

- Image:  A docker image bahaves like a template from which consistent containers can be created. 
Example: If Docker was a traditional VM, the image could be linke dto the ISO used to install the you VM.

Image defines the inital filesystem state of the new containers. They bundle you application's source code and its dependencies into a self contained package that's ready to use with a container runtime. Withtin the image, filesystem content is represented as mulitple independent layers.

- Containers: Images in execution are called containers.


### How to describe your container?
Ans: Dockerfile

## Dockerfile
It's a file that describes your image.

1. Start from a base image (ubuntu/alpine/node)
2. Add all the softwares to install
3. Copy over the files you want present in the container(your frntend and backedn code )
4. Build the project (npm install, npm run dev, npm run build, and more...)
5. Expose the right set of ports.
6. Start your process.

## How to run?

1. Build the image
```shell
docker build -t<your_image_tag>
```

2. Running the image
``` shell
docker run <your_image_tag>
```

Example:
Here it says that, all requests on port 3000 of the container will be mapped to port 3001 of our host. That is, any request in port 3001 in our host will be mapped to port 3000 of our container. It also known as 'port mapping'.

``` shell
docker run -p 3001:3000  express-app-1
```

## Docker Commands:

1. To see all the containers
```shell 
manishkumargupta@Manishs-MacBook-Air ~ % docker ps
CONTAINER ID   IMAGE           COMMAND                  CREATED          STATUS          PORTS                    NAMES
a68009e91676   express-app-1   "docker-entrypoint.s…"   10 minutes ago   Up 10 minutes   0.0.0.0:3001->3000/tcp   nervous_khayyam
```
2. To go inside the container (similar to ssh inside a server on aws) or run a command inside the container.
```shell
manishkumargupta@Manishs-MacBook-Air ~ % docker exec -it a68009e91676 /bin/bash
root@a68009e91676:/usr/src/app# ls
Docker.md  Dockerfile  README.md  dist	node_modules  package-lock.json  package.json  src  tsconfig.json
```

3. To kill a docker 
```shell
docker kill <container_id>
```
example:
```shell
manishkumargupta@Manishs-MacBook-Air ~ % docker kill a68009e91676
a68009e91676
```

## Question: Why not copy dist and node_modules rather than building and installing it inside the container? Why fresh npm install and npm run build?
## Ans: 
1. Environment specific binaries, build might be different for different os hence in order to avoid conflicts with os we do so.
2. Can run 
```shell 
npm run install --omit=dev
```
to only have production dependencies, which help reduce the size of deployment pacakges.
3. Layer Optimization.

## Layers in Docker

Layers are result of the way Docker images are built. Each step in a docker file creates a new "layer" that's essentially a diff of the filesystem changes since the last step.


Building docker images is a very heavy(time-consuming) process so docker caches the layers.
Layers are created so that we can cache them and save a lot of build time. Docker caches the layers and during the subseqent builds it uses uses them and rebuilds only the lines/layers which has been changed.

- HENCE, we can optimise our dockerfile by using this concept and writing it in such a way that files that doesn't change that often and are cached can be used optimally.


### Let's look at an example:
Here build time has been significantly reduced because docker uses cached layers till ` CACHED [5/7] RUN npm install ` coz till that there was no change from the previous build and only after that where there was a change found docker rebuild it.

```shell
manishkumargupta@Manishs-MacBook-Air Docker % docker build -t express-app-4 .
[+] Building 3.2s (12/12) FINISHED docker:desktop-linux[internal] load .dockerignore             0.0s
 => [internal] load .dockerignore             0.0s
 => => transferring context: 94B              0.0s
 => [internal] load build definition from Do  0.0s
 => => transferring dockerfile: 477B          0.0s
 => [internal] load metadata for docker.io/l  1.9s
 => [1/7] FROM docker.io/library/node:14@sha  0.0s
 => [internal] load build context             0.0s
 => => transferring context: 793B             0.0s
 => CACHED [2/7] WORKDIR /usr/src/app         0.0s
 => CACHED [3/7] COPY package*.json ./        0.0s
 => CACHED [4/7] COPY tsconfig.json ./        0.0s
 => CACHED [5/7] RUN npm install              0.0s
 => [6/7] COPY . .                            0.0s
 => [7/7] RUN npm run build                   1.2s
 => exporting to image                        0.0s
 => => exporting layers                       0.0s
 => => writing image sha256:b04696b7230d392c  0.0s
 => => naming to docker.io/library/express-a  0.0s
```

## How to use external libraries?
Let's see how we can use containers other people have created from dockerhub.
Here is an example showing how we can use mongo image to mongodb in docker.

```shell
docker run -d -p 27017:27017 mongo
```

- `-d` here is for detached mode, that is, we can run the process in backround. This helps you actally run multiple containers.
Example: Here we have 2 instances of mongodb running locally in our host machine.
```shell
manishkumargupta@Manishs-MacBook-Air Docker % docker run -d -p 27017:27017 mongo

Unable to find image 'mongo:latest' locally
latest: Pulling from library/mongo
895d322e8e59: Pull complete 
53942a81bbed: Pull complete 
6c77c1ea6f8e: Pull complete 
9269ffa19aee: Pull complete 
1ae10bad0105: Pull complete 
208482253dd3: Pull complete 
0beb4a4f2118: Pull complete 
26ec439e9d10: Pull complete 
6ec0210a426e: Pull complete 
Digest: sha256:d341a86584b96eb665345a8f5b35fba8695ee1d0618fd012ec4696223a3d6c62
Status: Downloaded newer image for mongo:latest
1b995f3901feeb606283b3e1bc966ccd0892f02af7df4c4ca58e58b29ff57416
manishkumargupta@Manishs-MacBook-Air Docker % docker run -d -p 27018:27017 mongo

56133c1e72a5f73e5ba42fd66759e0fd818a503524dba5bb35d20dae25cd84dd
```

# Docker in real world
- For deployment (backends)
- env variables
- For monorepos
- You have multiple applications(frontend/backend)
- docker-compose

## Publishing a image to dockerhub

NOTE: Make sure to keep the name of the localimage same as the name of the repository where you are pushing you image.

```shell
manishkumargupta@Manishs-MacBook-Air ~ % docker login -u heismanish
Password: 
Login Succeeded
manishkumargupta@Manishs-MacBook-Air ~ % cd Developer 
manishkumargupta@Manishs-MacBook-Air Developer % cd Docker 
manishkumargupta@Manishs-MacBook-Air Docker % ls
Docker.md		README.md		node_modules		package.json		tsconfig.json
Dockerfile		dist			package-lock.json	src
manishkumargupta@Manishs-MacBook-Air Docker % docker build -t heismanish/trialexpress .
[+] Building 5.7s (13/13) FINISHED                                                                     docker:desktop-linux
 => [internal] load build definition from Dockerfile                                                                   0.0s
 => => transferring dockerfile: 477B                                                                                   0.0s
 => [internal] load .dockerignore                                                                                      0.0s
 => => transferring context: 94B                                                                                       0.0s
 => [internal] load metadata for docker.io/library/node:14                                                             4.3s
 => [auth] library/node:pull token for registry-1.docker.io                                                            0.0s
 => [1/7] FROM docker.io/library/node:14@sha256:a158d3b9b4e3fa813fa6c8c590b8f0a860e015ad4e59bbce5744d2f6fd8461aa       0.0s
 => [internal] load build context                                                                                      0.0s
 => => transferring context: 8.04kB                                                                                    0.0s
 => CACHED [2/7] WORKDIR /usr/src/app                                                                                  0.0s
 => CACHED [3/7] COPY package*.json ./                                                                                 0.0s
 => CACHED [4/7] COPY tsconfig.json ./                                                                                 0.0s
 => CACHED [5/7] RUN npm install                                                                                       0.0s
 => [6/7] COPY . .                                                                                                     0.0s
 => [7/7] RUN npm run build                                                                                            1.3s
 => exporting to image                                                                                                 0.0s
 => => exporting layers                                                                                                0.0s
 => => writing image sha256:92c9f255bddeb263d6390f59a1ac2917570ddd1499940b61f03b96bb30a9f7cc                           0.0s
 => => naming to docker.io/heismanish/trialexpress                                                                     0.0s

What's Next?
  View a summary of image vulnerabilities and recommendations → docker scout quickview
manishkumargupta@Manishs-MacBook-Air Docker % docker push
"docker push" requires exactly 1 argument.
See 'docker push --help'.

Usage:  docker push [OPTIONS] NAME[:TAG]

Upload an image to a registry
manishkumargupta@Manishs-MacBook-Air Docker % docker push heismanish/trialexpress

Using default tag: latest
The push refers to repository [docker.io/heismanish/trialexpress]
a9b04f6c0a5c: Pushed 
a212ee80d67f: Pushed 
4a1e4e0341c5: Pushed 
02755700ecba: Pushed 
5b59fba898ab: Pushed 
12c18f35fbbe: Pushed 
4d772e48367e: Mounted from library/node 
b078da4dfde3: Mounted from library/node 
20649f23472c: Mounted from library/node 
476197c298e4: Mounted from library/node 
708291ce0534: Mounted from library/node 
82da4502ad28: Mounted from library/node 
f3e76aaba7cc: Mounted from library/node 
cfec405a23bc: Mounted from library/node 
173621e7addd: Mounted from library/node 
latest: digest: sha256:efebf957434e71941b3b7669da229323bbecbb026d1ab595a432f35df3a06644 size: 3465
```

## To pull and run a docker image from dockerhub

```shell
manishkumargupta@Manishs-MacBook-Air Developer % docker run -p 3001:3000 heismanish/trialexpress
```

## Dockerfile in Monorepos(having multiple frontend and backends)

- Create a docker folder in the root directory 
- Create respective directories for all the backends that exists in your monorepo.
- In there dockerfiles we provide base image, define workdir, then copy all the common packages that is shared between them.

example:
```shell
COPY ["packages/common","./packages/common"]
```

[Reference](https://github.com/coral-xyz/backpack/blob/master/docker/backpack-api/Dockerfile)

- Note that here, before we start building these docker images we move these dockerfiles to the root directory(whenver a new change/commit is made...it's donw in the github workflows) and hence that's how all the files are reached and executed.


# Environment variables

- Variales/values that influence the way an app behaves.
- For developers. they offer a mechanism to store secrets, cedentials or general settings without hardcodeing them into the source code.
- Standard practice to use env variable is to use .env files to keep all the environment varibales.

Though we can also create environment variables such by simply exporting a variable in the directory.
example:
```shell
export MONGO_URL= 123
manishkumargupta@Manishs-MacBook-Air lol % node index.js
{
  __CFBundleIdentifier: 'com.apple.Terminal',
  TMPDIR: '/var/folders/3j/tq6jjcln7szf_k5p4k78jrrr0000gn/T/',
  XPC_FLAGS: '0x0',
  TERM: 'xterm-256color',
  SSH_AUTH_SOCK: '/private/tmp/com.apple.launchd.5gvFhnjnVc/Listeners',
  XPC_SERVICE_NAME: '0',
  TERM_PROGRAM: 'Apple_Terminal',
  TERM_PROGRAM_VERSION: '447',
  TERM_SESSION_ID: '42384D1C-0232-4E3B-9B2C-3E141DE8D4EF',
  SHELL: '/bin/zsh',
  HOME: '/Users/manishkumargupta',
  LOGNAME: 'manishkumargupta',
  USER: 'manishkumargupta',
  PATH: '/opt/homebrew/bin:/opt/homebrew/sbin:/usr/local/bin:/System/Cryptexes/App/usr/bin:/usr/bin:/bin:/usr/sbin:/sbin:/var/run/com.apple.security.cryptexd/codex.system/bootstrap/usr/local/bin:/var/run/com.apple.security.cryptexd/codex.system/bootstrap/usr/bin:/var/run/com.apple.security.cryptexd/codex.system/bootstrap/usr/appleinternal/bin',
  SHLVL: '1',
  PWD: '/Users/manishkumargupta/Developer/lol',
  OLDPWD: '/Users/manishkumargupta/Developer',
  HOMEBREW_PREFIX: '/opt/homebrew',
  HOMEBREW_CELLAR: '/opt/homebrew/Cellar',
  HOMEBREW_REPOSITORY: '/opt/homebrew',
  MANPATH: '/opt/homebrew/share/man::',
  INFOPATH: '/opt/homebrew/share/info:',
  MONGO_URI: '123',
  LC_CTYPE: 'UTF-8',
  _: '/opt/homebrew/bin/node',
  __CF_USER_TEXT_ENCODING: '0x1F5:0x0:0x0'
}
manishkumargupta@Manishs-MacBook-Air lol % vi indexjs
manishkumargupta@Manishs-MacBook-Air lol % node index.js
{
  __CFBundleIdentifier: 'com.apple.Terminal',
  TMPDIR: '/var/folders/3j/tq6jjcln7szf_k5p4k78jrrr0000gn/T/',
  XPC_FLAGS: '0x0',
  TERM: 'xterm-256color',
  SSH_AUTH_SOCK: '/private/tmp/com.apple.launchd.5gvFhnjnVc/Listeners',
  XPC_SERVICE_NAME: '0',
  TERM_PROGRAM: 'Apple_Terminal',
  TERM_PROGRAM_VERSION: '447',
  TERM_SESSION_ID: '42384D1C-0232-4E3B-9B2C-3E141DE8D4EF',
  SHELL: '/bin/zsh',
  HOME: '/Users/manishkumargupta',
  LOGNAME: 'manishkumargupta',
  USER: 'manishkumargupta',
  PATH: '/opt/homebrew/bin:/opt/homebrew/sbin:/usr/local/bin:/System/Cryptexes/App/usr/bin:/usr/bin:/bin:/usr/sbin:/sbin:/var/run/com.apple.security.cryptexd/codex.system/bootstrap/usr/local/bin:/var/run/com.apple.security.cryptexd/codex.system/bootstrap/usr/bin:/var/run/com.apple.security.cryptexd/codex.system/bootstrap/usr/appleinternal/bin',
  SHLVL: '1',
  PWD: '/Users/manishkumargupta/Developer/lol',
  OLDPWD: '/Users/manishkumargupta/Developer',
  HOMEBREW_PREFIX: '/opt/homebrew',
  HOMEBREW_CELLAR: '/opt/homebrew/Cellar',
  HOMEBREW_REPOSITORY: '/opt/homebrew',
  MANPATH: '/opt/homebrew/share/man::',
  INFOPATH: '/opt/homebrew/share/info:',
  MONGO_URI: '123',
  LC_CTYPE: 'UTF-8',
  _: '/opt/homebrew/bin/node',
  __CF_USER_TEXT_ENCODING: '0x1F5:0x0:0x0'
}
manishkumargupta@Manishs-MacBook-Air lol % cat index.js
console.log(process.env)
manishkumargupta@Manishs-MacBook-Air lol % vi index.js
manishkumargupta@Manishs-MacBook-Air lol % node index.js
123
manishkumargupta@Manishs-MacBook-Air lol % unset MONGO_URI
manishkumargupta@Manishs-MacBook-Air lol % node index.js
undefined
```

### Adding env variable from your dockerfile
```shell
ENV MONGO_URI=123
```

# Docker Compose

Docker Compose is a tool for defining and managing multi-container Docker applications.

It allows you to define an entire application stack, including the services, networks, and volumes, in a single docker-compose.yml file.

## Volumes in docker

Volumes in Docker are a way to persist data generated by and used by Docker containers. Volumes can be mounted from the host system or created as Docker-managed volumes.

Containers when closed don't save anything and everything is lost, so here comes the concept of persisting data as our saviour.

- Used for persisting data across starts.
- Specificaly useful for things like databses.

 This is achieved by the help of volumes.

 ```shell
 docker volume create volume1
 docker run -v volume1:/data/db -p 27017:17017 mongo
 ```

 - MongoDB stores all the data in the `/data/db` directory.


## Networks

Networking is a fundamental part of docker containers, allowing them to communicate with each other and the outside world.

steps:
1. 
```shell
docker network create my_custom_network
```

2. 
```shell
docker run --name webserver --network my_custom_network -d nginx
```
3. 
```shell
docker run --name testbox --network my_custom_network -it busybox sh ping webserver
```

Example:
```shell
manishkumargupta@Manishs-MacBook-Air Docker % docker network create manish1
5743df2ebff71f4f1a1a9de12142fa47621c77dd0e0fec465ad21a332fd7f73d
```

```shell
docker run --name nginx1 --network manish1 -d nginx
```
Containers don't have access to a lot of linux command, busybox provide such common commands and hence we use it here.
```shell
manishkumargupta@Manishs-MacBook-Air Docker % docker run --name testbox --network manish1 -it busybox sh

/ # ping nginx1
PING nginx1 (172.18.0.2): 56 data bytes
64 bytes from 172.18.0.2: seq=0 ttl=64 time=0.727 ms
64 bytes from 172.18.0.2: seq=1 ttl=64 time=0.372 ms
```

So now our app is running in one container and our dab on another and hencea  question rises...

### How is app container able to access mongo?

The docker compose will automatically create a named bridge network for your composition. This named bridge network allows for automatic service discovery using service names as DNS.

Example:
```yaml
version: '3'

services:
# this is a container where our db is
  mongodb:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

# this is a container where our app is running
  myapp2:
    build: 
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - MONGO_URL=mongodb://mongodb:27017
    depends_on:
      - mongodb

volumes:
  mongodb_data:
```

In summary, this Docker Compose file defines a multi-container application with a MongoDB service (mongodb) and another service (myapp2) that is built from the current directory. The services are connected via a named volume (mongodb_data) for persisting MongoDB data, and the myapp2 service communicates with the mongodb service using the specified MONGO_URL environment variable. The use of Docker Compose simplifies the management and deployment of these interconnected services.