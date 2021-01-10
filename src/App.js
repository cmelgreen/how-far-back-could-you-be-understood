import CssBaseline from '@material-ui/core/CssBaseline'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'

import Input from './Components/Input/Input'

//import Results from './Components/Results'

function App() {
  return (
    <CssBaseline>
      <Box>
        <Typography>You could probably understand Shakespeare, but would he be able to understand you?</Typography>
        <Typography>Use Merriam-Webster's first recorded usage to see how far back your words and ideas could be understood</Typography>
      </Box>
      <Input />
    </CssBaseline>
  );
}

export default App;
