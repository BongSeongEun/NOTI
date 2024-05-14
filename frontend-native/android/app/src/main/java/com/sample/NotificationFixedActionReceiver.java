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
import java.io.IOException;
import android.util.Log;
import org.json.JSONException;
import org.json.JSONObject;
import java.io.IOException;
import androidx.annotation.NonNull;

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
            //if (results != null) {
                String input = results.getCharSequence(NotificationHelper.KEY_REPLY).toString();
                Log.d(TAG, "User input from notification: " + input); // 입력된 내용 로깅
                // 입력 데이터로 필요한 작업 수행, 예를 들어 서버로 전송
                // sendInputToServer(context, input);
                OkHttpClient client = new OkHttpClient();
                JSONObject data = new JSONObject();
                    try {
                        data.put("chat_content", input);
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                
                RequestBody requestBody = RequestBody.create(MediaType.parse("application/json; charset=utf-8"), data.toString());
                
                Request request = new Request.Builder()
                .url("http://15.164.151.130:4000/api/v3/ask/" + userId)
                .post(requestBody)
                .build();
                try {
                    Response response = client.newCall(request).execute();
                } catch (IOException e) {
                    e.printStackTrace();
                }
             //       }
                }
    }

    private void sendInputToServer(Context context, String input) {
        SharedPreferences sharedPreferences = context.getSharedPreferences("MyAppPrefs", Context.MODE_PRIVATE);
        String userId = sharedPreferences.getString("userId", null);
        OkHttpClient client = new OkHttpClient();
        JSONObject data = new JSONObject();
            try {
                data.put("chat_content", input);
            } catch (JSONException e) {
                e.printStackTrace();
            }
        
        RequestBody requestBody = RequestBody.create(MediaType.parse("application/json; charset=utf-8"), data.toString());
        
        Request request = new Request.Builder()
        .url("http://15.164.151.130:4000/api/v3/ask/" + userId)
        .post(requestBody)
        .build();
        try {
            Response response = client.newCall(request).execute();
        } catch (IOException e) {
            e.printStackTrace();
        }
        
    }
}
