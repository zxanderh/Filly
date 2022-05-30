type FillySourceFunc = (key: string, info?: { pipe: string, params: string[], depth: number }) => string;

type FillyTransformFunc = (value: string, info?: { key: string, pipe: string, params: string[], depth: number }) => string;

type FillyOptions = {
  pipes: { [key: string]: (value: string, ...params: string[]) => string },
  transform: FillyTransformFunc,
  notFoundValue: string | FillySourceFunc,
};

declare function filly(template: string, source: object | FillySourceFunc, options?: FillyOptions): string;
declare function filly(presets: FillyOptions): (template: string, source: object | FillySourceFunc, options?: FillyOptions) => string;

export = filly;
