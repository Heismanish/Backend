# Cluster in nodejs

Clusters of Node.js processes can be used to run multiple instances of Node.js that can distribute workloads among their application threads.

Cluster is a module that allows you to create multiple child processes (workers) that share the same server port.
Cluster help us leverage the cores of cpu we have by allowing us to run the same processes in all the cores of the cpu and hence reducing the load on the server.

Suppose we have 8 cores in our cpu then we can run 8 child poroceess in the same port of our server and these 8 can all handle requests inedpendently and it is done in round-robin fashion(except for in windows), that is, first request is handled by 1st child process second request by 2nd child process and similarly 8th request in this case is handled by 8th(in this case) server and then 9th request again goes to the 1st child process.

Let's look how we can actually achieve this in nodejs:

## Key points about Node.js clusters:

1. Improved Performance: Clustering enables parallel processing of incoming requests across multiple CPU cores, improving the overall performance and responsiveness of your application.

2. Fault Tolerance: If a worker process crashes, the master process can create a new worker to handle future requests, ensuring fault tolerance.

3. Scalability: Node.js clusters make it easier to scale your application horizontally by adding more machines, each running its own cluster of Node.js processes.

4. Shared Ports: All worker processes share the same server port, allowing them to handle incoming connections without conflicts.

5. Load Balancing: By distributing incoming requests among worker processes, clusters provide a form of load balancing, ensuring even utilization of resources.
