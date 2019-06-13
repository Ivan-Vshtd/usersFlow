package chat.chat.dto;

import chat.chat.model.Status;
import chat.chat.model.User;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class UserDto {
    private Long id;
    private String username;
    private String password;
    private String firstName;
    private String lastName;
    private String email;
    private String status;

    public User toUser() {
        User user = new User();
        user.setId(id);
        user.setPassword(password);
        user.setUsername(username);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setEmail(email);
        user.setStatus(Status.ACTIVE);
        return user;
    }
}
