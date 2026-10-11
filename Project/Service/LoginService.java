package com.sms.society.Service;

import com.sms.society.Entities.User;
import com.sms.society.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class LoginService {

    @Autowired
    UserRepository userRepo;

    public User login(String email, String password) throws Exception {
        Optional<User> user = userRepo.findByEmailAndPassword(email, password);
        if (user.isPresent()) {
            return user.get();
        }
        throw new Exception("Invalid email or password.");
    }

}
