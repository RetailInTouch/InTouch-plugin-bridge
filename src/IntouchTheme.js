import _                    from 'lodash';

import { 
    createMuiTheme 
}                           from '@material-ui/core/styles';

import { 
    createTheme,
    themeSettings  
}                           from './configuration/theme.config';


export default function createIntouchTheme(customSettings) {

    return createMuiTheme(createTheme(_.merge(themeSettings, customSettings)));
};
