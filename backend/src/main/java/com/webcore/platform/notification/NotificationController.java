package com.webcore.platform.notification;

import com.webcore.platform.notification.dto.NotificationDTO;
import com.webcore.platform.notification.dto.NotificationReadDTO;
import com.webcore.platform.security.custom.CustomUser;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {
    private final NotificationService notificationService;

    /** 읽지 않은 알림 개수 가져오기 */
    @GetMapping("/count")
    public ResponseEntity<?> getUnreadCount(@AuthenticationPrincipal CustomUser customUser) {
        int loginMemberIdx = customUser.getMemberDTO().getMemberIdx();
        int count = notificationService.getUnreadCount(loginMemberIdx);
        return ResponseEntity.ok(Map.of("unreadCount", count));
    }
    
    /** 현재 로그인한 유저의 알림 전체 내역 가져오기 */
    @GetMapping("/alarm")
    public ResponseEntity<?> getUserNotifications(@AuthenticationPrincipal CustomUser customUser){
        int loginMemberIdx = customUser.getMemberDTO().getMemberIdx();
        Map<String, Object> resultMap = notificationService.getNotifications(loginMemberIdx);

        log.info("알림 내역 =>{}", resultMap);

        return new ResponseEntity<>(resultMap, HttpStatus.OK);
    }

    /**  */
    @PostMapping("/mark-read")
    public ResponseEntity<?> markAsRead(
            @RequestBody NotificationReadDTO notificationReadDTO,
            @AuthenticationPrincipal CustomUser customUser){

        notificationReadDTO.setMemberIdx(customUser.getMemberDTO().getMemberIdx());

        log.info("읽음처리 dto => {}", notificationReadDTO);

        boolean result = notificationService.markAsRead(notificationReadDTO);

        if(result){
            return new ResponseEntity<>("알림 읽음 처리 완료", HttpStatus.OK);
        }
            return new ResponseEntity<>("알림 읽음 처리 실패", HttpStatus.FORBIDDEN);

    }
}
