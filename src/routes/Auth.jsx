import { Button, TextField, OutlinedInput, InputAdornment, IconButton, FormControl, InputLabel} from "@mui/material"
import {Visibility,VisibilityOff} from '@mui/icons-material';
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";


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


function Auth(props){
    const navigate = useNavigate()
    const [isLogin,setIsLogin] = useState(props.isLogin)
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(false)
    const [err_msg, setErr_msg] = useState('')
    const [username_value, setUsername_value] = useState('')

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
        fetch(`https://twitter-clone-86ay.onrender.com/auth/${url}`, requestOptions)
            .then(response => response.json())
            .then(data => {

                if(data.success){
                    localStorage.setItem('user_token',data.data.token)
                    navigate('/home', {state:data.data.user})
                }else{
                    setErr_msg(data.msg)
                    setError(true)
                    console.log(data);
                }
                
            })
            .catch((err)=>{console.log(err);});
        
    }
    
    function switchAuth(){
        setIsLogin(!isLogin)
        setErr_msg('')
    }
  
    const handleMouseDownPassword = (event) => {
      event.preventDefault();
    };
    return(
        <form onSubmit={handleSubmit} className='flex flex-col items-center border w-fit p-8 m-4 rounded-xl bg-slate-200'>
            <h1 className="text-3xl mb-4 font-bold">{isLogin ? 'Login' : 'Register'}</h1>
            <ShowError err_msg= {err_msg}/>
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
            <Button variant="contained" sx={{m:4}} type="submit" >submit</Button>
            <a className="underline cursor-pointer" onClick={()=>{setIsLogin(!isLogin)}}>{!isLogin ? 'Already a user ?' : 'New user ?'}</a>
        </form>
    )
}


export default Auth