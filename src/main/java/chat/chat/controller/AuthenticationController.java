package chat.chat.controller;

import chat.chat.dto.AuthenticationDto;
import chat.chat.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;

import java.io.UnsupportedEncodingException;

@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600)
@RestController
@RequestMapping("/api/auth/")
public class AuthenticationController {

    private final AuthenticationManager authenticationManager;
    private final UserService userService;

    public AuthenticationController(AuthenticationManager authenticationManager, UserService userService) {
        this.authenticationManager = authenticationManager;
        this.userService = userService;
    }

    @PostMapping("login")
    public ResponseEntity login(@RequestBody AuthenticationDto authenticationDto){
        try {

            String username = authenticationDto.getUsername();
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(username, authenticationDto.getPassword()));

            return userService.findByUsername(username);

        } catch (AuthenticationException e) {
            throw new BadCredentialsException("Invalid username or password");
        }
    }
}
