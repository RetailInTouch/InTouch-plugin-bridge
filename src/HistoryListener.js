import { Component }        from 'react';

import { withRouter }       from 'react-router-dom';

import { IntouchContext }   from './IntouchProvider';

class HistoryListener extends Component {

    constructor(props, context) {
        super(props);
        
        const intouch = context;
        const { history } = props;

        this.unlisten = history.listen((location, action) => {
            intouch.bridge.changeLocation(location.pathname);
        });
   
        this.listener = intouch.bridge.subscribe('locationPop', (data) => {
            history.goBack();
        });
    }
        
    componentWillUnmount() {
        
        if (this.listener) {
            this.listener.remove();
        }

        this.unlisten();
    }

    render() {
        return this.props.children;
    }
}

HistoryListener.contextType = IntouchContext;

export default withRouter(HistoryListener);
