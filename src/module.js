import { createLocalRequire } from './require.js';
import { globalModules } from './store.js';
import { nativeAsyncRequire } from './async.js';

export class Module {
	constructor(option){
		this.name = option.name;
		this.deps = option.deps || ['require', 'exports', 'module'];
		this.caller = [];
		this.factory = option.factory;

		//MODULE_UNINIT = 0;
		//MODULE_INIT = 1;
		//MODULE_ANALYZED = 2;
		//MODULE_DEFINED = 3;
		this.state = option.state;
		
		//count deps but not consume default dep(['require', 'exports', 'module'])
		this.depCount = 0;

		this.exports = {},
		this.require = createLocalRequire(option.name)

		for(let item of this.deps){
			(this.deps.indexOf(item) == -1) && this.depCount ++
		}
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

		if(!this.state){
			this.modInit()
		}

	}
	//0=>1
	modInit(){
		//complete 
		nativeAsyncRequire(this)
	}
	//1=>2
	modPrepare(){
	    var mod = globalModules[id];
		if (!mod || modIs(id, MODULE_ANALYZED)) {
		    return;
		}

		var deps = mod.deps;
		var factory = mod.factory;
		var hardDependsCount = 0;

		// 分析function body中的require
		// 如果包含显式依赖声明，根据AMD规定和性能考虑，可以不分析factoryBody
		if (typeof factory === 'function') {
		    hardDependsCount = Math.min(factory.length, deps.length);

		    // If the dependencies argument is present, the module loader
		    // SHOULD NOT scan for dependencies within the factory function.
		    !mod.depsDec && factory.toString()
		        .replace(/(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$)/mg, '')
		        .replace(/require\(\s*(['"])([^'"]+)\1\s*\)/g,
		            function ($0, $1, depId) {
		                deps.push(depId);
		            }
		        );
		}

		var requireModules = [];
		var depResources = [];
		each(deps, function (depId, index) {
		    var idInfo = parseId(depId);
		    var absId = normalize(idInfo.mod, id);
		    var moduleInfo;
		    var resInfo;

		    if (absId && !BUILDIN_MODULE[absId]) {
		        // 如果依赖是一个资源，将其信息添加到module.depRs
		        //
		        // module.depRs中的项有可能是重复的。
		        // 在这个阶段，加载resource的module可能还未defined，
		        // 导致此时resource id无法被normalize。
		        //
		        // 比如对a/b/c而言，下面几个resource可能指的是同一个资源：
		        // - js!../name.js
		        // - js!a/name.js
		        // - ../../js!../name.js
		        //
		        // 所以加载资源的module ready时，需要遍历module.depRs进行处理
		        if (idInfo.res) {
		            resInfo = {
		                id: depId,
		                mod: absId,
		                res: idInfo.res
		            };
		            depResources.push(depId);
		            mod.depRs.push(resInfo);
		        }

		        // 对依赖模块的id normalize能保证正确性，在此处进行去重
		        moduleInfo = mod.depMkv[absId];
		        if (!moduleInfo) {
		            moduleInfo = {
		                id: idInfo.mod,
		                absId: absId,
		                hard: index < hardDependsCount
		            };
		            mod.depMs.push(moduleInfo);
		            mod.depMkv[absId] = moduleInfo;
		            requireModules.push(absId);
		        }
		    }
		    else {
		        moduleInfo = {absId: absId};
		    }

		    // 如果当前正在分析的依赖项是define中声明的，
		    // 则记录到module.factoryDeps中
		    // 在factory invoke前将用于生成invoke arguments
		    if (index < hardDependsCount) {
		        mod.factoryDeps.push(resInfo || moduleInfo);
		    }
		});
		//MODULE_ANALYZED
		modSetState(id, 2);
		nativeAsyncRequire(requireModules);
	}
	//if depCount == 0 
	//	invokeFactory();
	invokeFactory(){

        // 拼接factory invoke所需的arguments
        var factoryReady = 1;
        each(
            mod.factoryDeps,
            function (dep) {
                var depId = dep.absId;

                if (!BUILDIN_MODULE[depId]) {
                    modTryInvokeFactory(depId);
                    return (factoryReady = modIs(depId, MODULE_DEFINED));
                }
            }
        );

        if (factoryReady) {
            try {
                // 调用factory函数初始化module
                var factory = mod.factory;
                var exports = typeof factory === 'function'
                    ? factory.apply(global, modGetModulesExports(
                            mod.factoryDeps,
                            {
                                require: mod.require,
                                exports: mod.exports,
                                module: mod
                            }
                        ))
                    : factory;

                if (exports != null) {
                    mod.exports = exports;
                }
            }

            //MODULE_ANALYZED
			modSetState(id, 2);
        }
	}
}