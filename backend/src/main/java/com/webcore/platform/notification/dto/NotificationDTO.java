package com.webcore.platform.notification.dto;

import com.webcore.platform.common.dto.DefaultDTO;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString(callSuper = true)
public class NotificationDTO extends DefaultDTO {
    /** 알림 고유번호 (PK, AUTO_INCREMENT) */
    private Long notificationIdx;
    /** 회원 고유번호 (FK, NULL이면 전체 공지) */
    private Integer memberIdx;
    /** 알림 유형 코드 (예: CAMPAIGN_RESULT, NOTICE) */
    private String notiTypeCd;
    /** 알림 제목 */
    private String notiTitle;
    /** 알림 내용 */
    private String notiMessage;
    /** 알림 클릭 시 이동할 URL */
    private String notiLinkUrl;
    /** 읽음 여부 (true: 읽음, false: 미읽음) */
    private Boolean isRead;
}
