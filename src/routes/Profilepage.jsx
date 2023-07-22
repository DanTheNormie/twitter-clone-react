import { Button, TextField, OutlinedInput, InputAdornment, IconButton, FormControl, InputLabel, Icon} from "@mui/material"
import EditIcon from '@mui/icons-material/Edit';
import {Visibility,VisibilityOff} from '@mui/icons-material';
import { useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom";
import TweetBox from "../components/TweetBox";


function Profile(props){
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const [disabled,setDisabled] = useState(true)
    const [usernameHelper,setUsernameHelper] = useState('Username')
    const [ageHelper,setAgeHelper] = useState('Age')
    const {state} = useLocation()
    const token = localStorage.getItem('user_token')
    const [articlesList,setArticlesList] = useState([])

    console.log(state);

    function loadUsersTweets(){
        const options = {headers:{Authorization:token}}
        return fetch(`https://twitter-clone-86ay.onrender.com/api/users/${state._id}/tweets`,options)
       .then(res => res.json())
       .then(json => {
            console.log(json);
            const array = json.data
            setArticlesList(array)
       })
    }

    useEffect(()=>{
        loadUsersTweets()
    },[])

    async function onEditSubmitClick(){

        const username =  document.getElementById('username').value
        const age = document.getElementById('age').value
        
        const options = {
            headers:{'Authorization':`${token}`,"Content-type": "application/json; charset=UTF-8"},
            method:'PATCH'
        }
        options.body = JSON.stringify({
            _id:state._id,
            username,
            age
        })

        console.log(options);
        let res = await fetch(`https://twitter-clone-86ay.onrender.com/api/users/${state._id}`, options)
        res = await res.json()
        console.log(res)
    }

    return(
        <div >
        <div className="border rounded flex flex-col justify-center">
            <form className='flex flex-col items-center border w-fit p-8 m-4 rounded-xl bg-slate-200'>
                <div className="flex w-full justify-between items-center mb-4">
                    <h1 className="text-3xl  font-bold">User Details</h1>
                    <IconButton disabled = {disabled} onClick={()=>{setDisabled(!disabled)}} className="ml-3"><EditIcon></EditIcon></IconButton>
                </div>
                
                <TextField className="w-full" id='email' disabled label='Email' value={state.email} type="email" variant="outlined" sx={{m:2}}></TextField>
                <TextField className="w-full" id='username' label={usernameHelper} disabled={disabled} variant="outlined" defaultValue={state.username}  sx={{m:2}}></TextField>
                <TextField className="w-full" id='age' label={ageHelper} disabled={disabled} variant="outlined" defaultValue={state.age}  sx={{m:2}}></TextField>
                
                <Button variant="contained" onClick={onEditSubmitClick} disabled={disabled} sx={{m:4}}>Edit</Button>
            </form>
            
        </div>
        <p className="text-center font-bold text-5xl my-8">Tweets</p>
        <div className="mt-4 border rounded">
            {articlesList.map((article, idx)=>{
                return <TweetBox user={article.author} by={article.author.username} title={article.title} desc={article.desc} time={article.createdAt}></TweetBox>
            })}
        </div>
        </div>
    )
}

export default Profile