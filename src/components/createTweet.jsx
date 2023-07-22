import { Avatar, Button, TextField, TextareaAutosize } from "@mui/material"
import { useEffect, useState, forwardRef, useRef } from "react";
import { useNavigate } from "react-router-dom";
import MuiAlert from '@mui/material/Alert';
import SendIcon from '@mui/icons-material/Send';
import LoadingButton from '@mui/lab/LoadingButton';

const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function CreateTweet(props){
    const token = localStorage.getItem('user_token')
    const navigate = useNavigate()
    const [loading,setLoading] = useState(false)
   


    async function pushTweet(){
        console.log('reached here');
        const title =  document.getElementById('tweet_title').value
        const desc = document.getElementById('tweet_desc').value
        
        const options = {
            headers:{'Authorization':`${token}`,"Content-type": "application/json; charset=UTF-8"},
            method:'POST'
        }
        options.body = JSON.stringify({
            title,
            desc,
            _id:props.id
        })
        setLoading(true)

        console.log(options);
        return fetch('https://twitter-clone-86ay.onrender.com/api/createTweet', options)
        .then((res)=>res.json())
        .then(data =>{
            console.log(data);
            if(data.success){
                props.OnTweetSentcallback('Tweet Sent Successfully 👍','success')
                props.fetchTweets()
            }else{
                props.OnTweetSentcallback(data.msg,'error')
            }
            setLoading(false)
            
        })
        .catch((err)=>{
            console.log(err);
            props.OnTweetSentcallback(err.msg,'error')
            setLoading(false)
        })
    }


    return(
        <div className="border rounded h-full p-4">
            <div className="flex justify-between">
                <div className="h-full flex self-center">
                    <Avatar onClick={()=>{navigate('/profile',{state:props.user})}} className="cursor-pointer"  sx={{mr:2}}>{props.username.substring(0,1).toUpperCase()}</Avatar>
                </div>
                <div className="mr-4 w-full">
                <TextField 
                    id="tweet_title" 
                    required 
                    variant="standard" 
                    placeholder="Tweet Title" 
                    sx={{width:1/1, mr:2}}>
                </TextField>
                <TextField id='tweet_desc' required variant="standard" placeholder="Tweet Description" sx={{width:1/1, mr:2}}></TextField>
                </div>
                <div className="justify-center self-end h-full flex max-[400px]:hidden">
                <LoadingButton
                    loading ={loading}
                    loadingPosition="end"
                    endIcon={<SendIcon />}
                    onClick={pushTweet}
                    variant="contained">
                    Tweet
                </LoadingButton>
                </div>   
                
            </div> 
            <div className="justify-center self-end h-full mt-4 flex min-[400px]:hidden">
                <Button variant="contained" onClick={pushTweet}>Tweet</Button>
            </div> 
        </div>
    )
}

export default CreateTweet