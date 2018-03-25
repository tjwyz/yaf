yar.define('bar', ['require', 'exports', 'module'], function(require, exports, module) {

    /* get render function */
    var _module1 = {
        exports: {}
    };
    (function(module, exports) {


        module.exports = {
            render: function() {
                with(this) {
    return [_c('div', {
        staticClass: "c-atom-aftclk-cover"
    })]
}

            },
            staticRenderFns: [
                
            ]
        };


    })(_module1, _module1.exports);


    /* get script output data */
    var _module2 = {
        exports: {}
    };
    (function(module, exports) {
        'use strict';

        Object.defineProperty(exports, "__esModule", {
            value: true
        });

        

    exports.default = {
        mounted: function () {
            this._init();
        },
        methods: {
            _init: function() {
                var that = this;


                var rcmdIndex = 'index_after_click_' + window.location.href;

                try {
                    if (storage.ss.getItem(rcmdIndex) == that.order) {
                        that.toggle(1);
                    }
                } catch (ex) {
                }
            },
            toggle: function (bool) {
                if (bool) {
                    this.show = this.upList && this.upList.length;
                }else {
                    this.show = 0;
                }
            },
            replace: function(data) {
                this.upList = data.upList;
                this.downList = data.downList;
            }
        }
    };

    })(_module2, _module2.exports);

    var obj = _module2.exports.default || _module2.exports;
    obj.render = obj.render || _module1.exports.render;
    obj.staticRenderFns = _module1.exports.staticRenderFns;


    /* get config */
    var _module3 = {
        exports: {}
    };
    (function(module, exports) {
        'use strict';

        Object.defineProperty(exports, "__esModule", {
            value: true
        });

        module.exports = 

    {

        data: {
            show: 0
        }
    }


    })(_module3, _module3.exports);

    _module3.exports.data && (obj.data = _module3.exports.data);
    _module3.exports.props && (obj.props = _module3.exports.props);
    _module3.exports.components && (obj.components = _module3.exports.components);


    obj._scopeId = "26d642f0-2bd3-11e8-b4a7-1d5940df0bdd";

    module.exports = obj;
});

yar.define('lx', ['require', 'exports', 'module', 'bar'], function(require, exports, module, bar) {

    /* get render function */
    var _module1 = {
        exports: {}
    };
    (function(module, exports) {


        module.exports = {
            render: function() {
                with(this) {
    return [_c('div', {
        staticClass: "c-atom-aftclk",
        attrs: {
            "a-show": "show"
        },
        on: {
            "click": function() {
                tjwyz = 111
            }
        }
    }, [_c('c-title', {
        staticClass: "c-atom-aftclk-title",
        attrs: {
            "text": title,
            "icon": "baidu"
        }
    }), _v(" "), _c('div', {
        staticClass: "c-scroll-wrapper"
    }, [_c('div', {
        staticClass: "c-scroll-touch"
    }, [_c('div', {
        staticClass: "c-gap-bottom-small"
    }, [
        [_c('c-slink', {
            staticClass: "c-scroll-item",
            attrs: {
                "url": rsitem.href,
                "text": rsitem.text,
                "type": "auto"
            }
        })]
    ], 2), _v(" "), _c('div', [
        [_c('c-slink', {
            staticClass: "c-scroll-item",
            attrs: {
                "url": rsitem.href,
                "text": rsitem.text,
                "type": "auto"
            }
        })]
    ], 2)])]), _v(" "), _c('div', {
        staticClass: "c-atom-aftclk-cover"
    })], 1)]
}

            },
            staticRenderFns: [
                
            ]
        };


    })(_module1, _module1.exports);


    /* get script output data */
    var _module2 = {
        exports: {}
    };
    (function(module, exports) {
        'use strict';

        Object.defineProperty(exports, "__esModule", {
            value: true
        });

    
    exports.default = {
        mounted: function () {
            this._init();
        },
        methods: {
            _init: function() {
                var that = this;

                var rcmdIndex = 'index_after_click_' + window.location.href;

                try {
                    if (storage.ss.getItem(rcmdIndex) == that.order) {
                        that.toggle(1);
                    }
                } catch (ex) {
                }
            },
            toggle: function (bool) {
                if (bool) {
                    this.show = this.upList && this.upList.length;
                }else {
                    this.show = 0;
                }
            },
            replace: function(data) {
                this.upList = data.upList;
                this.downList = data.downList;
            }
        }
    };

    })(_module2, _module2.exports);

    var obj = _module2.exports.default || _module2.exports;
    obj.render = obj.render || _module1.exports.render;
    obj.staticRenderFns = _module1.exports.staticRenderFns;


    /* get config */
    var _module3 = {
        exports: {}
    };
    (function(module, exports) {
        'use strict';

        Object.defineProperty(exports, "__esModule", {
            value: true
        });

        module.exports = 

    {
        props: {
            upList: {
                type: Array
            },
            downList: {
                type: Array
            },
            title: {
                type: String,
                default: '大家还搜'
            },
            order: {
                type: Number,
                required: true
            }
        },
        components: {
            'c-title': require('bar')
        },
        data: {
            show: 0
        }
    }


    })(_module3, _module3.exports);

    _module3.exports.data && (obj.data = _module3.exports.data);
    _module3.exports.props && (obj.props = _module3.exports.props);
    _module3.exports.components && (obj.components = _module3.exports.components);


    obj._scopeId = "26d3d1f0-2bd3-11e8-b4a7-1d5940df0bdd";
    module.exports = obj;
});


yar.require(["lx"],function(lx){
    console.log(lx);
})