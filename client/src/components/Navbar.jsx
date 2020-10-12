import React,{useContext} from 'react'
import { NavLink,useHistory } from 'react-router-dom'
import {userContext} from '../App'

function Navbar() {
    const {state,dispatch} = useContext(userContext)
    const history = useHistory()
    const renderList = () =>{
        if(state){
            return [
                <>
                <li className="nav-item">
                <NavLink exact to="/profile" className="nav-link" >Profile</NavLink>
            </li>
            <li className="nav-item">
                <NavLink exact to="/createpost" className="nav-link" >CreatePost</NavLink>
            </li>
            <li className="nav-item">
                <NavLink exact to="/myfollowingposts" className="nav-link" >following posts</NavLink>
            </li>
            <li className="nav-item mt-2" >
            <button type="button" className="btn btn-outline-dark"
            onClick={()=>{
                localStorage.clear()
                dispatch({type:"CLEAR"})
                history.push('/signin')
            }}
            >Logout</button>
            </li>
            </>
            ]
        }else{
            return [
                <>
                 <li className="nav-item">
                    <NavLink exact to="/signup" className="nav-link" >SignUp</NavLink>
                </li>
                <li className="nav-item">
                    <NavLink exact to="/signin" className="nav-link" >SignIn</NavLink>
                </li>
                </>
            ]

        }
    }

    return (
       <>
       <nav className="navbar navbar-expand-lg navbar-light bg-light">
           <div className="container navbar_style">
               <NavLink to={state?"/":"/signin"} className="brand_style " style={{fontWeight:"800",fontSize:"40px"}}>Pixter</NavLink> 
               {/* brand name ---> pixter */}
               <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                
                <div className=" collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav ml-auto" >
                        {renderList()}
                    </ul>
                </div>
           </div>
       </nav>
       </>
    )
}

export default Navbar
