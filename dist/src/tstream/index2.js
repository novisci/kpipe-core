"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function StreamClass() {
    return class {
        constructor(opts) {
            this.stream = new (class S {
            })(opts);
        }
    };
}
exports.StreamClass = StreamClass;
function Readable(opts) {
    return new (StreamClass())(opts);
}
// export function Readable<Out extends (Buffer | string | {})> (...args: any[]) {
// }
// class InputType<T> {
//   out: string
//   constructor () {
//     this.out = this.constructor.toString().match(/\w+/g)[1]
//   }
// }
// class OutputType<T> {
// }
// interface Stream<T> extends NodeStream.Stream, OutputType<T>
// applyMixins(Stream<T>)
function applyMixins(derivedCtor, baseCtors) {
    baseCtors.forEach(baseCtor => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
            Object.defineProperty(derivedCtor.prototype, name, Object.getOwnPropertyDescriptor(baseCtor.prototype, name));
        });
    });
}
//# sourceMappingURL=index2.js.map