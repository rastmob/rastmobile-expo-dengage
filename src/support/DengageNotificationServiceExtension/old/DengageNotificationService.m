
#import "DengageNotificationService.h"

@implementation DengageNotificationService

- (void)didReceiveNotificationRequest:(UNNotificationRequest *)request
                    withContentHandler:(void (^)(UNNotificationContent *))contentHandler {
  
  NSLog(@"DENGAGENOTIFICATIONTEST DID RECEIVE");
 
    self.contentHandler = contentHandler;
    self.content = [request.content mutableCopy];

    if (self.content) {
        UNNotificationAttachment * (^saveAttachment)(NSString *, NSData *, NSDictionary *) =
        ^UNNotificationAttachment * (NSString *identifier, NSData *data, NSDictionary *options) {
            NSURL *directoryURL = [NSURL fileURLWithPath:NSTemporaryDirectory()];
            directoryURL = [directoryURL URLByAppendingPathComponent:[[NSProcessInfo processInfo] globallyUniqueString]
                                                            isDirectory:YES];

            NSError *error;
            [[NSFileManager defaultManager] createDirectoryAtURL:directoryURL
                                     withIntermediateDirectories:YES
                                                      attributes:nil
                                                           error:&error];

            if (error) {
                return nil;
            }
            
            NSURL *fileURL = [directoryURL URLByAppendingPathComponent:identifier];
            [data writeToURL:fileURL options:0 error:&error];
            
            if (error) {
                return nil;
            }
            
            UNNotificationAttachment *attachment = [UNNotificationAttachment attachmentWithIdentifier:identifier
                                                                                                  URL:fileURL
                                                                                              options:options
                                                                                                error:&error];
            
            if (error) {
                return nil;
            }
            
            return attachment;
        };
        
        void (^exitGracefully)(NSString *) = ^(NSString *reason) {
            UNMutableNotificationContent *bca = [request.content mutableCopy];
            bca.title = reason;
            self.contentHandler(bca);
        };
        
        dispatch_async(dispatch_get_main_queue(), ^{
            UNMutableNotificationContent *content = [request.content mutableCopy];
            
            if (!content) {
                return exitGracefully(nil);
            }
            
            NSDictionary *userInfo = request.content.userInfo;
          
          NSLog(@"DENGAGENOTIFICATIONTEST %@", request);
            
            NSString *attachmentURL = userInfo[@"urlImageString"];
            if (!attachmentURL) {
                return exitGracefully(nil);
            }
            
            NSData *imageData = [NSData dataWithContentsOfURL:[NSURL URLWithString:attachmentURL]];
            if (!imageData) {
                return exitGracefully(nil);
            }
            
            UNNotificationAttachment *attachment = saveAttachment(@"image.png", imageData, nil);
            if (!attachment) {
                return exitGracefully(nil);
            }
            
            content.attachments = @[attachment];
          
          content.categoryIdentifier = request.content.categoryIdentifier;
          
            self.contentHandler(content);
        });
    }
}

- (void)serviceExtensionTimeWillExpire {
    if (self.contentHandler && self.content) {
        self.contentHandler(self.content);
    }
}

@end
