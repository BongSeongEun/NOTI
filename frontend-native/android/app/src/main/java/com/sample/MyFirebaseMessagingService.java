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
import java.util.concurrent.atomic.AtomicInteger;
import android.os.Build;


public class MyFirebaseMessagingService extends FirebaseMessagingService {
    public static final String CHANNEL_ID = "your_channel_id";
    private AtomicInteger notificationIdCounter = new AtomicInteger(0);

    @Override
    public void onMessageReceived(RemoteMessage remoteMessage) {
        if (remoteMessage.getData().size() > 0) {
            Map<String, String> data = remoteMessage.getData();

            String title = data.get("title");
            String body = data.get("body");
            String todoId = data.get("todoId");
            String userId = data.get("userId");

            // 알림을 표시하는 함수 호출
            showNotification(title, body, todoId, userId);
        }
    }

    private void showNotification(String title, String body, String todoId, String userId) {
        int notificationId = notificationIdCounter.getAndIncrement();
        Intent yesIntent = new Intent(this, NotificationActionReceiver.class);
        yesIntent.setAction("YES_ACTION"); // 예 버튼 액션
        yesIntent.putExtra("todoId", todoId);
        yesIntent.putExtra("userId", userId);
        yesIntent.putExtra("notificationId", notificationId);
        PendingIntent yesPendingIntent = PendingIntent.getBroadcast(
            this, notificationId, yesIntent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);

        Intent noIntent = new Intent(this, NotificationActionReceiver.class);
        noIntent.setAction("NO_ACTION"); // 아니오 버튼 액션
        yesIntent.putExtra("todoId", todoId);
        yesIntent.putExtra("userId", userId);
        noIntent.putExtra("notificationId", notificationId + 1);
        PendingIntent noPendingIntent = PendingIntent.getBroadcast(
            this, notificationId + 1, noIntent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_MUTABLE);

        NotificationCompat.Builder notificationBuilder = new NotificationCompat.Builder(this, CHANNEL_ID)
            .setSmallIcon(R.drawable.kakaotalk_20240105_025405447)
            .setContentTitle(title)
            .setContentText(body)
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .addAction(R.drawable.ic_yes, "예", yesPendingIntent)
            .addAction(R.drawable.ic_no, "아니오", noPendingIntent);

        NotificationManager notificationManager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
        notificationManager.notify(0, notificationBuilder.build());
    }

    // private void showChatNotification(String title, String body, String todoId, String userId){
    //     String replyLabel = "여기에 답장을 입력하세요";
    //     RemoteInput remoteInput = new RemoteInput.Builder("KEY_TEXT_REPLY")
    //         .setLabel(replyLabel)
    //         .build();

    //     Intent replyIntent = new Intent(this, ReplyReceiver.class);
    //     PendingIntent replyPendingIntent =
    //         PendingIntent.getBroadcast(getApplicationContext(),
    //             0, replyIntent,
    //             PendingIntent.FLAG_UPDATE_CURRENT);

    //     // '답장' 액션 생성
    //     NotificationCompat.Action replyAction =
    //         new NotificationCompat.Action.Builder(R.drawable.ic_reply_icon,
    //             "답장", replyPendingIntent)
    //             .addRemoteInput(remoteInput)
    //             .build();

    //     // 알림 빌더에 액션 추가
    //     NotificationCompat.Builder notificationBuilder = new NotificationCompat.Builder(this, CHANNEL_ID)
    //         .setSmallIcon(R.drawable.kakaotalk_20240105_025405447)
    //         .setContentTitle(title)
    //         .setContentText(body)
    //         .setPriority(NotificationCompat.PRIORITY_HIGH)
    //         .addAction(replyAction);
    // }
}
