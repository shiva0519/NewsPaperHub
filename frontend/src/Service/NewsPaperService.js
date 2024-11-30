import axios from 'axios';

const registerAPI="http://localhost:9292/api/register/addregister";
const loginAPI="http://localhost:9292/api/Loginpage/add";
const ForgotEmailAPI="http://localhost:9292/api/auth/forgot-password";
const verifyOtpAPI="http://localhost:9292/api/auth/reset-password";
const searchByCategoryAPI="http://localhost:9292/api/news/categories";
const searchDateWiseAPI="http://localhost:9292/api/news/search";
const checkEmailAPI="http://localhost:9292/api/register/CheckMail";
const signupOtpAPI="http://localhost:9292/api/register/sendSignupOtp"
const SignupVerifyOtp ="http://localhost:9292/api/register/verify-otp"
const categoriesAPI= "http://localhost:9292/api/news/categories"

class NewsPaperService{

   
        static createUser(register) {
            return axios.post(registerAPI, register);
        }
    
        static login(loginData) {
            return axios.post(loginAPI, loginData);
        }
    
        static sendForgotEmail(forgotEmail) {
            return axios.post(ForgotEmailAPI+"/"+forgotEmail);
        }

        static verifyOtp(otpDetails) {
            const params = new URLSearchParams();
            params.append("email", otpDetails.email);
            params.append("otp", otpDetails.otp);
            params.append("newPassword", otpDetails.newPassword);
    
            return axios.post(verifyOtpAPI, params, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded', // Required for URL-encoded params
                },
            });
        }

        static searchNewsByCategory(category) {
            return axios.get(searchByCategoryAPI+"/"+category);
        }

        static dateWiseHandleSearch(dateWiseSearchDetails) {
            const params = {
                category: dateWiseSearchDetails.category,
                fromDate: dateWiseSearchDetails.fromDate,
                toDate: dateWiseSearchDetails.toDate,
            };
        
            console.log(params); // Log to verify the params
        
            return axios.get(searchDateWiseAPI, {
                params: params, // Pass params in the Axios options
                headers: {
                    'Content-Type': 'application/json', // Optional, not needed for GET requests
                },
            });
        }

        static checkEmail(email)
        {
            return axios.post(checkEmailAPI+"/"+email);
        }
        
        static sendSigupOtp(email)
        {
            return axios.post(signupOtpAPI,email)
        }
        
        static verifySingupOtp(otp, registeredData)
        {
            return axios.post(SignupVerifyOtp+"/"+otp, registeredData);
        }

        static getCategories()
        {
            return axios.get(categoriesAPI);
        }
    }
    
    
    



export default  NewsPaperService;

