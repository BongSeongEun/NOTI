package com.sample;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import androidx.core.app.RemoteInput;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Callback;
import okhttp3.Response;
import java.io.IOException;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;

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
                sendInputToServer(context, input, userId);
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
            public void onFailure(okhttp3.Call call, IOException e) {
                Log.e(TAG, "Error sending input to server", e);
            }

            @Override
            public void onResponse(okhttp3.Call call, Response response) throws IOException {
                if (response.isSuccessful()) {
                    Log.d(TAG, "Response: " + response.body().string());
                } else {
                    Log.e(TAG, "Server returned error: " + response.code());
                }
            }
        });
    }
}
