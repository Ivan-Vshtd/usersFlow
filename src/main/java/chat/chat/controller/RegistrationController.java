package chat.chat.controller;

import chat.chat.dto.UserDto;
import chat.chat.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600)
@RestController
@RequestMapping("/api/auth/")
public class RegistrationController {

    private UserService userService;

    public RegistrationController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("registration")
    public ResponseEntity registration(@RequestBody UserDto userDto) {
        return userService.register(userDto.toUser());
    }
}
