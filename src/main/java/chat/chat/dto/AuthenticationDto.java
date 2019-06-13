package chat.chat.dto;

import chat.chat.model.Role;
import chat.chat.model.Status;
import chat.chat.model.User;
import lombok.Data;

import java.util.List;

@Data
public class AuthenticationDto {
    private String username;
    private String password;
    private List<Role> roles;
}
