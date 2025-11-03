package expo.modules.rastmobiledengage;

import android.app.Notification;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.widget.RemoteViews;
import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;
import com.dengage.sdk.domain.push.model.CarouselItem;
import com.dengage.sdk.domain.push.model.Message;
import com.dengage.sdk.push.NotificationReceiver;

public class MyReceiver extends NotificationReceiver {

  @Override
  public void onCarouselRender(
      Context context,
      Intent intent,
      Message message,
      CarouselItem leftCarouselItem,
      CarouselItem currentCarouselItem,
      CarouselItem rightCarouselItem
  ) {
      super.onCarouselRender(
          context,
          intent,
          message,
          leftCarouselItem,
          currentCarouselItem,
          rightCarouselItem
      );

      String itemTitle = currentCarouselItem.getTitle();
      String itemDesc = currentCarouselItem.getDescription();

      // set intents (right button, left button, item click)
      Intent itemIntent = getItemClickIntent(intent.getExtras(), context.getPackageName());
      Intent leftIntent = getLeftItemIntent(intent.getExtras(), context.getPackageName());
      Intent rightIntent = getRightItemIntent(intent.getExtras(), context.getPackageName());
      Intent deleteIntent = getDeleteIntent(intent.getExtras(), context.getPackageName());
      Intent contentIntent = getContentIntent(intent.getExtras(), context.getPackageName());

      PendingIntent carouseItemIntent = getPendingIntent(context, 0, itemIntent);
      PendingIntent carouselLeftIntent = getPendingIntent(context, 1, leftIntent);
      PendingIntent carouselRightIntent = getPendingIntent(context, 2, rightIntent);
      PendingIntent deletePendingIntent = getPendingIntent(context, 4, deleteIntent);
      PendingIntent contentPendingIntent = getPendingIntent(context, 5, contentIntent);

      // set views for the layout
      RemoteViews collapsedView = new RemoteViews(
          context.getPackageName(),
          R.layout.den_carousel_collapsed
      );
      collapsedView.setTextViewText(R.id.den_carousel_title, message.getTitle());
      collapsedView.setTextViewText(R.id.den_carousel_message, message.getMessage());

      RemoteViews carouselView = new RemoteViews(
          context.getPackageName(),
          R.layout.den_carousel_portrait
      );
      carouselView.setTextViewText(R.id.den_carousel_title, message.getTitle());
      carouselView.setTextViewText(R.id.den_carousel_message, message.getMessage());
      carouselView.setTextViewText(R.id.den_carousel_item_title, itemTitle);
      carouselView.setTextViewText(R.id.den_carousel_item_description, itemDesc);

      carouselView.setOnClickPendingIntent(R.id.den_carousel_left_arrow, carouselLeftIntent);
      carouselView.setOnClickPendingIntent(
          R.id.den_carousel_portrait_current_image,
          carouseItemIntent
      );
      carouselView.setOnClickPendingIntent(R.id.den_carousel_item_title, carouseItemIntent);
      carouselView.setOnClickPendingIntent(R.id.den_carousel_item_description, carouseItemIntent);
      carouselView.setOnClickPendingIntent(R.id.den_carousel_right_arrow, carouselRightIntent);

      String channelId = createNotificationChannel(context, message);
/* 
      loadCarouselImageToView(
          carouselView,
          R.id.den_carousel_portrait_left_image,
          leftCarouselItem,
          new Runnable() {
              @Override
              public void run() {
                  // you can call notificationManager.notify for devices that could not show carousel image contents
              }
          }
      );

      loadCarouselImageToView(
          carouselView,
          R.id.den_carousel_portrait_current_image,
          currentCarouselItem,
          new Runnable() {
              @Override
              public void run() {
                  // you can call notificationManager.notify for devices that could not show carousel image contents
              }
          }
      );

      loadCarouselImageToView(
          carouselView,
          R.id.den_carousel_portrait_right_image,
          rightCarouselItem,
          new Runnable() {
              @Override
              public void run() {
                  // you can call notificationManager.notify for devices that could not show carousel image contents
              }
          }
      );
 */
      Notification notification = new NotificationCompat.Builder(context, channelId)
          .setSmallIcon(R.drawable.iconnotification)
          .setCustomContentView(collapsedView)
          .setCustomBigContentView(carouselView)
          .setContentIntent(contentPendingIntent)
          .setDeleteIntent(deletePendingIntent)
          .build();

      // show message again silently with next, previous and current item.
      notification.flags = Notification.FLAG_AUTO_CANCEL | Notification.FLAG_ONLY_ALERT_ONCE;

      // show message
      NotificationManagerCompat notificationManager = NotificationManagerCompat.from(context);
      notificationManager.notify(
          message.getMessageSource(),
          message.getMessageId(),
          notification
      );
  }
}