import React, { Component } from 'react';

import { 
  IntouchProvider,
  IntouchRouter 
}                           from 'intouch-plugin-bridge'

class App extends Component {

    constructor(props) {
        super(props);

        this.config = {
            api: 'abc',
            origin: '*'
        }

    }

    onBeforeLift = async ({preferredLanguage}) => {
  
    }

    render() {
        return (
            <IntouchProvider 
                config={this.config}
                onBeforeLift={this.onBeforeLift}
            >
                <IntouchRouter>

                  <div>Code here</div>
 
                </IntouchRouter>
            </IntouchProvider>
        );
    }

}

export default App;
