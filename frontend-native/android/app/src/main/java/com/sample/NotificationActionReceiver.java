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


public class NotificationActionReceiver extends BroadcastReceiver {

    @Override
    public void onReceive(Context context, Intent intent) {
        String userId = intent.getStringExtra("userId");
        String todoId = intent.getStringExtra("todoId");
        String action = intent.getStringExtra("action");
        if ("yes".equals(action)) {
            OkHttpClient client = new OkHttpClient();

                // JSON으로 서버에 전송할 데이터 구성
                JSONObject data = new JSONObject();
                try {
                    // 여기에 JSON 데이터를 추가합니다. 예를 들면:
                    // data.put("key", "value");
                    data.put("todoDone", "true");
                } catch (JSONException e) {
                    e.printStackTrace();
                }

                // RequestBody 생성 (JSON 타입)
                RequestBody requestBody = RequestBody.create(MediaType.parse("application/json; charset=utf-8"), data.toString());

                // Request 생성
                Request request = new Request.Builder()
                        .url("http://localhost:4000/api/v1/updateTodo/" + userId + "/" + todoId)
                        .post(requestBody)
                        .build();

                try {
                    // 동기적으로 요청을 보내고 응답을 기다림
                    Response response = client.newCall(request).execute();
                    // TODO: 응답 처리
                } catch (IOException e) {
                    e.printStackTrace();
                }
        } else if ("no".equals(action)) {
            // "아니오" 버튼 클릭 처리
        }
    }
}
