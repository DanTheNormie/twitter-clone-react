import { Button, TextField, OutlinedInput, InputAdornment, IconButton, FormControl, InputLabel, Icon} from "@mui/material"
import EditIcon from '@mui/icons-material/Edit';
import {Visibility,VisibilityOff} from '@mui/icons-material';
import { useEffect, useState, forwardRef, useRef } from "react"
import { useNavigate, useLocation } from "react-router-dom";
import TweetBox from "../components/TweetBox";
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function Profile(props){
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const [disabled,setDisabled] = useState(false)
    const [usernameHelper,setUsernameHelper] = useState('Username')
    const [ageHelper,setAgeHelper] = useState('Age')
    const {state} = useLocation()
    const token = localStorage.getItem('user_token')
    const [articlesList,setArticlesList] = useState([])
    const [open, setOpen] = useState(false)
    let status_msg= useRef('')
    let alert_style = useRef('')

    function loadUsersTweets(){
        const options = {headers:{Authorization:token}}
        return fetch(`https://twitter-clone-86ay.onrender.com/api/users/${state._id}/tweets`,options)
       .then(res => res.json())
       .then(json => {
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
        
        fetch(`https://twitter-clone-86ay.onrender.com/api/users/${state._id}`, options)
        .then(res => res.json())
        .then(data=>{
            if(data.success){
                alert_style.current = 'success'
                status_msg.current = 'updated user details successfully'
            }else{
                alert_style.current= 'error'
                status_msg.current = 'Couldn\'t update user detials'
            }
            setOpen(true)
            console.log(data);
        }).catch((err)=>{
            alert_style.current='error'
            status_msg.current ='something went wrong :('
            setOpen(true)
            console.log(err);
        })
        
    }

    return(
        <div className="flex flex-col justify-center m-4" >

        <Snackbar
            anchorOrigin={{ vertical:'top', horizontal:'center' }}
            open={open}
            autoHideDuration={6000}
            onClose={() => {setOpen(false);}}
            key='Tweet status'>
                <Alert onClose={() => {setOpen(false);}} severity={alert_style.current} sx={{ width: '100%' }}>
                    {status_msg.current}
                </Alert>
        </Snackbar>

            <form className='flex flex-col justify-center items-center border w-full p-8 rounded-xl bg-slate-200'>
                <div className="flex w-full justify-between items-center mb-4">
                    <h1 className="text-3xl  font-bold">User Details</h1>
                    <IconButton onClick={()=>{setDisabled(!disabled)}} className="ml-3"><EditIcon></EditIcon></IconButton>
                </div>
                
                <TextField className="w-full" id='email' disabled label='Email' value={state.email} type="email" variant="outlined" sx={{m:2}}></TextField>
                <TextField className="w-full" id='username' label={usernameHelper} disabled={disabled} variant="outlined" defaultValue={state.username}  sx={{m:2}}></TextField>
                <TextField className="w-full" id='age' label={ageHelper} disabled={disabled} variant="outlined" defaultValue={state.age}  sx={{m:2}}></TextField>
                
                <Button variant="contained" onClick={onEditSubmitClick} disabled={disabled} sx={{m:4}}>Edit</Button>
            </form>
            
        
            
            <div className="mt-4 border rounded">
                <p className="text-center font-bold text-5xl my-8">Tweets</p>
                {articlesList.map((article, idx)=>{
                    let postLiked = false
                    if(article.likedBy.includes(state._id)){
                        postLiked = true
                    }
                    return <TweetBox 
                        liked={postLiked}
                        user={article.author} 
                        by={article.author.username} 
                        title={article.title} 
                        desc={article.desc} 
                        time={article.createdAt} 
                        _id = {article._id}
                        uid={state._id} 
                        currentUser={{username:'Daniel',createdAt:"2018-07-03"}}>
                            
                    </TweetBox>
                })}
            </div>
        </div>
    )
}

export default Profile