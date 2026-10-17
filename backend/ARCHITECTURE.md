# Architecture

## Healtiness, Readiness, Metrics

For most HTTP-based health probes, the following configuration is a sensible starting point:

| Setting | Value |
|---|---|
| Path | `/health` |
| Method | `GET` |
| Expected status | `200` |
| Port | The same port your Node.js server listens on |
| Timeout | 2–5 seconds |
| Interval | 10–30 seconds |

These are starting values, not universal cloud-provider defaults. So those values shoud be configurable such that they can be adjusted to follow the provider's own constraints and recommended settings.

If the infrastructure provider distinguishes startup, liveness, and readiness probes, we will use /health for liveness and add a separate /ready endpoint for readiness, if we later introduce initialization tasks or external dependencies.

Since this application is a WebSocket room server, we will expose 3 separate endpoints:

- `/health` — the process is alive and can respond to HTTP.
- `/ready` — the server is ready to accept new WebSocket connections.
- `/metrics` — for operational metrics, integration to a monitoring system, typically integration to prometheus.

Nota Bene: The rooms count is useful for observability, but it should not determine whether the server is healthy. Having zero rooms is a perfectly healthy state.


### Prometheus metrics

Inside the `./backend/server.ts`:

* `register.metrics()` produces the metrics in Prometheus's expected text format.
* `register.contentType` sets the correct response content type.
* `500` Internal Server Error is returned if metric collection fails.
* The existing WebSocket upgrade handling remains in place.

Example metrics collected:

