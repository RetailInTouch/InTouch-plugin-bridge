import devdata              from './dev-data.json';

class IntouchBridge {

    constructor(origin, iframe=true, debug=false) {

        this.origin = origin;
        this.listeners = {};
        this.iframe = iframe;
        this.debug = debug;

        window.addEventListener('message', this.receiveMessage.bind(this));
    }

    clean() {
        window.removeEventListener('message', this.receiveMessage.bind(this));
    }
    
    receiveMessage(event) {
        const { origin, data } = event;

        if (origin !== this.origin && this.origin !== '*') { 
            this.log('[IntouchBridge] receiveMessage wrong origin:' + origin + ' ' + this.origin);
            return; 
        }

        if (data.action === undefined) {
            return; 
        }

        this.log('[IntouchBridge] receiveMessage ' + data.action , data);

        if (data.action) {

            switch (data.action) {

                case 'userData':
                    if (!this.iframe) { data.data = devdata.user; }
                    this.dispatch('userData', data.data)
                    break;

                case 'themeConfig':
                    this.dispatch('themeConfig', data.data)
                    break;

                case 'languageConfig':
                    if (!this.iframe) { data.data = devdata.language; }
                    this.dispatch('languageConfig', data.data)
                    break;

                case 'groups':
                    if (!this.iframe) { data.data = devdata.userGroups; }
                    this.dispatch('groups', data.data)
                    break;

                case 'orgChart':
                    if (!this.iframe) { data.data = devdata.orgunits; }
                    this.dispatch('orgChart', data.data)
                    break;

                case 'changeIframeHeight':
                    this.dispatch('changeIframeHeight', data)
                    break;

                case 'navigate':
                    this.dispatch('navigate', data)
                    break;

                case 'locationChange':
                    this.dispatch('locationChange', data)
                    break;

                case 'locationPop':
                    this.dispatch('locationPop')
                    break;

                default:
                    break;

            }

        }

    }

    postMessage(action, data=null) {

        const payload = {
            action: action,
            ...data
        }

        this.log('[IntouchBridge] postMessage ' + action, data);

        window.top.postMessage(payload, this.origin);
    }

    log(message, ...args) {
        if (this.debug) {
            console.log(message, args);
        }
    }
    
    subscribe(action, callback) {
        
        if (!Object.prototype.hasOwnProperty.call(this.listeners, action)) {
            this.listeners[action] = [];
        }

        var index = this.listeners[action].push(callback) -1;
        
        return {
            remove: () => {
                delete this.listeners[action][index];
            }
        };
    }

    dispatch(action, data) {
        
        if (!Object.prototype.hasOwnProperty.call(this.listeners, action)) { return; }

        this.listeners[action].forEach(function(callback) {
            callback(data !== undefined ? data : {});
        });
    }


    // Actions

    userData() {
        this.postMessage('userData'); 
    }

    themeConfig() {
        this.postMessage('themeConfig'); 
    }

    languageConfig() {
        this.postMessage('languageConfig'); 
    }

    groups() {
        this.postMessage('groups'); 
    }

    orgChart() {
        this.postMessage('orgChart'); 
    }

    changeLocation(location) {

        this.postMessage('locationChange', {
            location: location
        });

    }

    navigate(page) {

        this.postMessage('navigate', {
            page: page
        });

    }

    setIframeHeight(height) {

        this.postMessage('changeIframeHeight', {
            height: height
        });
    }

}

export default IntouchBridge;