package chat.chat.controller;

import chat.chat.dto.UserDto;
import chat.chat.security.jwt.JwtUser;
import chat.chat.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import static chat.chat.util.ChatUtils.request;

@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600)
@RestController
@RequestMapping(value = "/api/")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("user/{id}")
    public ResponseEntity getUserById(@PathVariable Long id){
        return userService.getOneUser(id);
    }

    @PutMapping("user/{id}")
    public ResponseEntity update(@AuthenticationPrincipal JwtUser jwtUser,
                                 @RequestBody UserDto userDto){
        return userService.updateUser(userDto.toUser(), jwtUser.getId());
    }

    @GetMapping("users/{page}/{size}")
    public ResponseEntity getAllUsers(@PathVariable("page") Integer page,
                                      @PathVariable("size") Integer size){
        return userService.findAll(request(page, size));
    }

    @GetMapping("users")
    public ResponseEntity getAll(){
        return userService.findAll();
    }
}
