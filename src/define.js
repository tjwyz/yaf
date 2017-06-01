import { unexpected } from './utils.js';
import { Module } from './module.js'
import { globalModules } from './store.js'
let define = (name, deps, factory) => {
    if (typeof name === 'function' && !deps && !factory) {
        factory = name;
        name = undefined;
        deps = undefined;
    } else if (typeof name === 'string' && typeof deps === 'function') {
        factory = deps;
        deps = undefined;
    } else if (Array.isArray(name) && typeof deps === 'function') {
        factory = deps;
        deps = name;
        name = undefined;
    } else {
        unexpected('The argument for define function is wrong.');
    }

    if (!name) {
        unexpected('must input a moduleId');
    }
    let option = {
    	name:name,
    	deps:deps,
    	factory:factory,
    	state:1
    };
    let module = new Module(option);
    globalModules[module.name] = module;

};
export { define }