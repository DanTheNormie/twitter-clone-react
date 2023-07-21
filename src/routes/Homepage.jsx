import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import CreateTweet from "../components/createTweet";
import TweetBox from "../components/TweetBox";
import { LinearProgress, CircularProgress } from "@mui/material";


function Loading(props){
    if(props.isLoading)return <LinearProgress/>
}



function Homepage(props){
    const [articlesList,setArticlesList] = useState([])
    const [firsttime, setFirstTime] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    const token = localStorage.getItem('user_token')
    const fetchOptions = {headers: {Authorization: token}}
    const navigate = useNavigate()
    const {state} = useLocation()

    function fetchTweets(){
        setIsLoading(true)

        return fetch('https://twitter-clone-86ay.onrender.com/api/getAllTweets', fetchOptions)
       .then(res => res.json())
       .then(json => {
            console.log(json);
            const array = json.data.articlesList
            setArticlesList(array)
            setIsLoading(false)
       })

       
    }

    function handleOnClick(user){

        navigate('/profile', {state:user})
    }

    

    useEffect(()=>{
        fetchTweets()
    },[])

    return(
        <div className="flex flex-col p-8 max-w-7xl">
            <CreateTweet user={state} username={state.username} id={state._id} fetchTweets = {fetchTweets} />    
            <div className="mt-4 border rounded">
                <Loading isLoading = {isLoading}/>
                {articlesList.map((article, idx)=>{
                    return <TweetBox key={article._id} user={article.author} by={article.author.username} title={article.title} desc={article.desc} time={article.createdAt}></TweetBox>
                })}
            </div>
            
        </div>
        
    )
}

export default Homepage