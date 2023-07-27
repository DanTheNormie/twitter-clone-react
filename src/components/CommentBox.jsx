import { Avatar, Card, Divider } from "@mui/material"
import moment from 'moment'

function CommentBox(props){
    return(
    <Card className="my-4 mx-4" variant="standard">
        
        <div className="flex items-start justify-between ">
            <Avatar sx={{mr:2}}>{props.username.toUpperCase().substring(0,1)}</Avatar>
            
                <div className="flex items-start w-full flex-col justify-between">
                    <div className="flex">
                        <a onClick={()=>{navigate('/profile',{state:props.user})}} className="underline cursor-pointer">@{props.username}</a>
                        <p className="ml-4 opacity-70">{moment(props.createdAt).fromNow()}</p>
                    </div>
                    
                    <p className="">{props.text}</p> 
                </div>                
        </div>
        <br />
        <Divider></Divider>
    </Card>
    )
}

export default CommentBox