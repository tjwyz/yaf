let globalModules = {};
let modGetModulesExports = (modules, buildinModules)=>{
	var args = [];
	
	modules.forEach(function (id, index) {
		args[index] = buildinModules[id] || globalModules[id].exports;
	});

	return args;
};
let loadingModules = [];
let watting4preDefine = [];

let requireConf = {};
export{ globalModules ,modGetModulesExports, loadingModules, requireConf, watting4preDefine}