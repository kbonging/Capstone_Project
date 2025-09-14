package com.webcore.platform.notification;

import com.webcore.platform.notification.dao.NotificationDAO;
import com.webcore.platform.notification.dto.NotificationDTO;
import com.webcore.platform.notification.dto.NotificationReadDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService{

    private final NotificationDAO notificationDAO;

    @Override
    public List<NotificationDTO> getNotifications(Integer memberIdx) {
        return notificationDAO.selectNotifications(memberIdx);
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
