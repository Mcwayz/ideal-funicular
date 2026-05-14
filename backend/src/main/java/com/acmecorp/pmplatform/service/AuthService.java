package com.acmecorp.pmplatform.service;

import com.acmecorp.pmplatform.dto.AuthRequest;
import com.acmecorp.pmplatform.dto.AuthResponse;
import com.acmecorp.pmplatform.entity.User;
import com.acmecorp.pmplatform.repository.UserRepository;
import com.acmecorp.pmplatform.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    public AuthResponse login(AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        final UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
        final String jwt = jwtUtil.generateToken(userDetails);
        
        User user = userRepository.findByEmailAndIsDeletedFalse(request.getEmail()).orElseThrow();

        return new AuthResponse(jwt, user.getEmail(), user.getFirstName() + " " + user.getLastName());
    }
}
