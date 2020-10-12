import React,{useEffect,useContext} from 'react'
import { useState } from 'react';
import '../css/profile.css'
import { userContext } from '../App'
import {useParams} from 'react-router-dom'

function UserProfile() {
    const [userProfile,setProfile] = useState(null)
    const {state,dispatch} = useContext(userContext)
    const {userid} = useParams()
    const [showFollow,setShowFollow] = useState(state?!state.following.includes(userid):true)
   
    useEffect(() => {
        fetch(`/user/${userid}`,{
            headers:{
                "Authorization":"Bearer " +localStorage.getItem("jwt")
            }

        }).then(res=>res.json())
        .then(result=>{
            console.log(result)
           
            setProfile(result)
        })
       
    }, []);


    const followUser =()=>{
        fetch('/follow',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer " + localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                followId:userid
            })
        }).then(res=>res.json())
        .then(data=>{
            console.log(data)
            dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
            localStorage.setItem("user",JSON.stringify(data))
            setProfile((prevState)=>{
                return{
                    ...prevState,
                    user:{
                        ...prevState.user,
                        followers:[...prevState.user.followers,data._id]
                    }
                }
            })
            setShowFollow(false)
        })
    }
    
    const unfollowUser =()=>{
        fetch('/unfollow',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer " + localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                unfollowId:userid
            })
        }).then(res=>res.json())
        .then(data=>{
            
            dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
            localStorage.setItem("user",JSON.stringify(data))
            
            setProfile((prevState)=>{
                const  newFollower = prevState.user.followers.filter(item=>item !== data._id)
                return{
                    ...prevState,
                    user:{
                        ...prevState.user,
                        followers:newFollower
                    }
                }
            })
            setShowFollow(true)
        })
    }

    return (
        <>
            {userProfile ?
             <div className="container mt-5">
    
             <div className="row">
                 <div className="col-lg-8 col-12 mx-auto style_header">
                     <div className="row d-flex justify-content-between">
                         <div className="col-5">
                              <img src={userProfile.user.pic} 
                              className="img-fluid"
                               alt="profile"/>
                         </div>
                         <div className="col-7 d-flex flex-column justify-content-center mt-3">
                                  <h1 className="text-center ">{userProfile.user.name}</h1>
                                  <h1 className="text-center ">{userProfile.user.email}</h1>
                             <div className="d-flex justify-content-around mt-4">
                                 <p>{userProfile.posts.length} posts</p>
                                 <p>{userProfile.user.followers.length} followers</p>
                                 <p>{userProfile.user.following.length} following</p>
                             </div>
                             {showFollow? <button type="button" className="btn btn-info text-white"
                                onClick={()=>{followUser()}}
                                >FOLLOW</button>
                            : <button type="button" className="btn btn-info text-white"
                            onClick={()=>{unfollowUser()}}
                            >UNFOLLOW</button>}
                            
                            
                         </div>
                     </div>
                 </div>
             </div>
           <hr className="w-75 mx-auto" />

           <div className="row">
               <div className="col-lg-8 mx-auto">
                   <div className="row">
                      {
                          userProfile.posts.map(item=>{
                              return (
                                  <div className="col-4 gy-3" key={item._id}>
                                  <img src={item.photo} 
                                  className="img-fluid"
                                  alt={item.title}/>
                                  </div>
                              )
                          })
                      }
                      
                      
                   </div>
               </div>
           </div>

         </div>
        :"loading..."}
          
            
        </>
    )
}

export default UserProfile
