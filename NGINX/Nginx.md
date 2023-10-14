# NGINX

NGINX is a powerful web server and uses a non-threaded, event driven architechture.

- Non-threaded: Doesn't use threads, instead it uses asynchronous I/O operations to handle multple coonnections efficiently.
- Event driven: Flow of program is determined by events such as user actions.

 It is known for its high performance, stability, and low resource usage, making it a preferred choice for many websites and applications.

It can also do other imortant things such as:
1. Load Balancing.
2. HTTP caching.
3. Reverse Proxy.

## Proxy:

A proxy is a intermediary b/w clients and servers, helping them communicate indirectly.


1. Forward proxy:
It is server that sits b/w a client and internet. When a client make request it is sent to the forward proxy and this forward proxy then on the behalf of the user redirects this reques to the target server.

    Example: VPN, in a vpn multiple users and redirects them to a server.

    Forward proxies are typically used by clients to:

    - Bypass Restrictions: Access content that might be blocked in their region or network.
   
    - Anonymity and Privacy: Hide their IP addresses for anonymous browsing.
    
    - Content Filtering: Filter content based on categories (for example, blocking certain websites or types of media).

2. Reverse Proxy:

    A reverse proxy is a server that sits b/w client devices and a web server. When a client makes a request, it appears to be as if the reverse proxy is the target server. The reverse proxy then forwards the request to the actual web server.

    Reverse proxies are typically used for several purposes:

    - Load Balancing: Distribute incoming client requests across multiple servers to balance the server load.
    - Caching: Cache static content to reduce the load on the web server and improve response times.
    - Act as an API Gateway, as to redirect different types of requests to their respective ports on the server.
    - Handle SSL certficates.


## Installing NGINX

