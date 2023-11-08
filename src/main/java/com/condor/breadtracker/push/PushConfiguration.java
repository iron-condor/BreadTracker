package com.condor.breadtracker.push;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.messaging.FirebaseMessaging;

@Configuration
public class PushConfiguration {
  @Value("${push.service_account_location}")
  private String serviceAccountLocation;

  @Bean
  FirebaseMessaging firebaseMessaging(FirebaseApp firebaseApp) {
    return FirebaseMessaging.getInstance(firebaseApp);
  }

  @Bean
  FirebaseApp firebaseApp(GoogleCredentials credentials) {
    FirebaseOptions options = FirebaseOptions.builder()
        .setCredentials(credentials)
        .build();

    return FirebaseApp.initializeApp(options);
  }

  @Bean
  GoogleCredentials googleCredentials() throws FileNotFoundException, IOException {
    if (serviceAccountLocation != null) {
      try (InputStream is = new FileInputStream(new File(serviceAccountLocation))) {
        return GoogleCredentials.fromStream(is);
      }
    } else {
      // Use standard credentials chain. Useful when running inside GKE
      return GoogleCredentials.getApplicationDefault();
    }
  }
}
