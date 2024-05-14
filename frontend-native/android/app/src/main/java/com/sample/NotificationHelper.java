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
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.uimanager.ViewManager;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List; 
import android.content.SharedPreferences;
import android.os.Bundle;

public class NotificationHelper {

    private static final String CHANNEL_ID = "channel_id";
    private static final int NOTIFICATION_ID = 101;
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
                NOTIFICATION_ID,
                replyIntent,
                PendingIntent.FLAG_UPDATE_CURRENT
        );

        // RemoteInput 추가
        RemoteInput remoteInput = new RemoteInput.Builder(KEY_REPLY)
                .setLabel("답변 입력...")
                .build();

        // 알림에 추가할 액션
        // 예를 들어 아이콘, 텍스트, PendingIntent를 포함해야 합니다.
        NotificationCompat.Action replyAction = new NotificationCompat.Action.Builder(
            R.drawable.kakaotalk_20240105_025405447, "답변하기", replyPendingIntent)
            .addRemoteInput(remoteInput) // RemoteInput 추가
            .build();


        // 알림 생성
        Notification notification = new NotificationCompat.Builder(context, CHANNEL_ID)
                .setSmallIcon(R.drawable.kakaotalk_20240105_025405447)
                .setContentTitle("지금 어떤걸 하고 계신가요?")
                .setContentText("")
                .addAction(replyAction) // 액션 추가
                .setPriority(NotificationCompat.PRIORITY_HIGH)
                .build();

        // 알림 고정
        notification.flags |= Notification.FLAG_NO_CLEAR;

        // 알림 표시
        notificationManager.notify(NOTIFICATION_ID, notification);
    }
}
