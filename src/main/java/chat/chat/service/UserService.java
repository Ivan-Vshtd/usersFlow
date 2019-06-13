package chat.chat.service;

import chat.chat.model.User;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;

public interface UserService {
    User findByName(String name);

    ResponseEntity register(User user);

    ResponseEntity findByUsername(String username);

    ResponseEntity getOneUser(Long id);

    ResponseEntity delete(Long id);

    ResponseEntity updateUser(User user, Long id);

    ResponseEntity findAll(PageRequest request);

    ResponseEntity findAll();
}
