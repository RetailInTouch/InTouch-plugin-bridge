class IntouchBridge {

    constructor(origin) {

        this.origin = origin;
        this.listeners = {};

        window.addEventListener('message', this.receiveMessage.bind(this));
    }

    clean() {
        window.removeEventListener('message', this.receiveMessage.bind(this));
    }
    
    receiveMessage(event) {
        const { origin, data } = event;

        if (origin !== this.origin && this.origin !== '*') { return; }

        if (data.action) {

            switch (data.action) {

                case 'userData':
                    this.dispatch('userData', data.data)
                    break;

                case 'themeConfig':
                    this.dispatch('themeConfig', data.data)
                    break;

                case 'languageConfig':
                    this.dispatch('languageConfig', data.data)
                    break;

                case 'groups':
                    this.dispatch('groups', data.data)
                    break;

                case 'orgChart':
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

    postMessage(action, data) {

        const payload = {
            action: action,
            ...data
        }

        window.top.postMessage(payload, this.origin);
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

    navigate(path) {

        this.postMessage('navigate', {
            path: path
        });
    }

    setIframeHeight(height) {

        this.postMessage('changeIframeHeight', {
            height: height
        });
    }

}

export default IntouchBridge;