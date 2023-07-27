import { Avatar, Button, Card, Collapse } from "@mui/material";
import moment from 'moment'
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useRef } from "react";
import Divider from '@mui/material/Divider';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import Tooltip from '@mui/material/Tooltip';
import ModeCommentOutlinedIcon from '@mui/icons-material/ModeCommentOutlined';
import ShareIcon from '@mui/icons-material/Share';
import LoadingButton from '@mui/lab/LoadingButton';
import CommentBox from "./CommentBox";
import CreateComment from "./createComment";
import {LOCAL_URL,PROD_URL} from '../../config'



function TweetBox(props){
    const navigate = useNavigate()
    const [likeLoading,setLikeLoading] = useState(false)
    const [commentLoading,setCommentLoading] = useState(false)
    const token = localStorage.getItem('user_token')
    let _likeIcon = <FavoriteBorderIcon/>
    if(props.liked){_likeIcon = <FavoriteIcon/>}
    const [likeIcon, setLikeIcon] = useState(_likeIcon)
    const [expanded, setExpanded] = useState(false)
    let [comments,setComments] = useState([])
    const [createCommentExpanded, setCreateCommentExpanded] = useState(false)
    

    async function setLike(){
        
        const options = {
            headers:{'Authorization':`${token}`,"Content-type": "application/json; charset=UTF-8"},
            method:'PATCH'
        }
        options.body = JSON.stringify({
            tweet_id:props._id,
            uid:props.uid
        })
        setLikeLoading(true)
        //console.log(options);
        return fetch('https://twitter-clone-86ay.onrender.com/api/tweet/like', options)
        .then((res)=>res.json())
        .then(data =>{
            if(data.success){
                if(data.setLike){
                    setLikeIcon(<FavoriteIcon/>)
                }else{
                    setLikeIcon(<FavoriteBorderIcon/>)
                }
            }
            setLikeLoading(false)
        })
        .catch((err)=>{
            console.log(err);
            setLikeLoading(false)
        })
    }


    const onCommentCallback = ()=>{
        const options = {
            headers:{'Authorization':`${token}`,"Content-type": "application/json; charset=UTF-8"},
            method:'POST'
        }
        options.body = JSON.stringify({
            article_id:props._id
        })
        setCommentLoading(true)
        fetch(`${PROD_URL}/api/getTweetComments`,options)
            .then((res)=>res.json())
            .then(data=>{
                console.log(data);
                if(data.success){
                    if(data.data.length>0) {setComments(data.data);}
                    setExpanded(true)
                }else{
                }
                setCommentLoading(false)
            }).catch((err)=>{
                console.log(err);
                setCommentLoading(false)
            })
    }

    function commentOnClickHandler(){
        
        if(expanded){
            setExpanded(false)
            setCreateCommentExpanded(false)
        } 
        else{
            setCreateCommentExpanded(true)
            onCommentCallback()
        }
    }

    return(
        <Card className="border p-4 rounded m-4">
            <div className="flex items-center justify-between ">
                
                <div className="flex items-center">
                    <Avatar sx={{mr:2}}>{props.by.toUpperCase().substring(0,1)}</Avatar>
                    <a onClick={()=>{navigate('/profile',{state:props.user})}} className="underline cursor-pointer">@ {props.by}</a>
                </div>
                <p>{moment(props.time).fromNow()}</p>
            </div>
            <div className="mt-4 px-12">
                <p className="font-bold">{props.title}</p>
                <p className="mt-2">{props.desc}</p>
            </div>
            <Divider className="!my-4" variant="middle"  />
            <div className=" flex justify-around">
                <LoadingButton className="max-[480px]:!text-[0px]" loading ={likeLoading}
                    loadingPosition="start"
                    onClick={setLike}
                    startIcon={likeIcon}>
                        Like
                </LoadingButton>
                <Divider orientation="vertical" variant="middle" flexItem/>
                
                <LoadingButton 
                    className="max-[480px]:!text-[0px]" 
                    loadingPosition="start"
                    loading={commentLoading}
                    startIcon={<ModeCommentOutlinedIcon/>} 
                    onClick={commentOnClickHandler}>
                        Comment
                </LoadingButton>
                
                <Divider orientation="vertical" variant="middle" flexItem/>
                <Tooltip title="Feature coming soon..." arrow>
                    <Button variant="standard" className="max-[480px]:!text-[0px]" startIcon={<ShareIcon/>}>Share</Button>
                </Tooltip>

            </div>
            <Collapse in={createCommentExpanded}>
                <CreateComment currentUser={props.currentUser} uid = {props.uid} article_id={props._id} onCommentCallback = {onCommentCallback} />
            </Collapse>

            <Collapse in={expanded}>
                <h1 className="text-center text-xl m-4">Comments</h1>
                {(comments.length < 1) && <p className="text-center">No comments for this post yet.</p>}
                {(comments.length > 0) && comments.map(comment => {
                    return <CommentBox key={comment._id} username={comment.by.username} createdAt={comment.createdAt} text={comment.text}/>
                })}
            </Collapse>
        </Card>
    )
}

export default TweetBox