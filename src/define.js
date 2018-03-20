import { unexpected } from './util.js';
import { Module } from './module.js'
import { globalModules, watting4preDefine } from './store.js'
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
    } else if (typeof name === 'string' && typeof factory === 'function' && deps.length == 0) {
        deps = undefined;
    }

    if (!name) {
        // unexpected('must input a moduleId');
        watting4preDefine.push({
            deps:deps,
            factory:factory
        })
    }
	let option = {
		name:name,
		deps:deps,
		factory:factory,
		state:1
	};
	if(globalModules[name] && globalModules[name].state == 0){
		//异步模块再次define来覆盖之前的占位module了
		//特殊处理一下  把之前积压的caller继承过来
		//并且， reDefine的模块代表之前被require了 
		//立刻prepare!!!
		option.caller = globalModules[name].caller

	}
	let module = new Module(option);
	globalModules[name] = module;

};
define.amd = {
  multiversion: true
};
export { define }