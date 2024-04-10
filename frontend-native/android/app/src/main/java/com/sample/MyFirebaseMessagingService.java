package com.sample;
import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.app.PendingIntent;
import androidx.core.app.NotificationCompat;
import android.app.NotificationManager;
import android.app.NotificationChannel;
import java.util.Map;
import android.os.Build;


public class MyFirebaseMessagingService extends FirebaseMessagingService {

    public static final String CHANNEL_ID = "your_channel_id";

    @Override
    public void onMessageReceived(RemoteMessage remoteMessage) {
        if (remoteMessage.getData().size() > 0) {
            Map<String, String> data = remoteMessage.getData();
            showNotification(data);
        }
    }


    private void showNotification(Map<String, String> data) {
        String title = data.get("title");
        String body = data.get("body");
    
        Intent yesIntent = new Intent(this, NotificationActionReceiver.class);
        yesIntent.putExtra("action", "yes");
        PendingIntent yesPendingIntent = PendingIntent.getBroadcast(this, 0, yesIntent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
    
        Intent noIntent = new Intent(this, NotificationActionReceiver.class);
        noIntent.putExtra("action", "no");
        PendingIntent noPendingIntent = PendingIntent.getBroadcast(this, 1, noIntent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_MUTABLE);
    
        NotificationCompat.Builder notificationBuilder = new NotificationCompat.Builder(this, "CHANNEL_ID")
                .setSmallIcon(R.drawable.ic_notification)
                .setContentTitle(title)
                .setContentText(body)
                .setPriority(NotificationCompat.PRIORITY_HIGH)
                .addAction(R.drawable.ic_yes, "예", yesPendingIntent)
                .addAction(R.drawable.ic_no, "아니오", noPendingIntent);
    
        NotificationManager notificationManager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
        notificationManager.notify(0, notificationBuilder.build());
    }

    @Override
    public void onCreate() {
        super.onCreate();
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            CharSequence name = getString(R.string.channel_name);
            String description = getString(R.string.channel_description);
            int importance = NotificationManager.IMPORTANCE_DEFAULT;
            NotificationChannel channel = new NotificationChannel("CHANNEL_ID", name, importance);
            channel.setDescription(description);
            NotificationManager notificationManager = getSystemService(NotificationManager.class);
            notificationManager.createNotificationChannel(channel);
        }
    }
}
