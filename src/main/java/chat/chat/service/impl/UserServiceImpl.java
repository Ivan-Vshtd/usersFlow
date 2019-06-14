package chat.chat.service.impl;

import chat.chat.dto.UserInfoDto;
import chat.chat.dto.wsdto.EventType;
import chat.chat.dto.wsdto.ObjectType;
import chat.chat.model.Role;
import chat.chat.model.Status;
import chat.chat.model.User;
import chat.chat.repository.RoleRepository;
import chat.chat.repository.UserRepository;
import chat.chat.security.jwt.JwtTokenProvider;
import chat.chat.service.UserService;
import chat.chat.util.WsSender;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.function.BiConsumer;
import java.util.stream.Collectors;

@Service
@Slf4j
@Transactional(readOnly = true)
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final BiConsumer<EventType, UserInfoDto> wsSender;

    public UserServiceImpl(UserRepository userRepository, RoleRepository roleRepository, WsSender wsSender,
                           BCryptPasswordEncoder passwordEncoder, JwtTokenProvider jwtTokenProvider) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
        this.wsSender = wsSender.getSender(ObjectType.USER);
    }

    @Transactional
    @Override
    public ResponseEntity register(User user) {

        Role roleUser = roleRepository.findByName("ROLE_USER");
        List<Role> userRoles = new ArrayList<>();

        userRoles.add(roleUser);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRoles(userRoles);
        user.setStatus(Status.ACTIVE);
        user.setCreated(new Date());
        user.setUpdated(new Date());
        User registeredUser = userRepository.save(user);

        log.info("register - user: {} successfully registered", registeredUser);
        wsSender.accept(EventType.CREATE, UserInfoDto.fromUser(registeredUser));

        return prepareResponse(registeredUser);
    }

    @Override
    public ResponseEntity findAll(PageRequest request) {

        Page<User> result = userRepository.findAll(request);
        log.info("getAll - {} users found for requested page", result.getContent().size());

        List<UserInfoDto> showUsers = showUsers(result.getContent());

        return new ResponseEntity<>(showUsers, HttpStatus.OK);
    }

    @Override
    public ResponseEntity findAll() {

        List<User> users = userRepository.findAll();
        log.info("getAll - {} users found", users.size());

        List<UserInfoDto> showUsers = showUsers(users);

        return new ResponseEntity<>(showUsers, HttpStatus.OK);
    }

    @Override
    public ResponseEntity findByUsername(String username) {
        User result = userRepository.findByUsername(username);

        if (result == null) {
            throw new UsernameNotFoundException("User with username: " + username + " not found");
        }
        log.info("findByUsername - user: {} found by username: {}", result, username);
        wsSender.accept(EventType.LOG_IN, UserInfoDto.fromUser(result));
        return prepareResponse(result);
    }

    @Override
    public User findByName(String name) {
        return userRepository.findByUsername(name);
    }

    @Override
    public ResponseEntity getOneUser(Long id) {
        User resultUser = userRepository.findById(id).orElse(null);

        if (resultUser == null) {
            log.warn("getOneUser - no user found by id: {}", id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        log.info("getOneUser - user: {} found by id: {}", resultUser.getUsername(), id);

        return new ResponseEntity<>(UserInfoDto.fromUser(resultUser), HttpStatus.OK);
    }

    @Transactional
    @Override
    public ResponseEntity delete(Long id) {

        User deletedUser = userRepository.findById(id).orElse(null);
        if (deletedUser != null) {
            wsSender.accept(EventType.REMOVE, UserInfoDto.fromUser(deletedUser));
            userRepository.deleteById(id);
            log.info("delete - user: {} successfully deleted", deletedUser.getUsername());
        } else {
            log.error("delete - user with id: {} does not exist", id);
        }
        return ResponseEntity.ok().build();
    }

    @Transactional
    @Override
    public ResponseEntity updateUser(User user, Long id) {

        User userToUpdate = userRepository.findById(id).orElse(null);
        user.setUpdated(new Date());
        user.setCreated(Objects.requireNonNull(userToUpdate).getCreated());
        user.setId(id);
        user.setRoles(userToUpdate.getRoles());
        checkPassword(user, userToUpdate);
        User userResponse = userRepository.save(user);
        wsSender.accept(EventType.UPDATE, UserInfoDto.fromUser(userResponse));

        log.info("update - user: {} successfully updated", userToUpdate);
        return new ResponseEntity<>(UserInfoDto.fromUser(userResponse), HttpStatus.OK);
    }


    private ResponseEntity prepareResponse(User user) {
        String token = jwtTokenProvider.createToken(user.getUsername(), user.getRoles());
        Map<Object, Object> response = new LinkedHashMap<>();

        Set<String> roles =
                user.getRoles()
                        .stream()
                        .map(Role::getName)
                        .collect(Collectors.toSet());

        response.put("username", user.getUsername());
        response.put("id", user.getId());
        response.put("roles", roles);
        response.put("token", token);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    private void checkPassword(User user, User userToUpdate) {
        if (!user.getPassword().equals("*****")) {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        } else {
            user.setPassword(userToUpdate.getPassword());
        }
    }

    private List<UserInfoDto> showUsers(List<User> users) {
        return users.stream()
                .map(UserInfoDto::fromUser)
                .collect(Collectors.toList());
    }
}
