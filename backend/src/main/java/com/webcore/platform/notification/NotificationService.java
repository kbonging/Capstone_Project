package com.webcore.platform.notification;

import com.webcore.platform.notification.dto.NotificationDTO;
import com.webcore.platform.notification.dto.NotificationReadDTO;

import java.util.List;
import java.util.Map;

public interface NotificationService {

    /**
     * 로그인한 회원 기준 전체/개인 알림 조회
     * @param memberIdx 회원 고유번호
     * @return 알림 리스트
     */
    Map<String, Object> getNotifications(Integer memberIdx);

    /**
     * 알림 등록 (전체 공지 또는 개인 알림)
     * @param notificationDTO 알림 정보
     */
    boolean createNotification(NotificationDTO notificationDTO);

    /**
     * 알림 읽음 처리 (한 번만 INSERT)
     * @param notificationReadDTO 읽음 정보
     */
    boolean markAsRead(NotificationReadDTO notificationReadDTO);

    /**
     * 읽지 않은 알림 개수 조회
     */
    int getUnreadCount(Integer memberIdx);
}
