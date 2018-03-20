import { loadingModules, watting4preDefine, requireConf } from './store.js'
/**
 * 加载模块
 *
 * @inner
 * @param {string} moduleId 模块标识
 */
function loadModule(moduleId) {
    loadingModules.push(moduleId);
    let moduleSrc = requireConf[moduleId];
    createScript(moduleSrc, moduleId, function () {
        modCompletePreDefine(moduleId);
    });
}

function createScript(src, moduleId, onload) {
    var script = document.createElement('script');
    script.setAttribute('data-src', src);
    script.src = src;
    script.async = true;
    if (script.readyState) {
        script.onreadystatechange = innerOnload;
    }
    else {
        script.onload = innerOnload;
    }

    function innerOnload() {
        var readyState = script.readyState;
        if (
            typeof readyState === 'undefined'
            || /^(loaded|complete)$/.test(readyState)
        ) {
            script.onload = script.onreadystatechange = null;
            script = null;

            onload();
        }
    }
}
function modCompletePreDefine(ids) {
    // HACK: 这里在IE下有个性能陷阱，不能使用任何变量。
    //       否则貌似会形成变量引用和修改的读写锁，导致watting4preDefine释放困难
    each(watting4preDefine, function (mod) {
        each(ids, function (currentId) {
            modPreDefine(
                currentId,
                mod.deps,
                mod.factory
            );
        });
    });

    watting4preDefine.length = 0;
}
export {nativeAsyncRequire}