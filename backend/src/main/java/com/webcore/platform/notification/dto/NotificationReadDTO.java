package com.webcore.platform.notification.dto;

import com.webcore.platform.common.dto.DefaultDTO;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;

@Getter
@Setter
@ToString(callSuper = true)
public class NotificationReadDTO extends DefaultDTO {
    /** 알림 고유번호 (FK, TB_NOTIFICATION.NOTIFICATION_IDX) */
    private Long notificationIdx;
    /** 회원 고유번호 (FK, TB_MEMBER.MEMBER_IDX) */
    private Integer memberIdx;
    /** 읽은 일시 */
    private LocalDateTime readAt;
}
