package com.NewsPaperHub.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.NewsPaperHub.Entity.Loginpage;
import com.NewsPaperHub.Entity.Registration;
import com.NewsPaperHub.Repository.LoginRepository;
import com.NewsPaperHub.Repository.RegistrationReposotory;

import jakarta.mail.internet.MimeMessage;

@Service
public class RegisterService {
	
	
	@Autowired
	RegistrationReposotory registerRepo;
	@Autowired
	LoginRepository loginRepositary;
	 @Autowired
	 private JavaMailSender javaMailSender;

	 @Value("${spring.mail.username}")
	 private String sender;

//	 private final Map<String, OtpDetails> otpStorage = new HashMap<>();
		
	
	public Registration addregister(Registration register) {
		
		
		Registration reg=registerRepo.save(register);
		  Loginpage userlogin = new Loginpage();

		 userlogin.setUserName(reg.getEmail());
		 userlogin.setPassword(reg.getPassword());
		loginRepositary.save(userlogin);
		
		return registerRepo.save(register);
	}
	public List<Registration> getAll() {
		return registerRepo.findAll();
	}
	
	public boolean check(String username,String password) 
	{
		Registration reg=registerRepo.findByEmail(username);
		if(reg==null)
		{
			return false;
		}
		
		return reg.getPassword().equals(password);
	}
	

	public Registration getById(String email) {
		return registerRepo.findByEmail(email);
	}
	public Registration findByEmail(String email) {
		
		return registerRepo.findByEmail(email);
	}
	public Registration update(Registration register, String email) {
		
		Registration reg=registerRepo.findByEmail(email);
		reg.setFullName(register.getFullName());
		reg.setPhonenumber(register.getPhoneNumber());
		reg.setEmail(register.getEmail());
	 Loginpage login=loginRepositary.findByUserName(email);
		 
		login.setUserName(register.getEmail());
		loginRepositary.save(login);
		
		
		
		return registerRepo.save(reg);
	}
	
	 private Map<String, String> otpStorage = new HashMap<>();
	 private Map<String, Long> otpTimestamps = new HashMap<>();
	 private final Map<String, Registration> pendingRegistrations = new HashMap<>();
	 
	 // Verify OTP
    public boolean verifyOtp(String email, String otp) {
        if (otpStorage.containsKey(email) && otpStorage.get(email).equals(otp)) {
            long timestamp = otpTimestamps.get(email);
            if ((System.currentTimeMillis() - timestamp) <= 5 * 60 * 1000) { // 5 minutes
                otpStorage.remove(email);
                otpTimestamps.remove(email);
                return true;
            }
        }
        return false;
    }

    private String generateOtp() {
        return String.valueOf((int) (Math.random() * 9000) + 1000); // 4-digit OTP
    }
	 
	
	public boolean sendSignupOtp(String email)
	{
		        String otp = generateOtp();
		        otpStorage.put(email, otp);
		        otpTimestamps.put(email, System.currentTimeMillis());

		        // Build email content
		        String emailContent = "<p>Dear User,</p>" +
		                              "<p>Your OTP for email confirmation at News Paper Hub: <b>" + otp + "</b></p>" +
		                              "<p>This OTP is valid for 5 minutes.</p>" +
		                              "<p>Regards,<br>Newspapers Hub Team</p>";

		        try {
		            MimeMessage mimeMessage = javaMailSender.createMimeMessage();
		            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");
		            helper.setText(emailContent, true);
		            helper.setTo(email);
		            helper.setSubject("OTP Verification at News Paper Hub");
		            helper.setFrom(sender);
		            javaMailSender.send(mimeMessage);
		            return true;
		          
		        } catch (Exception e) {
		            throw new RuntimeException("Error sending OTP email: " + e.getMessage());
		        }
		    
	}
	
	public ResponseEntity<String> sendWelcomeEmail(Registration register) {
	    String emailContent = "<p>Dear " + register.getFullName() + ",</p>" +
	                          "<p>Welcome to Newspapers Hub!</p>" +
	                          "<p>Your registration was successful. We're excited to have you onboard.</p>" +
	                          "<p>Regards,<br>Newspapers Hub Team</p>";

	    try {
	        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
	        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");
	        
	   
	        helper.setText(emailContent, true); 
	        helper.setTo(register.getEmail()); 
	        helper.setSubject("Welcome to Newspapers Hub");
	        helper.setFrom(sender);
	        javaMailSender.send(mimeMessage);
	        return ResponseEntity.status(HttpStatus.CREATED).body("Registration successful. Please login.");
	    } catch (Exception e) {
	        throw new RuntimeException("Error sending welcome email: " + e.getMessage());
	    }
	}

	public boolean checkMail(String email) {
	    Optional<Registration> register = Optional.ofNullable(registerRepo.findByEmail(email));
	    
	    
	    if (register.isEmpty()) {
	    	return sendSignupOtp(email);
	    }
	    return false;
	}
	
	
//	// Verify OTP
//		public boolean verifyOtp(String email, String otp) {
//			OtpDetails otpDetails = otpStorage.get(email);
//
//			if (otpDetails == null) {
//				return false; // No OTP exists for the email
//			}
//
//			if (otpDetails.getOtp().equals(otp) && LocalDateTime.now().isBefore(otpDetails.getExpirationTime())) {
//				otpStorage.remove(email); // OTP is valid, remove it after verification
//				return true;
//			}
//
//			otpStorage.remove(email); // If OTP is invalid or expired, remove it
//			return false;
//		}
		
		private static class OtpDetails {
			private final String otp;
			private final LocalDateTime expirationTime;

			public OtpDetails(String otp, LocalDateTime expirationTime) {
				this.otp = otp;
				this.expirationTime = expirationTime;
			}

			public String getOtp() {
				return otp;
			}

			public LocalDateTime getExpirationTime() {
				return expirationTime;
			}
		}
		
		// Retrieve pending registration by email
		public Registration getPendingRegistration(String email) {
			return pendingRegistrations.get(email);
		}
		
	

//		private static class OtpDetails {
//			private final String otp;
//			private final LocalDateTime expirationTime;
//
//			public OtpDetails(String otp, LocalDateTime expirationTime) {
//				this.otp = otp;
//				this.expirationTime = expirationTime;
//			}
//
//			public String getOtp() {
//				return otp;
//			}
//
//			public LocalDateTime getExpirationTime() {
//				return expirationTime;
//			}
//		}

		// Finalize registration and save it to the database
		public Registration addRegister(Registration register) {
			Registration savedRegister = registerRepo.save(register);

			Loginpage userLogin = new Loginpage();
			userLogin.setUserName(register.getEmail());
			userLogin.setPassword(register.getPassword());

			loginRepositary.save(userLogin);

			return savedRegister;
		}
	
}
