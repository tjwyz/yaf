//ajax and define it
/**
 * 加载模块
 *
 * @inner
 * @param {string} moduleId 模块标识
 * @param {string?} moduleSrc 模块对应Url
 */
function loadModule(moduleId, moduleSrc) {
    loadingModules[moduleId] = 1;

    var loadId = bundleIdRetrieve(moduleId) || moduleId;
    moduleSrc = moduleSrc || toUrl(loadId + '.js');

    // 初始化相关 shim 的配置
    var shimConf = requireConf.shim[moduleId];
    if (shimConf instanceof Array) {
        requireConf.shim[moduleId] = shimConf = {
            deps: shimConf
        };
    }

    // shim依赖的模块需要自动标识为shim
    // 无论是纯正的shim模块还是hybird模块
    var shimDeps = shimConf && (shimConf.deps || []);
    if (shimDeps) {
        each(shimDeps, function (dep) {
            if (!requireConf.shim[dep]) {
                requireConf.shim[dep] = {};
            }
        });
        actualGlobalRequire(shimDeps, load);
    }
    else {
        load();
    }

    /**
     * 发送请求去加载模块
     *
     * @inner
     */
    function load() {
        /* eslint-disable no-use-before-define */
        if (!loadingURL4Modules[moduleSrc]) {
            loadingURL4Modules[moduleSrc] = [];
        }

        loadingURL4Modules[moduleSrc].push(moduleId);
        createScript(moduleSrc, moduleId, function () {
            if (shimConf) {
                var exports;
                if (typeof shimConf.init === 'function') {
                    exports = shimConf.init.apply(
                        global,
                        modGetModulesExports(shimDeps, BUILDIN_MODULE)
                    );
                }

                if (exports == null && shimConf.exports) {
                    exports = global;
                    each(
                        shimConf.exports.split('.'),
                        function (prop) {
                            exports = exports[prop];
                            return !!exports;
                        }
                    );
                }

                globalDefine(moduleId, shimDeps, function () {
                    return exports || {};
                });
            }
            else {
                modCompletePreDefine(loadingURL4Modules[moduleSrc]);
            }

            modAutoDefine();
        });
        /* eslint-enable no-use-before-define */
    }

}

/**
 * 异步加载模块
 * 内部使用，模块ID必须是经过normalize的Top-Level ID
 *
 * @inner
 * @param {Array} ids 模块名称或模块名称列表
 * @param {Function=} callback 获取模块完成时的回调函数
 * @param {string} baseId 基础id，用于当ids是relative id时的normalize
 */
function nativeAsyncRequire(ids, callback, baseId) {
    var isCallbackCalled = 0;

    each(ids, function (id) {
        if (!(BUILDIN_MODULE[id] || modIs(id, MODULE_DEFINED))) {
            modAddListener(id, MODULE_DEFINED, tryFinishRequire);

            var loaderValue;
            var context = {
                id: id,
                load: function (src) {
                    if (!(loadingModules[id] || globalModules[id])) {
                        loadModule(id, src);
                    }
                },

                getModuleState: getModState
            };

            if (!(loadingModules[id] || globalModules[id])) {
                each(loaders, function (loader) {
                    loaderValue = loader(context, modAutoDefine);
                    return typeof loaderValue === 'undefined';
                });

                if (typeof loaderValue === 'string') {
                    loadModule(id, loaderValue);
                }
                else if (loaderValue !== false) {
                    (id.indexOf('!') > 0)
                        ? loadResource(id, baseId)
                        : loadModule(id);
                }
            }
        }
    });

    tryFinishRequire();

    /**
     * 尝试完成require，调用callback
     * 在模块与其依赖模块都加载完时调用
     *
     * @inner
     */
    function tryFinishRequire() {
        if (typeof callback === 'function' && !isCallbackCalled) {
            var isAllCompleted = 1;
            each(ids, function (id) {
                if (!BUILDIN_MODULE[id]) {
                    return (isAllCompleted = !!modIs(id, MODULE_DEFINED));
                }
            });

            // 检测并调用callback
            if (isAllCompleted) {
                isCallbackCalled = 1;

                callback.apply(
                    global,
                    modGetModulesExports(ids, BUILDIN_MODULE)
                );
            }
        }
    }
}
export {nativeAsyncRequire}