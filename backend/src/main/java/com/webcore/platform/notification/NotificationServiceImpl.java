package com.webcore.platform.notification;

import com.webcore.platform.notification.dao.NotificationDAO;
import com.webcore.platform.notification.dto.NotificationDTO;
import com.webcore.platform.notification.dto.NotificationReadDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService{

    private final NotificationDAO notificationDAO;

    @Override
    public Map<String, Object> getNotifications(Integer memberIdx) {
        List<NotificationDTO> alarmList = notificationDAO.selectNotifications(memberIdx);
        int unReadCount = notificationDAO.countUnreadNotifications(memberIdx);

        Map<String, Object> result = new HashMap<>();
        result.put("alarmList", alarmList);
        result.put("unReadCount", unReadCount);

        return result;
    }

    @Override
    public boolean createNotification(NotificationDTO notificationDTO) {
        int result = notificationDAO.insertNotification(notificationDTO);
        return result > 0;
    }

    @Override
    public boolean markAsRead(NotificationReadDTO notificationReadDTO) {
        int result = notificationDAO.insertNotificationRead(notificationReadDTO);
        return result > 0;
    }

    @Override
    public int getUnreadCount(Integer memberIdx) {
        return notificationDAO.countUnreadNotifications(memberIdx);
    }
}
