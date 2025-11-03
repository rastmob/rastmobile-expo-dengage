//
//  NotificationViewController.m
//  DengageContentExtension
//
//  Created by Rastmobile Team
//

#import "DengageNotificationViewController.h"

@implementation DengageNotificationViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any required interface initialization here.
  NSLog(@"DENGAGENOTIFICATIONTEST CONTENT viewDidLoad");
    NSLog(@"viewDidLoad");
}

- (void)viewDidLoad:(UICollectionView *)collectionView {
    [super viewDidLoad];
    
    self.dengageCollectionView = collectionView;
    self.dengageCollectionView.delegate = self;
    self.dengageCollectionView.dataSource = self;
    self.dengageCollectionView.contentInset = UIEdgeInsetsMake(10.0, 10.0, 10.0, 10.0);
}

- (void)viewWillAppear:(BOOL)animated {
    [super viewWillAppear:animated];
}

- (void)viewDidAppear:(BOOL)animated {
    [super viewDidAppear:animated];
}

- (void)didReceiveNotification:(UNNotification *)notification {
  
  NSLog(@"DENGAGENOTIFICATIONTEST CONTENT DID RECEIVE");
  
  NSLog(@"DENGAGENOTIFICATIONTEST CONTENT notification %@", notification);
  
    self.bestAttemptContent = [notification.request.content mutableCopy];
  self.payloads = [[NSMutableArray alloc]init];
    
    if (self.bestAttemptContent) {
        NSArray *carouselContents = self.bestAttemptContent.userInfo[@"carouselContent"];
        if (carouselContents && [carouselContents isKindOfClass:[NSArray class]]) {
          NSLog(@"DENGAGENOTIFICATIONTEST CONTENT carouselContents is array %@", carouselContents);
            for (NSDictionary *contentDictionary in carouselContents) {
              NSLog(@"DENGAGENOTIFICATIONTEST CONTENT contentDictionary %@", contentDictionary);
                DengageRecievedMessage *dengagePayload = [[DengageRecievedMessage alloc] init];
                dengagePayload.image = contentDictionary[@"mediaUrl"];
                dengagePayload.title = contentDictionary[@"title"];
                dengagePayload.desc = contentDictionary[@"desc"];
                [self.payloads addObject:dengagePayload];
            }
          
          NSLog(@"DENGAGENOTIFICATIONTEST CONTENT CELL payloads %@", self.payloads);
            
            dispatch_async(dispatch_get_main_queue(), ^{
                [self.dengageCollectionView reloadData];
            });
        } else {
          NSLog(@"DENGAGENOTIFICATIONTEST CONTENT carouselContents is not array %@", carouselContents);
        }
    }
}

- (void)didReceiveNotificationResponse:(UNNotificationResponse *)response completionHandler:(void (^)(UNNotificationContentExtensionResponseOption))completion {
    if ([response.actionIdentifier isEqualToString:@"NEXT_ACTION"]) {
        [self scrollNextItem];
        completion(UNNotificationContentExtensionResponseOptionDoNotDismiss);
    } else if ([response.actionIdentifier isEqualToString:@"PREVIOUS_ACTION"]) {
        [self scrollPreviousItem];
        completion(UNNotificationContentExtensionResponseOptionDoNotDismiss);
    } else {
        completion(UNNotificationContentExtensionResponseOptionDismissAndForwardAction);
    }
}

- (void)scrollNextItem {
    self.currentIndex = (self.currentIndex == self.payloads.count - 1) ? 0 : self.currentIndex + 1;
    NSIndexPath *indexPath = [NSIndexPath indexPathForRow:self.currentIndex inSection:0];
    self.dengageCollectionView.contentInset = UIEdgeInsetsMake(10.0, 10.0, 10.0, 10.0);
    if (indexPath.row == 0 || indexPath.row == self.payloads.count - 1) {
        self.dengageCollectionView.contentInset = UIEdgeInsetsMake(10.0, 10.0, 10.0, 10.0);
    } else {
        self.dengageCollectionView.contentInset = UIEdgeInsetsMake(10.0, 20.0, 10.0, 10.0);
    }
    [self.dengageCollectionView scrollToItemAtIndexPath:indexPath atScrollPosition:UICollectionViewScrollPositionRight animated:YES];
}

- (void)scrollPreviousItem {
    self.currentIndex = (self.currentIndex == 0) ? self.payloads.count - 1 : self.currentIndex - 1;
    NSIndexPath *indexPath = [NSIndexPath indexPathForRow:self.currentIndex inSection:0];
    self.dengageCollectionView.contentInset = UIEdgeInsetsMake(10.0, 10.0, 10.0, 10.0);
    if (indexPath.row == 0 || indexPath.row == self.payloads.count - 1) {
        self.dengageCollectionView.contentInset = UIEdgeInsetsMake(10.0, 10.0, 10.0, 10.0);
    } else {
        self.dengageCollectionView.contentInset = UIEdgeInsetsMake(10.0, 10.0, 10.0, 20.0);
    }
    [self.dengageCollectionView scrollToItemAtIndexPath:indexPath atScrollPosition:UICollectionViewScrollPositionLeft animated:YES];
}

#pragma mark - UICollectionViewDelegate

- (void)collectionView:(UICollectionView *)collectionView didSelectItemAtIndexPath:(NSIndexPath *)indexPath {
    
}

- (void)collectionView:(UICollectionView *)collectionView didDeselectItemAtIndexPath:(NSIndexPath *)indexPath {
    
}

#pragma mark - UICollectionViewDataSource

- (NSInteger)numberOfSectionsInCollectionView:(UICollectionView *)collectionView {
    return 1;
}

- (NSInteger)collectionView:(UICollectionView *)collectionView numberOfItemsInSection:(NSInteger)section {
    return self.payloads.count;
}

- (UICollectionViewCell *)collectionView:(UICollectionView *)collectionView cellForItemAtIndexPath:(NSIndexPath *)indexPath {
  NSLog(@"DENGAGENOTIFICATIONTEST CONTENT cellForItemAtIndexPath");
    NSString *identifier = @"CarouselNotificationCell";
    [self.dengageCollectionView registerNib:[UINib nibWithNibName:identifier bundle:nil] forCellWithReuseIdentifier:identifier];
    CarouselNotificationCell *cell = [collectionView dequeueReusableCellWithReuseIdentifier:identifier forIndexPath:indexPath];
    DengageRecievedMessage *payload = self.payloads[indexPath.row];
  NSLog(@"DENGAGENOTIFICATIONTEST CONTENT CELL payload %@", payload);
    [cell configureWithImagePath:payload.image title:payload.title desc:payload.desc];
    cell.layer.cornerRadius = 8.0;
  
  
  
    return cell;
}

- (CGSize)collectionView:(UICollectionView *)collectionView layout:(UICollectionViewLayout *)collectionViewLayout sizeForItemAtIndexPath:(NSIndexPath *)indexPath {
    CGFloat width = self.dengageCollectionView.frame.size.width;
    CGFloat cellWidth = (indexPath.row == 0 || indexPath.row == self.payloads.count - 1) ? (width - 30) : (width - 40);
    return CGSizeMake(cellWidth, width - 20.0);
}

@end
