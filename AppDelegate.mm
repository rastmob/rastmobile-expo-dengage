#import "AppDelegate.h"
#import <Firebase/Firebase.h>

#import <React/RCTBundleURLProvider.h>
#import <React/RCTLinkingManager.h>
#import <react_native_dengage/react_native_dengage-Swift.h>


@implementation AppDelegate
{
  id<UNUserNotificationCenterDelegate> _wisDelegate;
  NSTimer *_delegateCheckTimer;
}

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
// @generated begin @react-native-firebase/app-didFinishLaunchingWithOptions - expo prebuild (DO NOT MODIFY) sync-ecd111c37e49fdd1ed6354203cd6b1e2a38cccda
[FIRApp configure];
// @generated end @react-native-firebase/app-didFinishLaunchingWithOptions
  self.moduleName = @"main";

  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};

  /**** Dengage Setup code Starting here ********/
DengageRNCoordinator *coordinator = [DengageRNCoordinator staticInstance];
[coordinator setupDengage:@"4D3bi8vv8x1lX2U5SeA6rQQF6TXcxAVtYrXdsIt1Xj4XFcWQrXNaJ0_p_l_tNwytftwpVZgAaH0c1RBjBmP4Kdem24nP4m1IE3ToN2LaHr11oBy7BbdMd3Y4CXc3XBw4umpXQXitvwQ0SmdIPyBh2GYWzg_e_q__e_q_" launchOptions:launchOptions application:application askNotificaionPermission:YES enableGeoFence:YES disableOpenURL:NO badgeCountReset:NO];
UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
center.delegate = self;
/**** Dengage Setup code ends here ********/

BOOL result = [super application:application didFinishLaunchingWithOptions:launchOptions];

UNUserNotificationCenter *centerAfterSuper = [UNUserNotificationCenter currentNotificationCenter];
if (centerAfterSuper.delegate != nil && centerAfterSuper.delegate != self) {
  _wisDelegate = centerAfterSuper.delegate;
  centerAfterSuper.delegate = self;
}

_delegateCheckTimer = [NSTimer scheduledTimerWithTimeInterval:0.1
                                                      repeats:YES
                                                        block:^(NSTimer * _Nonnull timer) {
  [self captureWISDelegateIfNeeded];
}];

return result;
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self bundleURL];
}

- (NSURL *)bundleURL
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@".expo/.virtual-metro-entry"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

// Linking API
- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options {
  return [super application:application openURL:url options:options] || [RCTLinkingManager application:application openURL:url options:options];
}

// Universal Links
- (BOOL)application:(UIApplication *)application continueUserActivity:(nonnull NSUserActivity *)userActivity restorationHandler:(nonnull void (^)(NSArray<id<UIUserActivityRestoring>> * _Nullable))restorationHandler {
  BOOL result = [RCTLinkingManager application:application continueUserActivity:userActivity restorationHandler:restorationHandler];
  return [super application:application continueUserActivity:userActivity restorationHandler:restorationHandler] || result;
}

// Explicitly define remote notification delegates to ensure compatibility with some third-party libraries
- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
{
  DengageRNCoordinator *coordinator = [DengageRNCoordinator staticInstance];
[coordinator registerForPushToken:deviceToken];
[super application:application didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
}

// Explicitly define remote notification delegates to ensure compatibility with some third-party libraries
- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error
{
  return [super application:application didFailToRegisterForRemoteNotificationsWithError:error];
}

- (void)captureWISDelegateIfNeeded
{
  UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
  if (center.delegate != nil && center.delegate != self && !_wisDelegate) {
    _wisDelegate = center.delegate;
    center.delegate = self;
    
    // Stop the timer once we've captured the delegate
    if (_delegateCheckTimer) {
      [_delegateCheckTimer invalidate];
      _delegateCheckTimer = nil;
    }
  }
}

- (void)applicationDidBecomeActive:(UIApplication *)application
{
  [self captureWISDelegateIfNeeded];
  [super applicationDidBecomeActive:application];
}

- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler
{
  
  if (_wisDelegate && [_wisDelegate respondsToSelector:@selector(application:didReceiveRemoteNotification:fetchCompletionHandler:)]) {
  }
  
  [super application:application didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];
}

-(void)userNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(UNNotificationPresentationOptions options))completionHandler
{
  if (!_wisDelegate) {
    UNUserNotificationCenter *notifCenter = [UNUserNotificationCenter currentNotificationCenter];
    id<UNUserNotificationCenterDelegate> currentDelegate = notifCenter.delegate;
    if (currentDelegate != nil && currentDelegate != self) {
      _wisDelegate = currentDelegate;
      notifCenter.delegate = self;
    }
  }

  if (_wisDelegate && [_wisDelegate respondsToSelector:@selector(userNotificationCenter:willPresentNotification:withCompletionHandler:)]) {
    [_wisDelegate userNotificationCenter:center willPresentNotification:notification withCompletionHandler:completionHandler];
  } else {
    completionHandler(UNNotificationPresentationOptionSound | UNNotificationPresentationOptionAlert | UNNotificationPresentationOptionBadge);
  }
}

- (void)userNotificationCenter:(UNUserNotificationCenter *)center didReceiveNotificationResponse:(UNNotificationResponse *)response withCompletionHandler:(void (^)(void))completionHandler
{
  if (!_wisDelegate) {
    UNUserNotificationCenter *notifCenter = [UNUserNotificationCenter currentNotificationCenter];
    id<UNUserNotificationCenterDelegate> currentDelegate = notifCenter.delegate;
    if (currentDelegate != nil && currentDelegate != self) {
      _wisDelegate = currentDelegate;
      notifCenter.delegate = self;
    }
  }

  if (_wisDelegate && [_wisDelegate respondsToSelector:@selector(userNotificationCenter:didReceiveNotificationResponse:withCompletionHandler:)]) {
    [_wisDelegate userNotificationCenter:center didReceiveNotificationResponse:response withCompletionHandler:^{
    }];

      DengageRNCoordinator *coordinator = [DengageRNCoordinator staticInstance];
      [coordinator didReceivePush:center response:response withCompletionHandler:^{
        completionHandler();
      }];
  } else {
    DengageRNCoordinator *coordinator = [DengageRNCoordinator staticInstance];
    [coordinator didReceivePush:center response:response withCompletionHandler:^{
      completionHandler();
    }];
  }
}

@end
