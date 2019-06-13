package chat.chat.dto;

import chat.chat.model.User;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class UserInfoDto {
    private Long id;
    private String username;
    private String firstName;
    private String lastName;
    private String email;

    public static UserInfoDto fromUser(User user) {
        UserInfoDto userInfoDto = new UserInfoDto();
        userInfoDto.setId(user.getId());
        userInfoDto.setUsername(user.getUsername());
        userInfoDto.setFirstName(user.getFirstName());
        userInfoDto.setLastName(user.getLastName());
        userInfoDto.setEmail(user.getEmail());
        return userInfoDto;
    }
}
