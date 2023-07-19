import { Avatar } from "@mui/material";


import moment from 'moment'
import { useNavigate } from "react-router-dom";

function TweetBox(props){
    const navigate = useNavigate()

    return(
        <div className="border p-4 rounded m-4">
            <div className="flex items-center justify-between ">
                
                <div className="flex items-center">
                    <Avatar sx={{mr:2}}>{props.by.toUpperCase().substring(0,1)}</Avatar>
                    <a onClick={()=>{navigate('/profile',{state:props.user})}} className="underline cursor-pointer">@ {props.by}</a>
                </div>
                <p>{moment(props.time).fromNow()}</p>
            </div>
            <div className="mt-4">
                <p className="font-bold">{props.title}</p>
                <p className="mt-2">{props.desc}</p>
            </div>
        </div>
    )
}

export default TweetBox