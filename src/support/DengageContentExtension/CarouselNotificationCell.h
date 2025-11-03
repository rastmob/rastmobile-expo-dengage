//
//  CarouselNotificationCell.h
//  DengageContentExtension
//
//  Created by Rastmobile Team
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface CarouselNotificationCell : UICollectionViewCell

@property (nonatomic, weak) IBOutlet UIImageView *imageView;
@property (nonatomic, weak) IBOutlet UILabel *title;
@property (nonatomic, weak) IBOutlet UILabel *desc;
@property (nonatomic, weak) IBOutlet UIView *viewContainer;

- (void)configureWithImagePath:(NSString *)imagePath;
- (void)configureWithImagePath:(NSString *)imagePath title:(NSString *)title desc:(NSString *)desc;

@end

NS_ASSUME_NONNULL_END
