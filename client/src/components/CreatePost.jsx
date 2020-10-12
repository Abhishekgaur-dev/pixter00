import React,{useState} from 'react'
import { useHistory } from 'react-router-dom';
import {toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';


function CreatePost() {
    const history = useHistory()
    const [title,setTitle] = useState("")
    const [body,setBody] = useState("")
    const [image,setImage] = useState("")
    const [label,setlabel] = useState("choose file...") 
    // const [url,setUrl] = useState("") 

    const handlefile = (e)=>{
      setlabel(e.target.files[0].name)
      setImage(e.target.files[0])
    }

    const postDetails = (e) =>{
        
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
            fetch('/createpost',{
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization" :"Bearer " +localStorage.getItem("jwt")
                },
                body: JSON.stringify({
                    title,
                    body,
                    photo:data.url
                })
            }).then(res=>res.json())
            .then(data=> {
                if(data.error){
                  toast.error(data.error)  
                }
                else{
                    toast.success("successfuly created post")
                    history.push("/")
                }
            }).catch(err=>{
                console.log(err)
            })
        })
        .catch(err=>{
            console.log(err)
        })
       


        e.preventDefault()

    }
   
    
   

    return (
        <div className="createpost d-flex justify-content-center align-items-center">
            <div className="createpost_style">
            <form onSubmit={(e)=>{postDetails(e)}}>
            <div className="mb-3">
                <label className="form-label">title</label>
                <input type="text" 
                className="form-control" 
                placeholder="title"
                vlaue={title}
                onChange={(e)=>setTitle(e.target.value)} />
            
            </div>
            <div className="mb-3">
                <label  className="form-label">body</label>
                <input type="text" 
                className="form-control" 
                placeholder="body"
                value={body}
                onChange={(e)=> setBody(e.target.value)}/>
            </div>

            <div className="form-file form-file-sm mb-3">
            <input type="file" className="form-file-input file_input" id="customFileSm" onChange={handlefile}/>
            <label className="form-file-label"> 
                <span className="form-file-text">{label}</span>
                <span className="form-file-button">Image</span>
            </label>
            </div>
            
            <button type="submit" className="btn btn-primary">Post</button>
            </form>
            </div>
        </div>
    )
}

export default CreatePost