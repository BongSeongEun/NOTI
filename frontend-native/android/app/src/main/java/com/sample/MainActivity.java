package com.sample;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Context;
import android.os.Build;
import android.os.Bundle;
import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;
import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;

public class MainActivity extends ReactActivity {

  // 알림 채널 ID 상수
  private final String CHANNEL_ID = "0:1709009596769056%481916b7481916b7";
  private final int NOTIFICATION_ID = 001; // 알림 ID

  /**
   * Returns the name of the main component registered from JavaScript.
   * This is used to schedule rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "sample";
  }

  /**
   * onCreate 메서드 오버라이드하여 알림 채널 생성
   */
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    createNotificationChannel();
  }

  /**
   * Returns the instance of the {@link ReactActivityDelegate}.
   */
  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new MainActivityDelegate(this, getMainComponentName());
  }

  public static class MainActivityDelegate extends ReactActivityDelegate {
    public MainActivityDelegate(ReactActivity activity, String mainComponentName) {
      super(activity, mainComponentName);
    }

    @Override
    protected ReactRootView createRootView() {
      ReactRootView reactRootView = new ReactRootView(getContext());
      reactRootView.setIsFabric(BuildConfig.IS_NEW_ARCHITECTURE_ENABLED);
      return reactRootView;
    }
  }

  /**
   * 알림 채널을 생성하는 메서드
   */
  private void createNotificationChannel() {
    // 안드로이드 Oreo 버전 이상에서는 알림 채널이 필요함
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      CharSequence name = getString(R.string.channel_name); // 채널 이름
      String description = getString(R.string.channel_description); // 채널 설명
      int importance = NotificationManager.IMPORTANCE_DEFAULT; // 중요도 설정
      NotificationChannel channel = new NotificationChannel(CHANNEL_ID, name, importance);
      channel.setDescription(description);
      // 채널을 시스템에 등록
      NotificationManager notificationManager = getSystemService(NotificationManager.class);
      notificationManager.createNotificationChannel(channel);
    }
  }

  /**
   * 알림을 보내는 메서드
   */
  private void sendNotification(String message) {
    NotificationCompat.Builder builder = new NotificationCompat.Builder(this, CHANNEL_ID)
        .setSmallIcon(R.drawable.ic_notification) // 알림 아이콘
        .setContentTitle("새 알림") // 알림 제목
        .setContentText(message) // 알림 내용
        .setPriority(NotificationCompat.PRIORITY_DEFAULT); // 우선순위

    NotificationManagerCompat notificationManager = NotificationManagerCompat.from(this);

    // 알림 표시
    notificationManager.notify(NOTIFICATION_ID, builder.build());
  }
}