```bash
# HELP process_cpu_user_seconds_total Total user CPU time spent in seconds.
# TYPE process_cpu_user_seconds_total counter
process_cpu_user_seconds_total{app="excali-math-backend"} 0.134143

# HELP process_cpu_system_seconds_total Total system CPU time spent in seconds.
# TYPE process_cpu_system_seconds_total counter
process_cpu_system_seconds_total{app="excali-math-backend"} 0.070424

# HELP process_cpu_seconds_total Total user and system CPU time spent in seconds.
# TYPE process_cpu_seconds_total counter
process_cpu_seconds_total{app="excali-math-backend"} 0.204567

# HELP process_start_time_seconds Start time of the process since unix epoch in seconds.
# TYPE process_start_time_seconds gauge
process_start_time_seconds{app="excali-math-backend"} 1792091886

# HELP process_resident_memory_bytes Resident memory size in bytes.
# TYPE process_resident_memory_bytes gauge
process_resident_memory_bytes{app="excali-math-backend"} 79589376

# HELP process_virtual_memory_bytes Virtual memory size in bytes.
# TYPE process_virtual_memory_bytes gauge
process_virtual_memory_bytes{app="excali-math-backend"} 1538306048

# HELP process_heap_bytes Process heap size in bytes.
# TYPE process_heap_bytes gauge
process_heap_bytes{app="excali-math-backend"} 611577856

# HELP process_open_fds Number of open file descriptors.
# TYPE process_open_fds gauge
process_open_fds{app="excali-math-backend"} 24

# HELP process_max_fds Maximum number of open file descriptors.
# TYPE process_max_fds gauge
process_max_fds{app="excali-math-backend"} 1048576

# HELP nodejs_eventloop_lag_seconds Lag of event loop in seconds.
# TYPE nodejs_eventloop_lag_seconds gauge
nodejs_eventloop_lag_seconds{app="excali-math-backend"} 0.001702171

# HELP nodejs_eventloop_lag_min_seconds The minimum recorded event loop delay.
# TYPE nodejs_eventloop_lag_min_seconds gauge
nodejs_eventloop_lag_min_seconds{app="excali-math-backend"} 0.009068544

# HELP nodejs_eventloop_lag_max_seconds The maximum recorded event loop delay.
# TYPE nodejs_eventloop_lag_max_seconds gauge
nodejs_eventloop_lag_max_seconds{app="excali-math-backend"} 0.012935167

# HELP nodejs_eventloop_lag_mean_seconds The mean of the recorded event loop delays.
# TYPE nodejs_eventloop_lag_mean_seconds gauge
nodejs_eventloop_lag_mean_seconds{app="excali-math-backend"} 0.01008747486825054

# HELP nodejs_eventloop_lag_stddev_seconds The standard deviation of the recorded event loop delays.
# TYPE nodejs_eventloop_lag_stddev_seconds gauge
nodejs_eventloop_lag_stddev_seconds{app="excali-math-backend"} 0.00015001455152316906

# HELP nodejs_eventloop_lag_p50_seconds The 50th percentile of the recorded event loop delays.
# TYPE nodejs_eventloop_lag_p50_seconds gauge
nodejs_eventloop_lag_p50_seconds{app="excali-math-backend"} 0.010076159

# HELP nodejs_eventloop_lag_p90_seconds The 90th percentile of the recorded event loop delays.
# TYPE nodejs_eventloop_lag_p90_seconds gauge
nodejs_eventloop_lag_p90_seconds{app="excali-math-backend"} 0.010092543

# HELP nodejs_eventloop_lag_p99_seconds The 99th percentile of the recorded event loop delays.
# TYPE nodejs_eventloop_lag_p99_seconds gauge
nodejs_eventloop_lag_p99_seconds{app="excali-math-backend"} 0.010264575

# HELP nodejs_active_resources Number of active resources that are currently keeping the event loop alive, grouped by async resource type.
# TYPE nodejs_active_resources gauge
nodejs_active_resources{type="PipeWrap",app="excali-math-backend"} 2
nodejs_active_resources{type="TCPServerWrap",app="excali-math-backend"} 1
nodejs_active_resources{type="TCPSocketWrap",app="excali-math-backend"} 2
nodejs_active_resources{type="Immediate",app="excali-math-backend"} 1

# HELP nodejs_active_resources_total Total number of active resources.
# TYPE nodejs_active_resources_total gauge
nodejs_active_resources_total{app="excali-math-backend"} 6

# HELP nodejs_active_handles Number of active libuv handles grouped by handle type. Every handle type is C++ class name.
# TYPE nodejs_active_handles gauge
nodejs_active_handles{type="Socket",app="excali-math-backend"} 4
nodejs_active_handles{type="Server",app="excali-math-backend"} 1

# HELP nodejs_active_handles_total Total number of active handles.
# TYPE nodejs_active_handles_total gauge
nodejs_active_handles_total{app="excali-math-backend"} 5

# HELP nodejs_active_requests Number of active libuv requests grouped by request type. Every request type is C++ class name.
# TYPE nodejs_active_requests gauge

# HELP nodejs_active_requests_total Total number of active requests.
# TYPE nodejs_active_requests_total gauge
nodejs_active_requests_total{app="excali-math-backend"} 0

# HELP nodejs_heap_size_total_bytes Process heap size from Node.js in bytes.
# TYPE nodejs_heap_size_total_bytes gauge
nodejs_heap_size_total_bytes{app="excali-math-backend"} 16388096

# HELP nodejs_heap_size_used_bytes Process heap size used from Node.js in bytes.
# TYPE nodejs_heap_size_used_bytes gauge
nodejs_heap_size_used_bytes{app="excali-math-backend"} 13418808

# HELP nodejs_external_memory_bytes Node.js external memory size in bytes.
# TYPE nodejs_external_memory_bytes gauge
nodejs_external_memory_bytes{app="excali-math-backend"} 4687253

# HELP nodejs_heap_space_size_total_bytes Process heap space size total from Node.js in bytes.
# TYPE nodejs_heap_space_size_total_bytes gauge
nodejs_heap_space_size_total_bytes{space="read_only",app="excali-math-backend"} 0
nodejs_heap_space_size_total_bytes{space="new",app="excali-math-backend"} 5505024
nodejs_heap_space_size_total_bytes{space="old",app="excali-math-backend"} 7602176
nodejs_heap_space_size_total_bytes{space="code",app="excali-math-backend"} 786432
nodejs_heap_space_size_total_bytes{space="shared",app="excali-math-backend"} 0
nodejs_heap_space_size_total_bytes{space="trusted",app="excali-math-backend"} 2359296
nodejs_heap_space_size_total_bytes{space="shared_trusted",app="excali-math-backend"} 0
nodejs_heap_space_size_total_bytes{space="new_large_object",app="excali-math-backend"} 0
nodejs_heap_space_size_total_bytes{space="large_object",app="excali-math-backend"} 135168
nodejs_heap_space_size_total_bytes{space="code_large_object",app="excali-math-backend"} 0
nodejs_heap_space_size_total_bytes{space="shared_large_object",app="excali-math-backend"} 0
nodejs_heap_space_size_total_bytes{space="shared_trusted_large_object",app="excali-math-backend"} 0
nodejs_heap_space_size_total_bytes{space="trusted_large_object",app="excali-math-backend"} 0

# HELP nodejs_heap_space_size_used_bytes Process heap space size used from Node.js in bytes.
# TYPE nodejs_heap_space_size_used_bytes gauge
nodejs_heap_space_size_used_bytes{space="read_only",app="excali-math-backend"} 0
nodejs_heap_space_size_used_bytes{space="new",app="excali-math-backend"} 3250088
nodejs_heap_space_size_used_bytes{space="old",app="excali-math-backend"} 7442800
nodejs_heap_space_size_used_bytes{space="code",app="excali-math-backend"} 657664
nodejs_heap_space_size_used_bytes{space="shared",app="excali-math-backend"} 0
nodejs_heap_space_size_used_bytes{space="trusted",app="excali-math-backend"} 1941128
nodejs_heap_space_size_used_bytes{space="shared_trusted",app="excali-math-backend"} 0
nodejs_heap_space_size_used_bytes{space="new_large_object",app="excali-math-backend"} 0
nodejs_heap_space_size_used_bytes{space="large_object",app="excali-math-backend"} 131088
nodejs_heap_space_size_used_bytes{space="code_large_object",app="excali-math-backend"} 0
nodejs_heap_space_size_used_bytes{space="shared_large_object",app="excali-math-backend"} 0
nodejs_heap_space_size_used_bytes{space="shared_trusted_large_object",app="excali-math-backend"} 0
nodejs_heap_space_size_used_bytes{space="trusted_large_object",app="excali-math-backend"} 0

# HELP nodejs_heap_space_size_available_bytes Process heap space size available from Node.js in bytes.
# TYPE nodejs_heap_space_size_available_bytes gauge
nodejs_heap_space_size_available_bytes{space="read_only",app="excali-math-backend"} 0
nodejs_heap_space_size_available_bytes{space="new",app="excali-math-backend"} 943960
nodejs_heap_space_size_available_bytes{space="old",app="excali-math-backend"} 158792
nodejs_heap_space_size_available_bytes{space="code",app="excali-math-backend"} 128672
nodejs_heap_space_size_available_bytes{space="shared",app="excali-math-backend"} 0
nodejs_heap_space_size_available_bytes{space="trusted",app="excali-math-backend"} 417984
nodejs_heap_space_size_available_bytes{space="shared_trusted",app="excali-math-backend"} 0
nodejs_heap_space_size_available_bytes{space="new_large_object",app="excali-math-backend"} 4194304
nodejs_heap_space_size_available_bytes{space="large_object",app="excali-math-backend"} 0
nodejs_heap_space_size_available_bytes{space="code_large_object",app="excali-math-backend"} 0
nodejs_heap_space_size_available_bytes{space="shared_large_object",app="excali-math-backend"} 0
nodejs_heap_space_size_available_bytes{space="shared_trusted_large_object",app="excali-math-backend"} 0
nodejs_heap_space_size_available_bytes{space="trusted_large_object",app="excali-math-backend"} 0

# HELP nodejs_version_info Node.js version info.
# TYPE nodejs_version_info gauge
nodejs_version_info{version="v26.12.0",major="26",minor="12",patch="0",app="excali-math-backend"} 1

# HELP nodejs_gc_duration_seconds Garbage collection duration by kind, one of major, minor, incremental or weakcb.
# TYPE nodejs_gc_duration_seconds histogram

# HELP websocket_connected_clients Number of currently connected WebSocket clients.
# TYPE websocket_connected_clients gauge
websocket_connected_clients{app="excali-math-backend"} 1

# HELP websocket_active_rooms Number of active WebSocket rooms.
# TYPE websocket_active_rooms gauge
websocket_active_rooms{app="excali-math-backend"} 1

# HELP websocket_messages_received_total Total number of WebSocket messages received.
# TYPE websocket_messages_received_total counter
websocket_messages_received_total{app="excali-math-backend"} 6
```

## Websocket testing

```bash
pnpm add -g wscat
```

* Example usage::

```bash
$ wscat -c wss://excali-math-backend.onrender.com
ok
> {"type":"error","code":"invalid_json","message":"Message must be valid JSON."}
```

