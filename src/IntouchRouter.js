import React, { Component } from 'react';

import { BrowserRouter }    from "react-router-dom";

import { IntouchContext }   from './IntouchProvider';

import HistoryListener      from './HistoryListener';

class IntouchRouter extends Component {

    render() {
        const { children } = this.props;

        return (
            <BrowserRouter>
                <HistoryListener>
                    { children }
                </HistoryListener>
            </BrowserRouter>
        );

    }

}

IntouchRouter.contextType = IntouchContext;

export default IntouchRouter;
