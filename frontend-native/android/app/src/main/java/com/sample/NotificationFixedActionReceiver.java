package com.sample;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import androidx.core.app.RemoteInput;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.uimanager.ViewManager;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List; 
import android.content.SharedPreferences;
import android.os.Bundle;

public class NotificationFixedActionReceiver extends BroadcastReceiver {

    @Override
    public void onReceive(Context context, Intent intent) {
        SharedPreferences sharedPreferences = context.getSharedPreferences("MyAppPrefs", Context.MODE_PRIVATE);
        String userId = sharedPreferences.getString("userId", null);
        Bundle results = RemoteInput.getResultsFromIntent(intent);
        if (results != null) {
            String input = results.getCharSequence(NotificationHelper.KEY_REPLY).toString();
            // 입력 데이터로 필요한 작업 수행, 예를 들어 서버로 전송
            sendInputToServer(context, userId, input);
        }
    }

    private void sendInputToServer(Context context, String input, String userId) {
        OkHttpClient client = new OkHttpClient();
        String json = "{\"chatContent\": \"" + input + "\" }";
        RequestBody body = RequestBody.create(MediaType.parse("application/json; charset=utf-8"), json);
        Request request = new Request.Builder()
        .url("http://15.164.151.130:4000/api/v3/ask" + userId + "/")
        .post(body)
        .build();
        Response response = client.newCall(request).execute();
    }
}
