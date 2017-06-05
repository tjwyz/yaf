let globalModules = {};
let modGetModulesExports = (modules, buildinModules)=>{
	var args = [];
	
	modules.forEach(function (id, index) {
		args[index] = buildinModules[id] || globalModules[id].exports;
	});

	return args;
}
export{ globalModules ,modGetModulesExports}