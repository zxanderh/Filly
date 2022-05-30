const placeholderRegex = /{+(?:(.*?(?:^|[^\\])(?:\\{2})*)}+)/g;

function doFill(template, source, options) {
	options = Object.assign({ pipes: {}, notFoundValue: '' }, options);
	const pipes = Object.assign({
		substr: (value, start, length) => value.substring(start, length ? Number(start) + Number(length) : undefined),
		slice: (..._args) => String.prototype.slice.call(..._args),
	}, options.pipes);

	let out = template.replace(placeholderRegex, p => {
		let val;

		// Remove brackets and get depth
		let depth = Infinity;
		const placeholder = p.replace(/^{+|}+$/g, brackets => {
			depth = Math.min(depth, brackets.length);
			return '';
		});

		// Separate placeholder components
		const [key, pipe, ...params] = Array.from(placeholder.matchAll(/(?:(.*?(?:^|[^\\])(?:\\{2})*)(?:[|:]|$))/g)).map(m => m[1]);

		// Get replacement value
		if (source instanceof Function) {
			val = source(key, { pipe, params: [...params], depth });
		} else {
			val = key.split('.').reduce((o, p) => { return o === null || o === undefined ? undefined : o[p]; }, source);
			if (val === undefined) {
				val = options.notFoundValue instanceof Function ? options.notFoundValue(key, { pipe, params: [...params], depth }) : options.notFoundValue;
			}
		}

		// Apply pipe
		if (pipes[pipe]) {
			val = pipes[pipe](val, ...params);
		}

		// Apply post-transform
		if (options.transform instanceof Function) {
			val = options.transform(val, { key, pipe, params: [...params], depth });
		}

		return val;
	});

	return out;
}

module.exports = function filly(tmplOrPresets, _source, _options) {
	return typeof tmplOrPresets === 'object'
		? (template, source, options) => doFill(template, source, Object.assign({}, tmplOrPresets, options ))
		: doFill(tmplOrPresets, _source, _options);
};
