 #import <UserNotifications/UserNotifications.h>

 @interface DengageNotificationService : UNNotificationServiceExtension

 @property (nonatomic, copy) void (^contentHandler)(UNNotificationContent *);
 @property (nonatomic, strong) UNMutableNotificationContent *content;

 @end

