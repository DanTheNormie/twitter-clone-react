import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import CreateTweet from "../components/createTweet";
import TweetBox from "../components/TweetBox";




function Homepage(props){
    const [articlesList,setArticlesList] = useState([])
    const [firsttime, setFirstTime] = useState(true)
    const token = localStorage.getItem('user_token')
    const fetchOptions = {headers: {Authorization: token}}
    const navigate = useNavigate()
    const {state} = useLocation()
    console.log(state);

    function fetchTweets(){
        
        return fetch('https://twitter-clone-86ay.onrender.com/api/getAllTweets', fetchOptions)
       .then(res => res.json())
       .then(json => {
            console.log(json);
            const array = json.data.articlesList
            setArticlesList(array)
       })
    }

    function handleOnClick(user){

        navigate('/profile', {state:user})
    }

    

    useEffect(()=>{
        fetchTweets()
    },[firsttime])

    return(
        <div className="flex flex-col p-8 max-w-7xl">
            <CreateTweet user={state} username={state.username} id={state._id} />    
            <div className="mt-4 border rounded">
                {articlesList.map((article, idx)=>{
                    return <TweetBox user={article.author} by={article.author.username} title={article.title} desc={article.desc} time={article.createdAt}></TweetBox>
                })}
            </div>
            
        </div>
        
    )
}

export default Homepage