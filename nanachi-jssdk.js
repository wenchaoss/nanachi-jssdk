/**
 * 0.01版本
 * 临时支持活动使用
 */
(function(win) {
    // 事件数组
    var subscribers = [];
    var XCX = {
        isAli: function () {
            return navigator.userAgent.indexOf('AlipayClient') > -1;
            // return true;
        },
        isBu: function() {
            // return navigator.userAgent.indexOf('baiduboxapp') > -1;
            return true;
        },
        isWx: function() {
            return navigator.userAgent.indexOf('MicroMessenger') > -1;
            // return true;
        },
        isQuick: function() {
            return (window.system && typeof window.system.go === 'function');
        },
        init: function(cofig) {
            this.config = cofig;
            console.log('init', this);
        },
        env: '',
        // 是否是自定义环境
        isRegEnv: false,
        config: {},
        loadJs: function() {
            if(this.isAli()) {
                this.addScript('https://appx/web-view.min.js');
                this.env = 'ali';
            } else if(this.isBu()) {
                this.addScript('https://b.bdstatic.com/searchbox/icms/searchbox/js/swan-2.0.2.js');
                this.env = 'bu';
            } else if(this.isWx()) {
                this.addScript('https://res.wx.qq.com/open/js/jweixin-1.3.2.js');
                this.env = 'wx';
            } else if(this.isQuick()) {
                this.env = 'quick';
            }
        },
        addScript: function(url) {
            var script = document.createElement("script");
            var head = document.getElementsByTagName("head")[0];
            script.type = "text/javascript";
            script.src = url;
            head.appendChild(script);
        },
        navigateTo: function(obj) {
            var obj = this.handleUrl(obj);
            if(this.isAli()) {
                my.navigateTo(obj);
            } else if(this.isBu()) {
                swan.webView.navigateTo(obj);
            } else if(this.isWx()) {
                wx.miniProgram.navigateTo(obj);
            } else if(this.isQuick()) {
                system.go(obj.url);
            } else {
                this.noApi();
            }
        },
        redirectTo: function(obj) {
            var obj = this.handleUrl(obj);
            if(this.isAli()) {
                my.redirectTo(obj);
            } else if(this.isBu()) {
                swan.webView.redirectTo(obj);
            } else if(this.isWx()) {
                wx.miniProgram.redirectTo(obj);
            } else {
                this.noApi();
            }
        },
        navigateBack: function(obj) {
            if(this.isAli()) {
                my.navigateBack(obj);
            } else if(this.isBu()) {
                swan.webView.navigateBack(obj);
            } else if(this.isWx()) {
                wx.miniProgram.navigateBack(obj);
            } else {
                this.noApi();
            }
        },
        switchTab: function(obj) {
            if(this.isAli()) {
                my.switchTab();
            } else if(this.isBu()) {
                swan.webView.switchTab(obj);
            } else if(this.isWx()) {
                wx.miniProgram.switchTab(obj);
            } else {
                this.noApi();
            }
        },
        reLaunch: function(obj) {
            if(this.isAli()) {
                my.reLaunch();
            } else if(this.isBu()) {
                swan.webView.reLaunch(obj);
            } else if(this.isWx()) {
                wx.miniProgram.reLaunch(obj);
            } else {
                this.noApi();
            }
        },
        postMessage: function(obj) {
            if(this.isAli()) {
                my.postMessage(obj);
            } else if(this.isBu()) {
                swan.webView.postMessage(obj);
            } else if(this.isWx()) {
                wx.miniProgram.postMessage(obj);
            } else {
                this.noApi();
            }
        },
        onMessage: function(obj) {
            if(this.isAli()) {
                my.onMessage(obj);
            } else if(this.isBu()) {
                this.noApi();
            } else if(this.isWx()) {
                this.noApi();
            } else {
                this.noApi();
            }
        },
        getEnv: function(obj) {
            if(this.isAli()) {
                my.getEnv(obj);
            } else if(this.isBu()) {
                swan.webView.getEnv(obj);
            } else if(this.isWx()) {
                wx.miniProgram.getEnv(obj);
            } else {
                this.noApi();
            }
        },
        noApi: function() {
            console.log('暂无此api');
        },
        handleUrl: function(obj) {
            var url = obj.url.replace('http://', '').replace('https://', '');
            var query = typeof(obj.query) === 'object' ? obj.query : this.queryToParam(obj.query);
            var config = this.config;
            var configJson;
            // 拿到包含各平台的配置对象
            config.urlMap.some(function(v, i) {
                if(url === v.url) {
                    configJson = v;
                    return true;
                }
            });
            var newJson = {};
            configJson[this.env].query.forEach(function(v, i) {
                if(v) {
                    newJson[v] = query[v];
                }
            });
            return { url: configJson[this.env].url + '?' + this.stringifyURLParam(newJson) }
        },
        stringifyURLParam: function(param) {
            var rstString = '';
            for (var key in param) {
                rstString += `${key}=${param[key]}&`;
            }
            rstString = rstString.substr(0, rstString.length - 1);
            return rstString;
        },
        queryToParam: function(query) {
            const params = {};
            if(/^\?/.test(query)) {
                query = query.slice(1);
            }
            const arr = query.split('&');
            let key, value;
            for (var i = 0; i < arr.length; i++) {
                [key = '', value = ''] = arr[i].split('=');
                // 给对象赋值
                params[key] = value;
            }
            return params;
        },
        addListener: function(eventName, callback) {
            var event = new Event(eventName, callback);
            subscribers.push(event);
            return event;
        },
        removeListener: function(event) {       //event 类型： string || Event || Array
            var rm = function(e) {
                var index = subscribers.indexOf(e);
                if (index != -1) {
                    subscribers.splice(index, 1);
                }
            };
    
            if (typeof event == 'string') {
                subscribers.forEach(function(e,idx) {
                    if (e.eventName == event) {
                        subscribers.splice(idx, 1);
                    }
                });
            } else if (event instanceof Event) {
                rm(event);
            } else if (event instanceof Array) {
                event.forEach(function(e) {
                    EventEmitter.removeListener(e);
                });
            }
        },
        dispatch: function(eventName, param) {
            subscribers.forEach(function(event) {
                if (event.eventName === eventName) {
                    event.callback && event.callback(param);
                }
            });
        },
        lookFunc: function(eventName) {
            let funcArr = [];
            subscribers.forEach(function(event) {
                if (event.eventName === eventName) {
                    funcArr.push(event.callback.toString());
                }
            });
            return funcArr;
        },
        regEnv: function(env, callback) {
            if(callback()) {
                this.env = env;
                this.isRegEnv = true;
            }
        },
        regFunc: function(name, callback) {
            if(this.isRegEnv) {
                this[name] = function(obj, envObj) {
                    callback(envObj);
                }
            }
        }
    }
    function Event(eventName, callback) {
        this.eventName = eventName;
        this.callback = callback;
    }
    
    Event.prototype.removeListener = function() {
        var index = subscribers.indexOf(this);
        if (index != -1) {
            subscribers.splice(index, 1);
        }
    };
    
    XCX.loadJs();

    win.XCX = XCX;
})(window);