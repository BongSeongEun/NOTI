package com.sample;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import androidx.core.app.NotificationCompat;
import androidx.core.app.RemoteInput;
import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;
import java.io.IOException;
import android.content.SharedPreferences;
import android.util.Log;
import android.os.Bundle;

public class NotificationFixedActionReceiver extends BroadcastReceiver {
    private static final String TAG = NotificationFixedActionReceiver.class.getSimpleName();

    @Override
    public void onReceive(Context context, Intent intent) {
        String action = intent.getAction();
        if ("com.sample.REPLY_ACTION".equals(action)) {
            SharedPreferences sharedPreferences = context.getSharedPreferences("MyAppPrefs", Context.MODE_PRIVATE);
            String userId = sharedPreferences.getString("userId", null);
            Log.d(TAG, "Retrieved userId: " + userId); // 로그 추가
    
            Bundle results = RemoteInput.getResultsFromIntent(intent);
            if (results != null) {
                String input = results.getCharSequence(NotificationHelper.KEY_REPLY).toString();
                Log.d(TAG, "User input from notification: " + input); // 입력된 내용 로깅
                // 입력 데이터로 필요한 작업 수행, 예를 들어 서버로 전송
                new Thread(() -> sendInputToServer(context, input, userId)).start();
            }
        }
    }

    private void sendInputToServer(Context context, String input, String userId) {
        OkHttpClient client = new OkHttpClient();
        String json = "{\"chat_content\": \"" + input + "\" }";
        RequestBody body = RequestBody.create(MediaType.parse("application/json; charset=utf-8"), json);
        Request request = new Request.Builder()
            .url("http://15.164.151.130:4000/api/v3/ask/" + userId)
            .post(body)
            .build();
        
        client.newCall(request).enqueue(new Callback() {
            @Override
            public void onFailure(Call call, IOException e) {
                e.printStackTrace();
            }

            @Override
            public void onResponse(Call call, Response response) throws IOException {
                if (response.isSuccessful()) {
                    String responseBody = response.body().string();
                    Log.d(TAG, "Response from server: " + responseBody);
                    // 서버 응답 내용을 알림으로 다시 표시
                    updateNotification(context, responseBody);
                } else {
                    Log.e(TAG, "Failed to send input to server: " + response.message());
                }
            }
        });
    }

    private void updateNotification(Context context, String responseBody) {
        NotificationManager notificationManager = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);

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
        RemoteInput remoteInput = new RemoteInput.Builder(NotificationHelper.KEY_REPLY)
                .setLabel("답변 입력...")
                .build();

        // 알림에 추가할 액션
        NotificationCompat.Action replyAction = new NotificationCompat.Action.Builder(
            R.drawable.notilogo, "답변하기", replyPendingIntent)
            .addRemoteInput(remoteInput) // RemoteInput 추가
            .build();

        // 앱을 열기 위한 인텐트와 PendingIntent 생성
        Intent appIntent = new Intent(context, MainActivity.class); // MainActivity를 원하는 액티비티로 변경
        appIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
        PendingIntent appPendingIntent = PendingIntent.getActivity(
                context,
                0,
                appIntent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );

        // 알림 갱신
        NotificationCompat.Builder notificationBuilder = new NotificationCompat.Builder(context, NotificationHelper.CHANNEL_ID)
                .setSmallIcon(R.drawable.notilogo)
                .setContentTitle("노티 NOTI")
                .setContentText(responseBody) // 기본 텍스트 설정
                .setStyle(new NotificationCompat.BigTextStyle()
                    .bigText(responseBody)) // BigTextStyle로 설정하여 확장 시 전체 텍스트 표시
                .addAction(replyAction) // 액션 추가
                .setPriority(NotificationCompat.PRIORITY_HIGH)
                .setContentIntent(appPendingIntent) // 알림 클릭 시 앱 열기
                .setAutoCancel(true); // 알림을 클릭하면 자동으로 취소되도록 설정

        // 알림 고정 해제 (확장 시 자동으로 사라지도록 설정)
        notificationBuilder.setOngoing(false);

        // 알림 표시
        notificationManager.notify(NotificationHelper.NOTIFICATION_ID, notificationBuilder.build());
    }
}
