import { Button, TextField, OutlinedInput, InputAdornment, IconButton, FormControl, InputLabel, LinearProgress} from "@mui/material"
import {Visibility,VisibilityOff} from '@mui/icons-material';
import { useEffect, useState, useRef, forwardRef } from "react"
import { useNavigate } from "react-router-dom";
import Snackbar from '@mui/material/Snackbar';
import Slide from '@mui/material/Slide';
import MuiAlert from '@mui/material/Alert';


const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function ShowUsername(props){
    if(!props.isLogin){
        return(
            <TextField id='username' defaultValue={props.value} label='Username' variant="outlined" required sx={{m:2}}></TextField>
        )
    }
}

function ShowError(props){
    if(props.err_msg){
        return <p className="text-red-500">{props.err_msg}</p>
    }
}

function ShowLoading(props){
    if(props.isLoading){
        return 
    }
    
}


function Auth(props){
    const navigate = useNavigate()
    const [isLogin,setIsLogin] = useState(props.isLogin)
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    let err_msg= useRef('')
    let alert_style = useRef('')
    const [username_value, setUsername_value] = useState('')
    const [open,setOpen] = useState(false)
    const [transition,setTransition] = useState(undefined)

    const handleClickShowPassword = () => {setShowPassword((show) => !show);};

    const handleSubmit = (e)=>{
        e.preventDefault()
        let url = 'login'
        let data = {
            email : e.target.email.value,
            password : e.target.password.value,
            
        }
        if(!isLogin){
            url = "register"
            data.username = e.target.username.value
        }

        console.log(data);
        
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        };
        setIsLoading(true)
        fetch(`https://twitter-clone-86ay.onrender.com/auth/${url}`, requestOptions)
            .then(response => response.json())
            .then(data => {

                if(data.success){
                    localStorage.setItem('user_token',data.data.token)
                    err_msg.current = data.msg
                    alert_style.current = 'success'
                    setOpen(true)
                    navigate('/home', {state:data.data.user})
                }else{
                    err_msg.current = data.msg
                    alert_style.current = 'error'
                    setOpen(true)
                    console.log(data);
                }
                setIsLoading(false)
            })
            .catch((err)=>{
                err_msg.current = data.messsage || 'Backend is Down 🥲'
                alert_style.current = 'error'
                setIsLoading(false)
                setOpen(true)
                console.log(err);});
        
    }
    
    function switchAuth(){
        setIsLogin(!isLogin)
        setErr_msg('')
    }
  
    const handleMouseDownPassword = (event) => {
      event.preventDefault();
    };

    function TransitionDown(props) {
        return <Slide {...props} direction="down" />;
    }

    const handleClick = (Transition) => () => {
        setTransition(() => Transition);
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    return(

        <>
        <Snackbar
            anchorOrigin={{ vertical:'top', horizontal:'center' }}
            open={open}
            autoHideDuration={6000}
            onClose={handleClose}
            
            message="I love snacks"
            key='auth err'>
                <Alert onClose={handleClose} severity={alert_style.current} sx={{ width: '100%' }}>
                    {err_msg.current}
                </Alert>
        </Snackbar>
        
        

        <form onSubmit={handleSubmit} className='flex z-[1] relative flex-col items-center border px-8 mx-4 mt-[20vh] rounded-xl bg-slate-200'>
            {isLoading && <LinearProgress className='!absolute rounded-t-full top-0  w-[98%]'/>}
            <h1 className="text-3xl my-4 font-bold">{isLogin ? 'Login' : 'Register'}</h1>
            <ShowUsername isLogin={isLogin} value={username_value}/>
            <TextField id='email' label='Email' type="email" variant="outlined" required sx={{m:2}}></TextField>
            <FormControl sx={{ mt: 2, width: '25ch' }} variant="outlined" required>
                <InputLabel htmlFor="password">Password</InputLabel>
                <OutlinedInput
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                        >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </InputAdornment>
                    }
                    label="Password"
                />
            </FormControl>
            <Button variant="contained" sx={{m:4}} type="submit">submit</Button>
            <a className="underline cursor-pointer mb-4" onClick={()=>{setIsLogin(!isLogin)}}>{!isLogin ? 'Already a user ?' : 'New user ?'}</a>
        </form>
        </>
    )
}


export default Auth