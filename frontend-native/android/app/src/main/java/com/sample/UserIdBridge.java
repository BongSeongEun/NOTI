package com.sample;

import android.content.Context;
import android.content.SharedPreferences;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;

public class UserIdBridge extends ReactContextBaseJavaModule {

    private static final String PREFS_NAME = "MyAppPrefs";

    public UserIdBridge(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "UserIdBridge";
    }

    @ReactMethod
    public void sendUserIdToNative(String userId) {
        SharedPreferences sharedPreferences = getReactApplicationContext().getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = sharedPreferences.edit();
        editor.putString("userId", userId);
        editor.commit(); // Save userId to SharedPreferences
        NotificationHelper.createNotification(getReactApplicationContext());
    }
}
