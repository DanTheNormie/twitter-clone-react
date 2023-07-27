import { Card } from "@mui/material"
import { Avatar, Button, TextField, TextareaAutosize } from "@mui/material"
import { useEffect, useState, forwardRef, useRef } from "react";
import { useNavigate } from "react-router-dom";
import MuiAlert from '@mui/material/Alert';
import SendIcon from '@mui/icons-material/Send';
import LoadingButton from '@mui/lab/LoadingButton';

import {LOCAL_URL,PROD_URL} from '../../config'

function CreateComment(props){
    //const {username,_id} = props.currentUser
    const [loading, setLoading] = useState(false)
    const token = localStorage.getItem('user_token')

    function commentOnFocusHandler(){
        const comment_btn = document.getElementById('comment_btn')
        comment_btn.className = 'flex justify-end mr-4'
    }

    function commentOnClickHandler(){
        setLoading(true)
        const options = {
            headers:{'Authorization':`${token}`,"Content-type": "application/json; charset=UTF-8"},
            method:'POST'
        }

        console.log(props.article_id);

        options.body = JSON.stringify({
            comment_text:document.getElementById('comment_et').value,
            article_id:props.article_id,
            by:props.uid
        })

        fetch(`${PROD_URL}/api/addComment`,options)
        .then((res)=>res.json())
        .then((data)=>{
            setLoading(false)
            console.log(data);
            props.onCommentCallback()
        }).catch((err)=>{
            setLoading(false)
            console.log(err);
        })
    }

    return(
        <Card variant="standard" className="my-4">
            <div className="flex justify-between">
                <div className="h-full flex self-center">
                    <Avatar 
                        onClick={()=>{navigate('/profile',{state:props.user})}} 
                        className="cursor-pointer"  
                        sx={{mr:2}}>
                        {props.currentUser.username.substring(0,1).toUpperCase()}
                    </Avatar>
                </div>
                <div className="mr-4 w-full">
                <TextField 
                    id="comment_et" 
                    required 
                    variant="standard" 
                    placeholder="write your comment..." 
                    onFocus={commentOnFocusHandler}
                    sx={{width:1/1, mr:2}}>
                </TextField>
                </div>
            </div> 
            <div className='flex justify-end mr-4 hidden' id="comment_btn">
                <LoadingButton
                    loading ={loading}
                    loadingPosition="end"
                    endIcon={<SendIcon />}
                    onClick={commentOnClickHandler}
                    variant="contained">
                    comment
                </LoadingButton>
            </div>  
        </Card>
    )
}

export default CreateComment