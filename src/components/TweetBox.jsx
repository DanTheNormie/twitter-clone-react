import { Avatar, Button } from "@mui/material";
import moment from 'moment'
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import Divider from '@mui/material/Divider';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import Tooltip from '@mui/material/Tooltip';
import ModeCommentOutlinedIcon from '@mui/icons-material/ModeCommentOutlined';
import ShareIcon from '@mui/icons-material/Share';
import LoadingButton from '@mui/lab/LoadingButton';



function TweetBox(props){
    const navigate = useNavigate()
    const [loading,setLoading] = useState(false)
    const token = localStorage.getItem('user_token')
    let _likeIcon = <FavoriteBorderIcon/>
    if(props.liked){_likeIcon = <FavoriteIcon/>}
    const [likeIcon, setLikeIcon] = useState(_likeIcon)
    

    async function setLike(){
        
        const options = {
            headers:{'Authorization':`${token}`,"Content-type": "application/json; charset=UTF-8"},
            method:'PATCH'
        }
        options.body = JSON.stringify({
            tweet_id:props._id,
            uid:props.uid
        })
        setLoading(true)
        //console.log(options);
        return fetch('http://localhost:3100/api/tweet/like', options)
        .then((res)=>res.json())
        .then(data =>{
            if(data.success){
                if(data.setLike){
                    setLikeIcon(<FavoriteIcon/>)
                }else{
                    setLikeIcon(<FavoriteBorderIcon/>)
                }
            }
            setLoading(false)
        })
        .catch((err)=>{
            console.log(err);
            setLoading(false)
        })
    }

    return(
        <div className="border p-4 rounded m-4">
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
            <div className=" flex justify-center">
                <LoadingButton className="max-[480px]:!text-[0px]" loading ={loading}
                    loadingPosition="start"
                    onClick={setLike}
                    startIcon={likeIcon}>
                        Like
                </LoadingButton>
                <Divider orientation="vertical" variant="middle" flexItem/>
                <Tooltip title="Feature coming soon..." arrow>
                    <Button variant="standard" className="max-[480px]:!text-[0px]" startIcon={<ModeCommentOutlinedIcon/>}>Comment</Button>
                </Tooltip>
                <Divider orientation="vertical" variant="middle" flexItem/>
                <Tooltip title="Feature coming soon..." arrow>
                    <Button variant="standard" className="max-[480px]:!text-[0px]" startIcon={<ShareIcon/>}>Share</Button>
                </Tooltip>

            </div>
        </div>
    )
}

export default TweetBox