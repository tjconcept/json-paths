#!/usr/bin/env -S deno run
import {TextLineStream} from 'https://jsr.io/@std/streams/1.0.8/text_line_stream.ts'
import {JsonParseStream} from 'https://jsr.io/@std/json/1.0.1/parse_stream.ts'

const paths = new Set()

Deno.stdin.readable
	.pipeThrough(new TextDecoderStream())
	.pipeThrough(new TextLineStream())
	.pipeThrough(new JsonParseStream())
	.pipeTo(
		new WritableStream({
			write(entry) {
				for (const path of getPaths(entry)) {
					const concatenated = path.join('.')
					if (paths.has(concatenated)) {
						continue
					}

					paths.add(concatenated)
					console.log(concatenated)
				}
			},
		}),
	)
	.catch((err) => {
		if (err.code === 'EPIPE') {
			return
		}

		console.error(err)
	})

function* getPaths(entry, prefix = []) {
	if (Array.isArray(entry)) {
		for (const [idx, value] of entry.entries()) {
			yield* getPaths(value, [...prefix, idx])
		}
	} else if (entry !== null && entry instanceof Object) {
		for (const [key, value] of Object.entries(entry)) {
			yield* getPaths(value, [...prefix, key])
		}
	} else {
		yield prefix
	}
}
