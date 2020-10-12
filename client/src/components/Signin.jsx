import React, { useState,useContext } from 'react'
import {Link,useHistory} from 'react-router-dom'
import {userContext} from '../App'
import {toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

function Signin() {
    const {state,dispatch} = useContext(userContext)
    const history = useHistory()
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("")

    const postData = (e) =>{
        fetch('/signin',{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                email,
                password
            })
        }).then(res=>res.json())
        .then(data=>{
            if(data.error){
              toast.error(data.error)  
            }
            else{
                localStorage.setItem("jwt",data.token)
                localStorage.setItem("user",JSON.stringify(data.user))
                dispatch({type:"USER",payload:data.user})
                toast.success("Happy login")
                history.push("/")
            }
        }).catch(err=>{
            console.log(err)
        })

        e.preventDefault()
    }



    return (
        <div className="signin d-flex justify-content-center align-items-center">
        <div className=" signin_style">
           <form onSubmit= {(e)=>{postData(e)}}>
                <div className="mb-3">
                    <label  className="form-label">Email address</label>
                    <input type="email" 
                    className="form-control" 
                    id="exampleInputEmail1" 
                    value={email}
                    onChange={(e)=>{setEmail(e.target.value)}}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input 
                    type="password" 
                    className="form-control" 
                    id="exampleInputPassword1"
                    value={password}
                    onChange={(e)=>{setPassword(e.target.value)}}
                    />
                </div>
                
                <button 
                type="submit" 
                className="btn btn-primary">
                    Login
                </button>
                <br/>

                  <div className="d-flex">
                    <h5>Don't have an account?</h5>
                    <span className="ml-1">
                        <Link to="/signup">Signup</Link>
                    </span>
                  </div>
                
                </form>
        </div>
    </div>
    )
}

export default Signin
