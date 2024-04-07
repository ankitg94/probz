import userModel from "../models/userModel.js";
import { comparePassword, hashPassword } from "../helpers/authhelpers.js";
import JWT from "jsonwebtoken";
//Register------------------------------------------------

export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address,answer} = req.body;
    //validation
    if (!name) {
      return res.send({ message: "Name is required" });
    }
    if (!email) {
      return res.send({ message: "Email is required" });
    }
    if (!password) {
      return res.send({ message: "Password is required" });
    }
    if (!phone) {
      return res.send({ message: "Phone is required" });
    }
    if (!address) {
      return res.send({ message: "address is required" });
    }
    if (!answer) {
      return res.send({ message: "answer is required" });
    }
    //check user
    const existingUser = await userModel.findOne({ email });
    //existing user
    if (existingUser) {
      return res.status(200).send({success:false,
        message: "Already a Register please login",});
    }
    //register user
    const hashedPassword = await hashPassword(password);
    //save
    const user = await new userModel({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      answer 
    }).save();
    res.status(201).send({  success: true, 
    message: "User register succesfully",user,
   });
   } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Registration",
      error
    });
  }
};





//login--method post------------------------------
export const loginController = async (req, res) => {
  try {
    //import
    const { email, password } = req.body;
    //validation
    if (!email  || !password){
      return res.status(404).send({
        success: false,
        message: "Invalid username and password",
      });
    }
    //check user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is not register",
      });
    }
    const match = await comparePassword(password,user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "invalid password",
      });
    }
    
    //token
    const token = await JWT.sign({ _id:user._id}, process.env.JWT_SECRET,{expiresIn:"7d"})
     
      //req succesful

      res.status(200).send({
      success:true,
      message:"login succesfully",
      user:{
        _id:user._id,
        name:user.name,
        email:user.email,
        phone:user.phone,
        address:user.address,
        role:user.role,},
      token,
    });


  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in login",
      error
    });
  }
};
//..........................forget password............................................
export const forgetPasswordControllers = async(req,res)=>{
  try{
    //1-get from the data
   const {email,answer,newPassword}=req.body
   //2-validation
   if(!email){
    res.status(400).send({message:"Email is required"})
   }
   if(!answer){
    res.status(400).send({message:"answer  is required"})
   }
   if(!newPassword){
    res.status(400).send({message:"password is required"})
   }
   //check
   const user = await userModel.findOne({email,answer});
   //validation
   if(!user){
   return  res.status(404).send({ 
      success:false,
      message:"email or answer is not valid",
    })
   }
   //password hashed
   const hashed = await hashPassword(newPassword)
   //create new password
   await userModel.findByIdAndUpdate(user._id,{password:hashed});
   res.status(200).send({
    success:true,
    message:"password Reset Succesfully"
   });


  } catch(error){
  console.log(error)
  res.status(500).send({
    success:false,
    message:'Something went wrong',
    error,
  });
  }
};

export const updateProfileController = async(req,res)=>{
  try{
  const { name, password, phone, address} = req.body

  const user = await userModel.findById(req.user._id) 
  if(password && password.length<6){
    return res.json({error :"Password is required"})
  }
  const hashedPassword = password ? await hashPassword(password):undefined 

  const updateUser = await userModel.findByIdAndUpdate(req.user._id,{
   name: name||user.name,
   password: hashedPassword||user.password,
   address: address||user.address,
   phone:phone||user.phone
   },{new:true})  
    res.status(200).send({
    success:true,
    message:"Profile updated succesfully",
    updateUser
  })
}
  catch(error){
    console.log(error)
  }
} 
