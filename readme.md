# JSON paths

Get the paths present in a JSON string. Multiple strings may be delimited by newline.

## Install

```sh
deno install --global --name paths 'https://raw.githubusercontent.com/tjconcept/json-paths/refs/heads/main/index.js'
```

## Example

```sh
echo '{"a":1,"b":[2,3]}\n{"b":[2,3,4],"c":5}' | paths
a
b.0
b.1
b.0
b.1
b.2
c
```
