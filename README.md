# `kpipe-core`

A proof-of-concept project using Kafka to implement an event-based data pipeline performing ETLs of source data to CDF data.

The project is basically a toolkit which provides modular functions for use in ETL processes. It supports reading and writing to stdio, filesystem, Amazon S3, and Kafka topics. All operations are implemented as streams and are intended to be connected via pipe(), in a pipeline(), or via stdio for piping in shell scripts. The project provides a commandline utility `dpipe` which allows access to the datapipe functions for shell scripting, exploration, or testing.

Within the project are additional scripts used to provision AWS EC2 instances as members of a Kafka cluster.  See README.md under `./aws` for details.

## Stream Types

| Name | Type | Reads | Writes | Notes |
|--|--|--|--|--|--|
| `reader/buffer` | reaable | buffers | | |
| `reader/stdio` | readable | buffers | | |
| `reader/fs` | readable | buffers | | |
| `reader/s3` | readable | buffers | | |
| `reader/kafka` | readable | lines | | |
| `writer/kafka` | writable | | lines | |
| `writer/s3` | writable | | buffers | |
| `writer/fs` | writable | | buffers | |
| `writer/stdio` | writable | | buffers | |
| `writer/buffer` | writable | | buffers | |

> _Lines are strings which are terminated by newlines. Streams operating on lines are assumed to be in object mode. Each chunk is a string (with the terminating newline removed)_
