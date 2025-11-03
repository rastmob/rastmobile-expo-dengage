//
//  CarouselNotificationCell.m
//  DengageContentExtension
//
//  Created by Rastmobile Team
//

#import "CarouselNotificationCell.h"

@implementation CarouselNotificationCell

- (void)configureWithImagePath:(NSString *)imagePath {
    [self setImageWithImagePath:imagePath];
}

- (void)configureWithImagePath:(NSString *)imagePath title:(NSString *)title desc:(NSString *)desc {
    [self setImageWithImagePath:imagePath];
    self.title.text = title;
    self.desc.text = desc;
    [self setColors];
}

- (void)setImageWithImagePath:(NSString *)imagePath {
    NSURL *url = [NSURL URLWithString:imagePath];
    if (!url) {
        NSLog(@"Failed to present attachment due to an invalid url: %@", imagePath);
        return;
    }
    
    NSURLSessionDataTask *task = [[NSURLSession sharedSession] dataTaskWithURL:url completionHandler:^(NSData *data, NSURLResponse *response, NSError *error) {
        if (!error) {
            UIImage *image = [UIImage imageWithData:data];
            dispatch_async(dispatch_get_main_queue(), ^{
                self.imageView.image = image;
            });
        }
    }];
    [task resume];
}

- (void)setColors {
    if (@available(iOS 13.0, *)) {
        if (self.traitCollection.userInterfaceStyle == UIUserInterfaceStyleDark) {
            self.title.textColor = UIColor.whiteColor;
            self.desc.textColor = UIColor.whiteColor;
            self.viewContainer.backgroundColor = UIColor.blackColor;
            self.backgroundColor = UIColor.blackColor;
        } else {
            self.title.textColor = UIColor.blackColor;
            self.desc.textColor = UIColor.blackColor;
            self.viewContainer.backgroundColor = UIColor.whiteColor;
            self.backgroundColor = UIColor.whiteColor;
        }
    } else {
        self.title.textColor = UIColor.blackColor;
        self.desc.textColor = UIColor.blackColor;
        self.viewContainer.backgroundColor = UIColor.whiteColor;
    }
}

- (void)awakeFromNib {
    [super awakeFromNib];
    // Initialization code
}

@end

