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
import android.os.Build;
import android.app.IntentService;
import androidx.annotation.Nullable;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;
import org.json.JSONException;
import org.json.JSONObject;
import java.io.IOException;
import androidx.annotation.NonNull;
import okhttp3.Call;
import okhttp3.Callback;

public class NotificationActionReceiver extends BroadcastReceiver {

    @Override
    public void onReceive(Context context, Intent intent) {
        String action = intent.getAction();
        String userId = intent.getStringExtra("userId");
        String todoId = intent.getStringExtra("todoId");
        int notificationId = intent.getIntExtra("notificationId", -1);
        if ("YES_ACTION".equals(action)) {
            OkHttpClient client = new OkHttpClient();
        
            // JSON으로 서버에 전송할 데이터 구성
            JSONObject data = new JSONObject();
            try {
                data.put("todoDone", true);
            } catch (JSONException e) {
                e.printStackTrace();
            }
        
            // RequestBody 생성 (JSON 타입)
            RequestBody requestBody = RequestBody.create(MediaType.parse("application/json; charset=utf-8"), data.toString());
        
            // Request 생성
            Request request = new Request.Builder()
                    .url("http://15.164.151.130:4000/api/v1/updateTodoDone/" + userId + "/" + todoId)
                    .put(requestBody)
                    .build();
        
            // 비동기 요청
            client.newCall(request).enqueue(new Callback() {
                @Override
                public void onFailure(Call call, IOException e) {
                    // 실패 처리
                    e.printStackTrace();
                }
        
                @Override
                public void onResponse(Call call, Response response) throws IOException {
                    // 성공 처리
                    if (response.isSuccessful()) {
                        NotificationManager notificationManager = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
                        notificationManager.cancel(notificationId);
                    }
                }
            });

        }
         else if ("NO_ACTION".equals(action)) {
            OkHttpClient client = new OkHttpClient();
        
            // JSON으로 서버에 전송할 데이터 구성
            JSONObject data = new JSONObject();
            try {
                data.put("todoDone", false);
            } catch (JSONException e) {
                e.printStackTrace();
            }
        
            // RequestBody 생성 (JSON 타입)
            RequestBody requestBody = RequestBody.create(MediaType.parse("application/json; charset=utf-8"), data.toString());
        
            // Request 생성
            Request request = new Request.Builder()
                    .url("http://15.164.151.130:4000/api/v1/updateTodoDone/" + userId + "/" + todoId)
                    .put(requestBody)
                    .build();
        
            // 비동기 요청
            client.newCall(request).enqueue(new Callback() {
                @Override
                public void onFailure(Call call, IOException e) {
                    // 실패 처리
                    e.printStackTrace();
                }
        
                @Override
                public void onResponse(Call call, Response response) throws IOException {
                    // 성공 처리
                    if (response.isSuccessful()) {
                        NotificationManager notificationManager = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
                        notificationManager.cancel(notificationId);
                    }
                }
            });
        }
    }
}
