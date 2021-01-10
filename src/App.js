import CssBaseline from '@material-ui/core/CssBaseline'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'

import Input from './Components/Input/Input'

//import Results from './Components/Results'

function App() {
  const theme = createMuiTheme({
    root: {
      margin: "10%",
      textAlign: "center"
    },
    palette: {
      type: 'light',
      primary: {
        main: '#FFF',
      },
      secondary: {
        main: '#fe5b25',
      },
      textPrimary: {
        main: '#000',
      },
    },
    typography: {
      //fontFamily: 'Karla',
      //fontFamily: 'Vollkorn',
      //fontFamily: 'Lora',
      fontFamily: 'Frank Ruhl Libre',
      fontSmoothing: 'antialiased',
      justifyText: "center"
    },
  });
  return (
    <CssBaseline>
      <ThemeProvider theme={theme}>
        <Box align="center" margin="10%">
          <Typography variant="h4">You could probably understand Shakespeare, but would he be able to understand you?</Typography>
          <Typography variant="h5">Use Merriam-Webster's first recorded usage to see how far back your words and ideas could be understood</Typography>
          <Box margin="5%"><Input/></Box>
        </Box>
      </ThemeProvider>
    </CssBaseline>
  );
}

export default App;
