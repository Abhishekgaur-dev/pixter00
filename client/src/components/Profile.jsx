import React,{useEffect,useContext} from 'react'
import { useState } from 'react';
import '../css/profile.css'
import { userContext } from '../App'
import { IconButton } from '@material-ui/core'
import EditIcon from '@material-ui/icons/Edit';
import {toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';


function Profile() {
    const [mypics,setPics] = useState([])
    const {state,dispatch} = useContext(userContext)
    const [image,setImage] = useState("")
    const [label,setlabel] = useState("upload profile pic") 
    useEffect(() => {
        fetch('/mypost',{
            headers:{
                "Authorization":"Bearer " +localStorage.getItem("jwt")
            }

        }).then(res=>res.json())
        .then(result=>{
            
            setPics(result.mypost)
        })
       
    }, []);

    useEffect(() => {
        if(image){

            const data = new FormData()
            data.append("file",image)
            data.append("upload_preset","insta_clone")
            data.append("cloud_name","lunner")
            
            fetch("	https://api.cloudinary.com/v1_1/lunner/image/upload",{
                
                method:"post",
                body:data
            })
            .then(res=>res.json())
            .then(data=>{
               fetch('/updatepic',{
                    method:"put",
                    headers:{
                        "Content-Type":"application/json",
                        "Authorization":"Bearer "+ localStorage.getItem("jwt")
                    },
                    body:JSON.stringify({
                        pic:data.url
                    })
                }).then(res=>res.json())
                .then(result=>{
                    localStorage.setItem("user",JSON.stringify({...state,pic:result.pic}))
                    dispatch({type:"UPDATEPIC",payload:result.pic})
                    toast.success("successfully updated!!!")
                })
            })
            .catch(err=>
                {
                    console.log(err)
                })
        }
    }, [image]);

    const uploadphoto = (file)=>{
        setImage(file)
        
    }

    const updatephoto =()=>{
        uploadphoto()
    }

    return (
        <div>
           <div className="container mt-5">
    
               <div className="row">
                   <div className="col-lg-8 col-12 mx-auto style_header">
                       <div className="row d-flex justify-content-between">
                           <div className="col-5 ">
                                <img src={state?state.pic:"loading"} 
                                className="img-fluid rounded-circle image_style"
                                 alt="profile"/>
                                 
                                 <IconButton 
                                    title="edit profile picture"
                                    data-toggle="modal" 
                                    data-target="#exampleModal" 
                                      style={{outline:"none"}}  >
                                     <EditIcon style={{color:"black"}} />
                                 </IconButton>


                                  {/* -------Modal -----*/}
                                    <div className="modal fade" id="exampleModal"  aria-labelledby="exampleModalLabel" aria-hidden="true">
                                    <div className="modal-dialog">
                                        <div className="modal-content">
                                        <div className="modal-header">
                                            <button type="button" className="btn-close" data-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        <div className="modal-body">
                                        <div className="form-file form-file-sm mb-2">
                                                <input type="file" className="form-file-input file_input" 
                                                id="customFileSm" 
                                                onChange={(e)=>{
                                                    setlabel(e.target.files[0].name)
                                                    uploadphoto(e.target.files[0])
                                                }}/>
                                                <label className="form-file-label"> 
                                                    <span className="form-file-text">{label}</span>
                                                    <span className="form-file-button">Image</span>
                                                </label>
                                            </div>
                                        </div>
                                        <div className="modal-footer">
                                            
                                            <button type="button" 
                                            className="btn btn-primary"
                                            onClick={()=>updatephoto()}
                                            data-dismiss="modal"
                                            >update</button>
                                        </div>
                                        </div>
                                    </div>
                                    </div>
                           </div>



                           <div className="col-7 d-flex flex-column justify-content-center mt-3">
                                    <h1 className="text-center ">{state?state.name:"loading"}</h1>
                                    <h1 className="text-center ">{state?state.email:"loading"}</h1>
                               <div className="d-flex justify-content-around mt-4">
                                   <p>{mypics.length} posts</p>
                                   <p>{state?state.followers.length:"0"} followers</p>
                                   <p>{state?state.following.length:"0"} following</p>
                               </div>
                           </div>
                       </div>
                   </div>
               </div>
             <hr className="w-75 mx-auto" />

             <div className="row">
                 <div className="col-lg-8 mx-auto">
                     <div className="row">
                        {
                            mypics.map(item=>{
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
            
        </div>
    )
}

export default Profile
