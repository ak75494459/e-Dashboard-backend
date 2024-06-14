const express = require('express')
const cors = require('cors')
require ('./db/config')
const user = require('./db/User')
const product = require("./db/Product")
const Jwt = require("jsonwebtoken");
const jwtkey = 'e-commerce'
const app = express()
const port = 5000;
require("dotenv/config");


app.use(express.json())
app.use(cors())

app.post("/signUp", async (req, resp) => {
  try {
    let User = new user(req.body);
    let result = await User.save();
 
    result = result.toObject();
    
    delete result.password;
    delete result.confirmPassword;
    Jwt.sign({ result }, jwtkey, { expiresIn: "2h" }, (err, token) => {
      if (err) {
        resp.status(500).send({ error: "Something went wrong" });
      } else {
        resp.send({ result, token });
      }
    });
  } catch (error) {
    resp.status(500).send({ error: "Something went wrong" });
  }
});


app.post("/login", async (req,resp)=>{
  console.log(req.body)
  if(req.body.email && req.body.password){
    let User = await user.findOne(req.body).select("-password")
    if(User){
      Jwt.sign({user},jwtkey,{expiresIn: "2h"},(err,token)=>{
        if(err){
          resp.send({result: "somting went wrong "})
        }else{
          resp.send({User , token: token})
        }
      })
  }else{
    resp.send("User does not exit")
  }
}else{
  resp.send("user does not found")
}
  })


app.post("/product-add", tokenVerification , async (req,resp)=>{
  let Product = new product(req.body);
  let result = await Product.save();
  resp.send(result)
})

app.get("/products", async(req,resp)=>{
    let products = await product.find();
    if(products.length > 0){
      resp.send(products);
    }else{
      resp.send("no products found")
    }
  })


app.delete("/product/:id", tokenVerification, async (req,resp)=>{
    const result = await product.deleteOne({_id:req.params.id});
    resp.send(result);
});

app.get("/product/:id", tokenVerification,  async (req,resp)=>{
  let result = await product.findOne({_id:req.params.id});
  if(result){
    resp.send(result)
  }else{
    resp.send({result:"no record found."})
  }
})


app.put("/product/:id", tokenVerification,  async (req,resp)=>{
  const result = await product.updateOne(
    {_id:req.params.id},
    {
      $set : req.body
    }
  )
  resp.send(result)
})



app.get("/search/:key",tokenVerification,async(req,resp)=>{
  const result = await product.find({
    "$or":[
      {name:{$regex:req.params.key}},
      {price:{$regex:req.params.key}},
      {category:{$regex:req.params.key}}
    ]
  })
  resp.send(result)
})

function tokenVerification(req,resp,next){
  let token = req.headers['authorization'];
  if(token){
    token = token.split(" ")[1];
    Jwt .verify(token,jwtkey,(err,valid)=>{
      if(err){      
    resp.status(401).send("please provide valid token")
      }else{
        next();
      }
    })
  }else{
    resp.status(403).send("please add token with header")
  }
    console.log("middle ware called",token)

}



app.listen(port)

