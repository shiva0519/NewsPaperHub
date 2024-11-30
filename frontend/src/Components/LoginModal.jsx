import React, { useContext, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { regexEmail, regexFullName, regexMobileNo, regexPassword } from './Regex';
import NewsPaperService from '../Service/NewsPaperService';
import { store } from './ContextAPI';

const LoginModal = ({ show, onHide, modalType, onChangeModal }) => {

  const [data, setData] = useState({
    singupFullName: '',
    signupEmail: '',
    sigupMobile: '',
    signupPassword: '',
    loginEmail: '',
    loginPassword: '',
    forgotEmail: '',
    otp: '',
    newPassword:'',
    signupOtp:''

  });

  const [errors, setErrors] = useState({
    singupFullName: '',
    signupEmail: '',
    sigupMobile: '',
    signupPassword: '',
    loginEmail: '',
    loginPassword: '',
    forgotEmail: '',
    otp: '',
    newPassword:'',
    signupOtp:''
  });

  const onChangeHanlder = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setData({ ...data, [name]: value });

    if (name === "loginEmail")
      regexEmail.test(value) ? setErrors({ ...errors, [name]: "" }) : setErrors({ ...errors, [name]: "Invalid Email Formate" });
    if (name === "loginPassword")
      regexPassword.test(value) ? setErrors({ ...errors, [name]: "" }) : setErrors({ ...errors, [name]: "Invalid Password Formate" });
    if (name === "singupFullName")
      regexFullName.test(value) ? setErrors({ ...errors, [name]: "" }) : setErrors({ ...errors, [name]: "Invalid FullName Formate" });
    if (name === "signupEmail")
      regexEmail.test(value) ? setErrors({ ...errors, [name]: "" }) : setErrors({ ...errors, [name]: "Invalid email Formate" });
    if (name === "sigupMobile")
      regexMobileNo.test(value) ? setErrors({ ...errors, [name]: "" }) : setErrors({ ...errors, [name]: "Invalid Mobile Formate" });
    if (name === "signupPassword")
      regexPassword.test(value) ? setErrors({ ...errors, [name]: "" }) : setErrors({ ...errors, [name]: "Invalid Password Formate" });
    if (name === 'forgotEmail')
      regexEmail.test(value) ? setErrors({ ...errors, [name]: "" }) : setErrors({ ...errors, [name]: "Invalid Email Formate" });
    if(name==="newPassword")
      regexPassword.test(value) ? setErrors({ ...errors, [name]: "" }) : setErrors({ ...errors, [name]: "Invalid Password Formate" });
  }

  const handleKeyPress = (event) => {
    const charCode = event.which || event.keyCode;
    // Allow only numeric input (0-9) and special keys like backspace
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  };

  const loginDatas={
    userName:data.loginEmail,
    password:data.loginPassword
  }

 const  [loginData, setLoginData]=useContext(store);

  const loginHandleSubmit = (e) => {
    e.preventDefault();
    if (!errors.loginEmail && !errors.loginPassword) {
      NewsPaperService.login(loginDatas)
        .then((res) => {
          alert(res.data);
          console.log("Login Successfully", res.data);
          setLoginData(loginDatas);
          // Close the modal after a successful login
          onHide();
          

        })
        .catch((err) => {
          alert(err.response.data);
          console.log("Error while login", err.response.data);
        });
    }
  };
  

  const registerData={
    fullName: data.singupFullName,
    email: data.signupEmail,
    password:data.signupPassword,
    phoneNumber: data.sigupMobile
  }

 
  const signupHandleSubmit = (e) => {
    e.preventDefault();
    
    if (!errors.signupEmail && !errors.sigupMobile && !errors.singupFullName && !errors.signupPassword)
    {
        const otp=data.signupOtp
      NewsPaperService.verifySingupOtp(otp,registerData ).then((res)=>
      {
        console.log(res.data)
        // alert("Reistered Succesfully")
        // if(res.status==="200")
        //     console.log("signup data added succesfully", res)
        // if(res.status==="409")
        //     console.log("email is already registered, Please Login!")  
        console.log(res.data);
        onHide();
      })
      .catch((err)=>
      {
        alert("Invalid Otp")
        console.log(err)
      })
      console.log(registerData);
      
    }

  }

  const verifySignupOtp=(e)=>
  {
    e.preventDefault()
    if (!errors.signupEmail && !errors.sigupMobile && !errors.singupFullName && !errors.signupPassword)
      {
        const email=data.signupEmail;
        NewsPaperService.checkEmail(email).then((res)=>
        {
          if(res.data===false)
            console.log("Email not exists,otp sent" , res.data)
          onChangeModal('signupOtp')
          if(res.data===true)
            console.log("Email exists",res.data)
        })
        .catch((err)=>
        {
            console.log("error while checking existing email", err)
        })
      }
   
  }

  const forgotEmail=data.forgotEmail;

  const forgotHandleSubmit = (e) => {
    e.preventDefault();
    if (!errors.forgotEmail)
    {
      console.log(data.forgotEmail)
      NewsPaperService.sendForgotEmail(forgotEmail).then((res)=>
      {
           alert(res.data);
            console.log("Mail Sent Successfull", res)
            onChangeModal('otp')
      })
      .catch((err)=>
      {
        if(err.status==="500")
          {
            console.log("Error while sending the email", err.response.data)
          }
        
        
        alert(err.response.data);
      })
    }
  }

  const otpDetails={
    email:data.forgotEmail,
    newPassword:data.newPassword,
    otp:data.otp
  }
  const otpHandleSubmit = (e) => {
    e.preventDefault();
    if (!errors.otp && !errors.newPassword)
    {
      NewsPaperService.verifyOtp(otpDetails).then((res)=>
        {
          alert(res.data)
          console.log("otp verified successfully", res);
          onHide();
        })
        .catch((err)=>
        {
          alert(err.response.data)
          console.log("error while uploading the data", err)
        })
    }
  }


  return (
    <Modal show={show} onHide={onHide}  backdrop="static" keyboard={false} >
      <Modal.Header closeButton>
        <Modal.Title>
          {modalType === 'login' && 'Login'}
          {modalType === 'signup' && 'Sign Up'}
          {modalType === 'forgotPassword' && 'Forgot Password'}
          {modalType==='signupOtp' && 'Singup Otp Verification'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {modalType === 'login' && (
          <>
            <form onSubmit={loginHandleSubmit}>
              <div className="mb-3">
                <label>Email</label>
                <input type="text" name="loginEmail" onChange={onChangeHanlder} className="form-control" placeholder="Enter email" required />
                {errors.loginEmail && <p className='text-danger' >{errors.loginEmail}</p>}
              </div>
              <div className="mb-3">
                <label>Password</label>
                <input type="password" name='loginPassword' onChange={onChangeHanlder} className="form-control" placeholder="Enter password" required />
                {errors.loginPassword && <p className='text-danger'>{errors.loginPassword}</p>}
              </div>
              <div className='text-end'>
                <button className="btn btn-link" onClick={() => onChangeModal('forgotPassword')}>
                  Forgot Password?
                </button>
              </div>
              <div className="text-center">
                <button className="btn btn-success px-3" >Login</button>
              </div>
              <p className="mt-3 text-center">
                Don't have an account?{' '}
                <button className="btn btn-link" onClick={() => onChangeModal('signup')}>
                  Sign Up
                </button>
              </p>
            </form>
          </>
        )}
        {modalType === 'signup' && (
          <>
            <form onSubmit={verifySignupOtp}>
              <div className="mb-3">
                <label>Full Name</label>
                <input type="text" name="singupFullName" onChange={onChangeHanlder} className="form-control" placeholder="Enter full name" required />
                {errors.singupFullName && <p className='text-danger' >{errors.singupFullName}</p>}
              </div>
              <div className="mb-3">
                <label>Email</label>
                <input type="text" name='signupEmail' onChange={onChangeHanlder} className="form-control" placeholder="Enter email" required />
                {errors.signupEmail && <p className='text-danger'>{errors.signupEmail}</p>}
              </div>
              <div className="mb-3">
                <label>Mobile</label>
                <input type="text" name="sigupMobile" onChange={onChangeHanlder} className="form-control" maxLength={10} onKeyPress={handleKeyPress} placeholder="Enter mobile number" required />
                {errors.sigupMobile && <p className='text-danger'>{errors.sigupMobile}</p>}
              </div>
              <div className="mb-3">
                <label>Password</label>
                <input type="password" name='signupPassword' onChange={onChangeHanlder} className="form-control" placeholder="Enter password" required />
                {errors.signupPassword && <p className='text-danger'>{errors.signupPassword}</p>}
              </div>
              <div className='text-center'>
                <button className="btn btn-success" >Signup</button>
              </div>
            </form>
            <p className="mt-3 text-center">
              Already have an account?{' '}
              <button className="btn btn-link" onClick={() => onChangeModal('login')}>
                Login
              </button>
            </p>

          </>
        )}

        {modalType==='signupOtp' &&
        (<>
        <form onSubmit={signupHandleSubmit}>
        <p>An OTP has been sent to your email: <strong>{data.signupEmail}</strong></p>
              <div className="mb-3">
                <label>Enter OTP</label>
                <input
                  type="text"
                  name="signupOtp"
                  onChange={onChangeHanlder}
                  className="form-control"
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                  onKeyPress={handleKeyPress}
                  required
                />
                {errors.otp && <p className="text-danger">{errors.otp}</p>}
           </div>
           <div className='d-flex justify-content-between'>
            <button className="btn btn-link ms-5" onClick={() => onChangeModal('signup')}>
              Edit email
            </button>
            <div className='text-center'>
            <button className="btn btn-success me-5"  >Submit</button>
          </div>
        </div>  
           </form>
           
           </>)}
        {modalType === 'forgotPassword' && (
          <>
            <form onSubmit={forgotHandleSubmit}>
              <div className="mb-3">
                <label>Email</label>
                <input type="email" name='forgotEmail' className="form-control" placeholder="Enter your email" onChange={onChangeHanlder} required />
                {errors.forgotEmail && <p className='text-danger'>{errors.forgotEmail}</p>}
              </div>
              <div className='d-flex justify-content-between'>

                <button className="btn btn-link ms-5" onClick={() => onChangeModal('login')}>
                  Login
                </button>
                <div className='text-center'>
                  <button className="btn btn-success me-5">Submit</button>
                </div>
              </div>
            </form>


          </>
        )}
        {modalType === 'otp' && (
          <>
            <p>An OTP has been sent to your email: <strong>{data.forgotEmail}</strong></p>
            <form onSubmit={otpHandleSubmit}>
              <div className="mb-3">
                <label>Enter OTP</label>
                <input
                  type="text"
                  name="otp"
                  onChange={onChangeHanlder}
                  value={data.otp}
                  className="form-control"
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                  onKeyPress={handleKeyPress}
                  required
                />
                {errors.otp && <p className="text-danger">{errors.otp}</p>}
              </div>
              <div className="mb-3">
                <label>New Password</label>
                <input type="text" name='newPassword' className="form-control" placeholder="Enter newPasword" onChange={onChangeHanlder} required />
                {errors.newPassword && <p className='text-danger'>{errors.newPassword}</p>}
              </div>
              <div className="d-flex justify-content-between">
                <button className="btn btn btn-link text-end ms-5" onClick={() => onChangeModal('forgotPassword')} >
                  Edit email
                </button>
                <button className="btn btn-success me-5" >
                  Submit
                </button>
              </div>
            </form>
          </>

        )}
      </Modal.Body>
    </Modal>
  );
};

export default LoginModal;
