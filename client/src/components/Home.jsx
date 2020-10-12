import React, { useState,useEffect,useContext } from 'react'
import FavoriteBorderOutlinedIcon from '@material-ui/icons/FavoriteBorderOutlined';
import DeleteIcon from '@material-ui/icons/Delete';
import FavoriteIcon from '@material-ui/icons/Favorite';
import { IconButton } from '@material-ui/core'
import {userContext} from '../App'
import {Link} from 'react-router-dom'
import {toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

function Home() {
    const [data,setData] = useState([])
    const {state,dispatch} = useContext(userContext)
    useEffect(() => {
      fetch('/allposts',{
          headers:{
              "Authorization":"Bearer " +localStorage.getItem("jwt")
          }
      }).then(res=>res.json())
      .then(result=>{

          setData(result.posts)
      })
    }, []);


    const likepost = (id) =>{
        fetch('/like',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer " +localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId:id
            })

    }).then(res=>res.json())
    .then(result=>{
        
        const newData = data.map(item=>{
            if(item._id === result._id){
                return result
            }
            else{
                return item
            }
        })
        
        setData(newData)
    }).catch(err=>{
        console.log(err)
    })
}

    const unlikepost = (id) =>{
        fetch('/unlike',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer " +localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId:id
            })

    }).then(res=>res.json())
    .then(result=>{
        
        const newData = data.map(item=>{
            if(item._id === result._id){
                return result
            }
            else{
                return item
            }
        })
        setData(newData)
    }).catch(err=>{
        console.log(err)
    })
}

    const makecomment = (text,postId)=>{
        fetch('/comment',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer " +localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId,
                text
            })
        }).then(res=>res.json())
        .then(result=>{
            const newData = data.map(item=>{
                if(item._id === result._id){
                    return result
                }
                else{
                    return item
                }
            })
            setData(newData)
        }).catch(err=>{
            console.log(err)
        })
    }


    const deletepost = (postId)=>{
        fetch(`/deletepost/${postId}`,{
            method:"delete",
            headers:{
                "Authorization":"Bearer " +localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            
            const newData = data.filter(item=>{
                toast.error("Deleted")
                return item._id !== result._id
            })
            
            setData(newData)
        })
    }

    return (
       
            <div className="container-fluid">
                <div className="row">

                    {data.map(item=>{
                        
                        return (<div className="row my-3" key={item._id}>
                        <div className="col-lg-6 col-sm-12 mx-auto">
                        <div className="card">
                            <div className="card-header">
                            <p className="d-inline-block pt-2 "><Link className="text-decoration-none text-dark" to={item.postedBy._id !== state._id?'/profile/'+ item.postedBy._id :'/profile' }>{item.postedBy.name}</Link></p>
                              <span>{item.postedBy._id === state._id 
                                &&  <IconButton
                                title ="delete"
                                onClick={()=>{deletepost(item._id)}} 
                                style={{float:"right"}}>
                                    <DeleteIcon />
                                </IconButton>
                                }</span>
                              
                                
                               
                            </div>
                            <img src= {item.photo} className="card-img-top image-fluid" alt="picture"/>
                            <div className="card-body">
                               
                                {item.likes.includes(state._id)
                                ?  <IconButton
                                onClick={()=> unlikepost(item._id)} 
                                style={{outline:"none"}} >
                                <FavoriteIcon style={{fill:"red"}} />
                                </IconButton>
                                :  <IconButton 
                                onClick={()=> likepost(item._id)}
                                style={{outline:"none"}} >
                                <FavoriteBorderOutlinedIcon style={{fill:"black"}} />
                                </IconButton>
                            }
                               
                               
                                <p>{item.likes.length} likes</p>
                                <h5 > {item.postedBy.name}</h5>
                                <h5 className="card-title">{item.title}</h5>
                                <p className="card-text">{item.body}</p>
                                {item.comments.map(record=>{
                                    return(
                                    <p key={record._id}><span style={{fontWeight:"500"}}>{record.postedBy.name}</span> {record.text}</p>
                                    )
                                })}
                                <form onSubmit={(e)=>{
                                    e.preventDefault()
                                    makecomment(e.target[0].value,item._id)
                                }}>
                                    <input type="text" placeholder="Comment" style={{
                                        outline:"none",border:"none",
                                        borderBottom:"1px solid black"}}/>
                                </form>
                            </div>
                            </div>

                        </div>
                    </div>)
                    }
                    )}                
                    
                 </div>
                
                
            </div>
       
    )
}

export default Home
