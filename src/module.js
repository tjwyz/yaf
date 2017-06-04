import { require } from './require.js';
import { globalModules } from './store.js';
import { nativeAsyncRequire } from './async.js';

export class Module {
	constructor(option){
		this.name = option.name;
		this.deps = option.deps || ['require', 'exports', 'module'];
		this.notBuiltinDeps = this.notBuiltinDependce()
		this.caller = option.caller || [];
		this.factory = option.factory;

		//MODULE_REQUIRE = -1
		//MODULE_UNINIT = 0;
		//MODULE_INIT = 1;
		//MODULE_ANALYZED = 2;
		//MODULE_DEFINED = 3;
		this.state = option.state;
		
		//count deps but not consume default dep(['require', 'exports', 'module'])
		this.depCount = this.notBuiltinDeps.length;

		this.exports = {};
		this.require = require;


		Object.defineProperty(this, 'depCount', {
			get() {
				return depCount;
			},
			set(newDepCount) {
				depCount = newDepCount;
				if (newDepCount === 0) {
					console.log(`模块${this.name}的依赖已经全部准备好`);
					this.invokeFactory();
				}
			}
		});

	}
	//0=>1
	//waiting for reDefine
	//entrance: modPrepare->module.modInit()
	modInit(){
		nativeAsyncRequire()
	}
	//1=>2
	modPrepare(){

		var deps = this.notBuiltinDeps;
		var factory = this.factory;
		var hardDependsCount = 0;

		// 分析function body中的require
		// 如果包含显式依赖声明，根据AMD规定和性能考虑，可以不分析factoryBody
		// if (typeof factory === 'function') {
		//     hardDependsCount = Math.min(factory.length, deps.length);

		//     // If the dependencies argument is present, the module loader
		//     // SHOULD NOT scan for dependencies within the factory function.
		//     !mod.depsDec && factory.toString()
		//         .replace(/(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$)/mg, '')
		//         .replace(/require\(\s*(['"])([^'"]+)\1\s*\)/g,
		//             function ($0, $1, depId) {
		//                 deps.push(depId);
		//             }
		//         );
		// }

		//Now ,Module already know amount of denpend
		//MODULE_ANALYZED
		this.state =  2;

		//本来我就没依赖....
		if(!this.depCount){
			this.invokeFactory()
		}

		for (let item of deps) {
			if (globalModules[item]) {
				let module = globalModules[item];
				// state == 2 不太可能...运行中或者factory涉及异步？
 				// state == 1 之前define过但还没触发,"需要手动触发一下"
				// state == 0 异步模块被require过,正在异步,reDefine后会在define模块中触发 ,此处不要触发,静静等待即可
				module.state < 3 ? module.caller.push(this) : this.depCount --

				if(state == 1){
					module.modPrepare()
				}
			} else {
				//async module...

				//name first
				//The purpose is to prevent multiple references in async stage
				let module = new Module({
					name:name,
					state:0
				})
				module.caller.push(this)
				globalModules[item] = module

				//come on! reDefine me
				module.modInit()
			}
		}
	}
	//	if depCount == 0 
	//		invokeFactory();
	invokeFactory(){

		try {
			// 调用factory函数初始化module
			// 赋值this.export 或者return赋值给this.export
			var factory = this.factory;
			var exports = typeof factory === 'function'
				? factory.apply('', modGetModulesExports(
						this.deps,
						{
							require: this.require,
							exports: this.exports,
							module: this
						}
					))
				: factory;

			if (exports != null) {
				this.exports = exports;
			}
		}

		//MODULE_DEFINED
		this.state =  3;

		//clean caller
		for(let item of this.caller){
			item.depCount --
		}
		this.caller = []
	}
	notBuiltinDependce(){
		let notBuiltinDeps = [];
		for(let item of this.deps){
			(['require', 'exports', 'module'].indexOf(item) == -1) && notBuiltinDeps.push(item)
		}
		return notBuiltinDeps
	}
}