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
