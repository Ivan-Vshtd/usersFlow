package chat.chat.util;

import org.springframework.data.domain.PageRequest;

public class ChatUtils {

    public static PageRequest request(int number, int size) {
        return PageRequest.of(number, size);
    }
}
