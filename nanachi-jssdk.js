/**
 * 0.01版本
 * 临时支持活动使用
 */
(function(win) {
    var XCX = {
        isAli: function () {
            return navigator.userAgent.indexOf('AlipayClient') > -1;
            // return true;
        },
        isBu: function() {
            return navigator.userAgent.indexOf('baiduboxapp') > -1;
            // return true;
        },
        isWx: function() {
            // return navigator.userAgent.indexOf('MicroMessenger') > -1;
            return true;
        },
        isQuick: function() {
            return (window.system && typeof window.system.go === 'function');
        },
        init: function(cofig) {
            this.config = cofig;
            console.log('init', this);
        },
        env: '',
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
                this.addScript('https://res.wx.qq.com/open/js/jweixin-1.3.2.js');
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
        // webView: null,
        // setWebView: function() {
        //     if(this.isAli()) {
        //         return my;
        //     } else if(this.isBu()) {
        //         return swan.webView;
        //     } else if(this.isWx()) {
        //         console.log(window.wx)
        //         return window.wx.miniProgram;
        //     }  else if(this.isQuick()) {
        //         return system;
        //     } 
        // },
        noApi: function() {
            console.log('暂无此api');
        },
        handleUrl: function(obj) {
            var url = obj.url.replace('http://', '').replace('https://', '');
            var query = typeof(obj.query) === 'object' ? obj.query : this.queryToParam(obj.query);
            var config = this.config;
            var configJson;
            config.urlMap.some(function(v, i) {
                if(url === v.url) {
                    configJson = v;
                    return true;
                }
            });
            // query.forEach(function(v, i) {
                
            // });
            // for(var k in query) {
            //     console.log(query[k])
            // }
            query.keys(function(v, i) {
                console.log(v, i)
            })
            console.log(configJson[this.env], query, 9999)
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
                query = query.slice(1)
            }
            const arr = query.split('&');
            let key, value;
            for (var i = 0; i < arr.length; i++) {
                [key = '', value = ''] = arr[i].split('=');
                // 给对象赋值
                params[key] = value;
            }
            return params;
        }
    }
    XCX.loadJs();

    win.XCX = XCX;
})(window);