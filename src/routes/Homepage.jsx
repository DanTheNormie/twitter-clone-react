import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, forwardRef, useRef } from "react";
import CreateTweet from "../components/createTweet";
import TweetBox from "../components/TweetBox";
import { LinearProgress, CircularProgress, Button } from "@mui/material";
import Snackbar from '@mui/material/Snackbar';
import Slide from '@mui/material/Slide';
import MuiAlert from '@mui/material/Alert';



function Loading(props){
    if(props.isLoading)return <LinearProgress/>
}

const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});




function Homepage(props){
    const [articlesList,setArticlesList] = useState([])
    const [firsttime, setFirstTime] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    const token = localStorage.getItem('user_token')
    const fetchOptions = {headers: {Authorization: token}}
    const navigate = useNavigate()
    const {state} = useLocation()
    const [open, setOpen] = useState(false)
    let status_msg= useRef('')
    let alert_style = useRef('error')

    const statusCallback = (tweetStatusMessage, alertStyle)=>{
        status_msg.current = tweetStatusMessage
        alert_style.current = alertStyle
        console.log(status_msg, alert_style);
        setOpen(true)
    }

    function fetchTweets(){
        setIsLoading(true)

        return fetch('https://twitter-clone-86ay.onrender.com/api/getAllTweets', fetchOptions)
       .then(res => res.json())
       .then(json => {
            if(json.success){
                console.log(json);
                const array = json.data.articlesList
                setArticlesList(array)
                setIsLoading(false)
            }else{
                if(json.message == 'Please Login to resolve this error.'){
                    navigate('/')
                }
                setIsLoading(false)
                statusCallback(json.message,'error')
            }
           
       })
       .catch((err=>{
            console.log(err);
            statusCallback(err.message || 'Backend is Down', 'error')
            setIsLoading(false)
        }))

       
    }

    useEffect(()=>{
        fetchTweets()
    },[])

    return(
        <>
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
        
        <div className="flex flex-col p-8 max-w-7xl">
            <CreateTweet user={state} username={state.username} id={state._id} fetchTweets={fetchTweets} OnTweetSentcallback={statusCallback}  />    
            <div className="mt-4 border rounded">
                <Loading isLoading = {isLoading}/>
                {articlesList.map((article, idx)=>{
                    let postLiked = false
                    if(article.likedBy.includes(state._id)){
                        postLiked = true
                    }
                    return <TweetBox 
                    key={article._id} 
                    liked = {postLiked} 
                    user={article.author} 
                    by={article.author.username || ''} 
                    title={article.title} 
                    desc={article.desc} 
                    time={article.createdAt} 
                    _id={article._id} 
                    uid={state._id} 
                    currentUser={{username:state.username,_id:state._id}}></TweetBox>
                })}

                {!articlesList && <h1>.... * cricket noises * ....</h1>}
            </div>
            
        </div>
        </>
    )
}

export default Homepage