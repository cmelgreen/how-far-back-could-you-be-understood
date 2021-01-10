import { useState } from 'react'

import Box from '@material-ui/core/Box'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import axios from 'axios'

import Typography from '@material-ui/core/Typography'

export default function Input(props) {
    const [text, setText] = useState()
    const [result, setResult] = useState([])

    const api = "https://jbqf671y1e.execute-api.us-west-2.amazonaws.com/how-far-back/first-use"

    const handleClick = () => {
        const words = text.replace(/[^\w\s]/gi, '').split(' ')
        
        axios.get(api, {params: {words: words.join()}})
            .then(resp => {
                console.log(resp.data)
                setResult(resp.data)
                console.log(result)
            })
            .catch(resp => console.log(resp))
    }

    return (
        <Box>
            <TextField id='text-box' value={text} onChange={e => setText(e.target.value)} variant="outlined" multiline rows={4}/>
            <Button id='submit' onClick={handleClick} >Submit</Button>
            {result.map((res, i) => (<Typography key={i}>{res.word}, {res.firstUse}</Typography>))}
        </Box>
    )
}

