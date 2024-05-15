package com.sample;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import androidx.core.app.NotificationCompat;
import androidx.core.app.RemoteInput;

public class NotificationHelper {

    public static final String CHANNEL_ID = "channel_id";
    public static final int NOTIFICATION_ID = 101;
    public static final String KEY_REPLY = "key_reply";

    public static void createNotification(Context context) {
        NotificationManager notificationManager =
            (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);

        // 알림 채널 생성
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                    CHANNEL_ID,
                    "Channel Name",
                    NotificationManager.IMPORTANCE_DEFAULT
            );
            notificationManager.createNotificationChannel(channel);
        }

        // 인텐트와 PendingIntent 준비
        Intent replyIntent = new Intent(context, NotificationFixedActionReceiver.class);
        replyIntent.setAction("com.sample.REPLY_ACTION");
        PendingIntent replyPendingIntent = PendingIntent.getBroadcast(
                context,
                0,
                replyIntent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_MUTABLE
        );

        // RemoteInput 추가
        RemoteInput remoteInput = new RemoteInput.Builder(KEY_REPLY)
                .setLabel("답변 입력...")
                .build();

        // 알림에 추가할 액션
        NotificationCompat.Action replyAction = new NotificationCompat.Action.Builder(
            R.drawable.kakaotalk_20240105_025405447, "답변하기", replyPendingIntent)
            .addRemoteInput(remoteInput) // RemoteInput 추가
            .build();

        // 알림 생성
        Notification notification = new NotificationCompat.Builder(context, CHANNEL_ID)
                .setSmallIcon(R.drawable.kakaotalk_20240105_025405447)
                .setContentTitle("노티 NOTI")
                .setContentText("지금 어떤걸 하고 계신가요?")
                .addAction(replyAction) // 액션 추가
                .setPriority(NotificationCompat.PRIORITY_HIGH)
                .build();

        // 알림 고정
        notification.flags |= Notification.FLAG_NO_CLEAR;

        // 알림 표시
        notificationManager.notify(NOTIFICATION_ID, notification);
    }
}
