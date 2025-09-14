package com.webcore.platform.notification;

import com.webcore.platform.security.custom.CustomUser;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {
    private final NotificationService notificationService;

    @GetMapping("/count")
    public ResponseEntity<?> getUnreadCount(@AuthenticationPrincipal CustomUser customUser) {
        int memberIdx = customUser.getMemberDTO().getMemberIdx();
        int count = notificationService.getUnreadCount(memberIdx);
        return ResponseEntity.ok(Map.of("unreadCount", count));
    }
}
