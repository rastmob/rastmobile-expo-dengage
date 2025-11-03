//
//  NotificationViewController.h
//  DengageContentExtension
//
//  Created by Rastmobile Team
//

#import <UIKit/UIKit.h>
#import <UserNotifications/UserNotifications.h>
#import <UserNotificationsUI/UserNotificationsUI.h>
#import "DengageRecievedMessage.h"
#import "CarouselNotificationCell.h"

NS_ASSUME_NONNULL_BEGIN

@interface DengageNotificationViewController : UIViewController <UNNotificationContentExtension, UICollectionViewDelegate, UICollectionViewDataSource, UICollectionViewDelegateFlowLayout>

@property (nonatomic, weak) IBOutlet UICollectionView *dengageCollectionView;
@property (nonatomic, strong) UNMutableNotificationContent *bestAttemptContent;
@property (nonatomic, assign) NSInteger currentIndex;
@property (nonatomic, strong) NSMutableArray<DengageRecievedMessage *> *payloads;

@end

NS_ASSUME_NONNULL_END
