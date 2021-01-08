import { useState } from 'react'

import Box from '@material-ui/core/Box'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'

export default function Input(props) {
    const [text, setText] = useState()

    const handleClick = () => {
        
    }

    return (
        <Box>
            <TextField value={text} onChange={e => setText(e.target.value)} variant="outlined" multiline rows={4}/>
            <Button onClick={handleClick} />
        </Box>
    )
}
