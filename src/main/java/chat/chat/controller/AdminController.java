package chat.chat.controller;

import chat.chat.dto.UserDto;
import chat.chat.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600)
@RestController
@RequestMapping("/api/admin/users/")
public class AdminController {

    private final UserService userService;

    public AdminController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("{id}")
    public ResponseEntity getUserById(@PathVariable(name = "id") Long id) {

        return userService.getOneUser(id);
    }

    @DeleteMapping("{id}")
    public ResponseEntity delete(@PathVariable("id") Long id){

        return userService.delete(id);
    }

    @PutMapping("{id}")
    public ResponseEntity updateEach(@PathVariable("id") Long id, @RequestBody UserDto userDto){

        return userService.updateUser(userDto.toUser(), id);
    }
}
