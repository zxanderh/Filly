
# filly

> Small, extensible, Angular-style string templating

## Features

-Angular-style pipes and params
  -Built-in substr and slice pipes
  -Optionally add your own custom pipes
-Support multiple brace depths
-Set default options (presets)
-Zero runtime dependencies

## Usage

Basic Fill:
```js
filly('Hello {foo}, I am {bar|slice:1:-1}!', { foo: 'friend', bar: '"filly"' });
// Output: 'Hello friend, I am filly!'
```
Custom presets:
```js
const myfilly = filly({
	pipes: {
    lower: (val) => val.toLowerCase(),
    upper: (val) => val.toUpperCase(),
  },
});

myfilly('{foo|upper} - {bar|lower}', { foo: 'big', bar: 'SMALL' });
// Output: 'BIG - small'
```
See API for more details and examples.

## API

## filly

```js
filly(template: string, source: object | Function, options?: Options): string;

filly(options: Options): (template: string, source: object | Function, options?: Options) => string;
```

Name | Type | Description
--- | --- | ---
template | string | The template to fill
source | object \| Function | The source object or callback from which to obtain values. If an object is passed, nested properties are supported. See [SourceFunc](#SourceFunc) for info on passing a callback function.
options | object | Configurable options for the fill function. See [Options](#Options)
<br>

### Options

Name | Type | Default value | Description
--- | --- | --- | ---
pipes | object | {} | A string-keyed object containing callbacks to be used for custom pipes. Pipes take the form ```(value: string, ...params: string[]) => string```
transform | Function | undefined | An additional transformation to perform on values after any pipes have executed. See [TransformFunc](#TransformFunc) for details.
notFoundValue | string \| Function | '' | The value to insert when the placeholder key is not found. If `source` is a function, this option is ignored. A callback function may also be supplied which takes the same form as [SourceFunc](#SourceFunc)

### SourceFunc
```js
(key: string, info: { pipe: string, params: string[], depth: number }) => string
```

Name | Description
--- | ---
key | The name (first part) of the placeholder
info | Additional information about the placeholder
info.pipe | The name of the pipe in the placeholder, if any
info.params | A copy of the additional parameters to be passed to the pipe, if any
info.depth | The number of braces used to enclose the placeholder. See also [Gotcha: Asymmetric Braces](#asymmetric-braces)

Example:
```
Template:  '{{nickName|foo:bar:baz}}'
Values passed to SourceFunc:
  ('nickName', { pipe: 'foo', params: ['bar', 'baz'], depth: 2 })
```

### TransformFunc
```js
(value: string, info?: { key: string, pipe: string, params: string[], depth: number }) => string
```

Name | Description
--- | ---
value | The current value of the placeholder
info | Additional information about the placeholder
info.key | The name (first part) of the placeholder
info.pipe | The name of the pipe in the placeholder, if any
info.params | A copy of the additional parameters to be passed to the pipe, if any
info.depth | The number of braces used to enclose the placeholder. See also [Gotcha: Asymmetric Braces](#asymmetric-braces)

## Gotchas

### Asymmetric Braces
If the number of braces on one side of a placeholder is different from the other (such as due to a typographical error), the depth will be the lower of the two numbers. However, all braces will still be removed from both sides of the placeholder upon replacement.

Example | Depth
--- | ---
{foo}} | 1
{{{{bar}}} | 3

```js
filly('This placeholder has a depth of {{foo}}}', (key, info) => {
  return String(info.depth);
});
// Output: 'This placeholder has a depth of 2'
// Note that all 3 braces were removed from the right side.
```

### Params are immutable
The info.params arrays passed to source and tranform callbacks are copies of the array used internally by filly, so changes to their values will not affect other callbacks, pipes, or the final replacement value, making the params effectively immutable from the perspective of the user. This was done to ward against unintended side effects.

## Contributing

Contributions and feedback are welcome and appreciated! Please visit the [GitHub repo](https://github.com/zxanderh/filly) to submit an issue or pull request.

## Recognition

Thanks to the [Angular Team](https://angular.io/) and sindresorhus (author of [pupa](https://www.npmjs.com/package/pupa)), whose work contributed greatly to the inspiration of filly.
