const express = require("express");
const app = express();
app.use(express.json())
const jwt = require("jsonwebtoken")
const users = [
    {
      id:"1",
      username:"saad",
      password:"asad",
      isAdmin:"true"
    },

    {
        id:"2",
        username:"tasnim",
        password:"hamdu",
        isAdmin:"false"
      },

      {
        id:"1",
        username:"saad",
        password:"asad",
        isAdmin:"false"
      }

    ];

    app.post("/api/login", (req,res)=>{
      const {username, password} = req.body;
      const user = users.find(u => {
        return u.username === username && u.password === password
    
    })

    if(user){
        //generate an access token
        const accesstoken = jwt.sign(
            {_id:user._id, isAdmin:user.isAdmin},
            'mysecretkey'
        ); 
    res.json({
        username:user.username,
        isAdmin:user.isAdmin,
        accesstoken
    });
    
    }else{
        res.status(400).json("username or password incorrect")
    }

})


const verify = (req,res,next) =>{
    const authHeader = req.headers.authorization;
    if(authHeader){
       const token = authHeader.split(" ")[1]

       jwt.verify(token, "my secret key", (err,user)=>{
        if(err){
            return res.status(403).json("token is not valid");
        }
    req.user = user;
    next()   
    
    })
    } else{
        res.status(401).json("i know you are a hacker")
    }

}

app.delete("/api/users/:userId", verify,(req,res)=>{
    if(req.user.id === req.params.userId  || req.user.isAdmin){
        res.status(200).json("user has been deleted")
    }else{
        res.status(403).json(" hacker go back to your home ")
    }
})

app.listen(5000,()=>console.log('server is running'))