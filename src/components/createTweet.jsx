import { Avatar, Button, TextField, TextareaAutosize } from "@mui/material"
import { useState } from "react";
import { useNavigate } from "react-router-dom";



function CreateTweet(props){
    const token = localStorage.getItem('user_token')
    const navigate = useNavigate()
    function pushTweet(){
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

        console.log(options);
        return fetch('https://twitter-clone-86ay.onrender.com/api/createTweet', options)
        .then((res)=>res.json())
        .then(json =>{
            console.log(json);
            props.fetchTweets()
        })
        .catch((err)=>{console.log(err);})
    }


    return(
        <div className="border rounded h-full p-4">
            <div className="flex justify-between">
                <div className="h-full flex self-center">
                    <Avatar onClick={()=>{navigate('/profile',{state:props.user})}} className="cursor-pointer"  sx={{mr:2}}>{props.username.substring(0,1)}</Avatar>
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
                    <Button variant="contained" onClick={pushTweet}>Tweet</Button>
                </div>   
                
            </div> 
            <div className="justify-center self-end h-full mt-4 flex min-[400px]:hidden">
                <Button variant="contained" onClick={pushTweet}>Tweet</Button>
            </div> 
        </div>
    )
}

export default CreateTweet