# Streams in Nodejs

Let's consider a situation where we want to read a file which is of 50MB, so how we do it we simply use `readFile` method from `fs` module and we will be good to go but that's not good for our server because we are here using memory of our server when we do this and during this process of reading this file there is a spike in the memory consumpsion occurs which is very bad for our server's efficiency. Suppose we want to implement read a file of 400MB and zip it and then write it then the computation cost to perform these operations through our basic `readFile` `writeFile` methods will be very high as such almost 1200MB of our memory will be needed to just perform this task for a single file, which is certainly not an optimal way to do things.

So here comes streams as our saviour to save our server from such costly operations.
[Code](./index.js)

## Streams:

Streams are objects that let you read data from a source or write data to a destination in a continuous flow, chunk by chunk, instead of loading the entire data into memory at once. This makes streams particularly useful for working with large datasets, network connections, file systems, and real-time data.

### Streams in Node.js can be categorized into different types:

1. Readable Streams: These streams allow you to read data from a source, such as a file or an HTTP request. Readable streams produce data that can be consumed by other parts of your program.

2. Writable Streams: These streams allow you to write data to a destination, such as a file or an HTTP response. Writable streams consume data that is written to them.

3. Duplex Streams: These streams can be both readable and writable. They represent a two-way communication channel.

4. Transform Streams: These streams are a special type of duplex stream where the data is transformed as it is read from the source and written to the destination.

### Key points about the streaming approach:

1. Efficiency: Streaming processes data in chunks, making it more memory-efficient and faster for large files.
2. Event-Driven: Streams in Node.js are event-driven, allowing you to respond to events like 'end' and 'error'.
3. Piping: The pipe() method is used to pipe data from a readable stream to a writable stream, making it easy to transfer data between streams.
