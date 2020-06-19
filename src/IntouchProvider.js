import React, { Component } from 'react';

import { 
    MuiThemeProvider 
}                           from '@material-ui/core/styles';
import CssBaseline          from '@material-ui/core/CssBaseline';
import CircularProgress     from '@material-ui/core/CircularProgress';

import IntouchBridge        from './IntouchBridge';
import createIntouchTheme   from './IntouchTheme';

import devdata              from './dev-data.json';

const inIframe = () => {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
}

class IntouchProvider extends Component {

    constructor(props) {
        super(props);

        const { api, origin } = props.config;

        this.bridge = new IntouchBridge(origin);

        const iframe = inIframe();

        this.state = {
            loading: true,

            api: api,
            bridge: this.bridge,

            theme: null,
            user: (iframe ? null : devdata.user),
            language: (iframe ? null : devdata.language),
            userGroups: (iframe ? null : devdata.userGroups),
            orgunits: (iframe ? null : devdata.orgunits),
        }

        this.userDate_listener = this.bridge.subscribe('userData', this.onUserData);
        this.bridge.userData();

        this.themeConfig_listener = this.bridge.subscribe('themeConfig', this.onThemeConfig);
        this.bridge.themeConfig();

        this.languageConfig_listener = this.bridge.subscribe('languageConfig', this.onLanguageConfig);
        this.bridge.languageConfig();

        this.groups_listener = this.bridge.subscribe('groups', this.onGroups);
        this.bridge.groups();

        this.orgChart_listener = this.bridge.subscribe('orgChart', this.onOrgChart);
        this.bridge.orgChart();

    }

    componentWillUnmount() {
        if (this.userDate_listener) {
            this.userDate_listener.remove();
        }

        if (this.themeConfig_listener) {
            this.themeConfig_listener.remove();
        }

        if (this.languageConfig_listener) {
            this.languageConfig_listener.remove();
        }

        if (this.groups_listener) {
            this.groups_listener.remove();
        }

        if (this.orgChart_listener) {
            this.orgChart_listener.remove();
        }
    }

    onUserData = (user) => {
        this.setState({ user: user }, this.checkLoading);
    }

    onThemeConfig = (theme) => {
        this.setState({ theme: createIntouchTheme(theme) }, this.checkLoading);
    }

    onLanguageConfig = (language) => {
        this.setState({ 
            language: (Object.keys(language).length === 0 ? ['nl'] : language.availableLanguages) 
        }, this.checkLoading);
    }

    onGroups = (userGroups) => {
        this.setState({ userGroups: userGroups }, this.checkLoading);
    }

    onOrgChart = (orgunits) => {
        this.setState({ orgunits: orgunits }, this.checkLoading);
    }

    checkLoading = () => {
        const { onBeforeLift=null } = this.props;
        const { user, theme, language, userGroups, orgunits, loading } = this.state;

        const new_loading = !(user !== null && theme !== null && language !== null && userGroups !== null && orgunits !== null )

        if (onBeforeLift !== null && new_loading !== loading) {
            Promise.resolve(onBeforeLift(user)).finally(() => {
                this.setState({ loading: new_loading});
            });
        } else if (new_loading !== loading) {
            this.setState({ loading: new_loading});
        }

    }

    render() {
        const { children } = this.props;
        const { loading, theme, bridge, user, userGroups, orgunits, language } = this.state; 

        return (
            <IntouchContext.Provider value={{
                bridge: bridge,
                user: user,
                userGroups: userGroups,
                orgunits: orgunits,
                languages: (language === null ? null : language)
            }}>
                <CssBaseline />
                {
                    loading
                    ?
                        <div style={{display: 'flex', height:'100%', alignItems: 'center', justifyContent: 'center', backgroundColor: '#efefef'}}><CircularProgress /></div>
                    :
                        <MuiThemeProvider theme={theme}>
                            {
                                children
                            }
                        </MuiThemeProvider>
                }
           
            </IntouchContext.Provider>
        );
    }

}

const IntouchContext = React.createContext({});

export { IntouchContext, IntouchProvider };