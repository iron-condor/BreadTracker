package com.condor.breadtracker.push;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.messaging.BatchResponse;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.FirebaseMessagingException;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;

@Component
public class PushManager {

  @Value("${push.fcm_id}")
  private String fcmString;

  @Autowired
  private FirebaseMessaging fcm;

  public boolean sendPushNotification(String title, String message) {
    try {
      Notification notification = Notification.builder().setTitle(title).setBody(message).build();
      Message msg = Message.builder()
        .setToken(fcmString)
        .putData("body", message)
        .putData("title", title)
        .setNotification(notification)
        .build();
      String messageID = fcm.send(msg);
      System.out.println("Successfully sent message. ID: " + messageID);
    } catch (FirebaseMessagingException e) {
      // TODO: Handle this exception
      e.printStackTrace();
      return false;
    }
    return true;
  }
}
