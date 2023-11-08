package com.condor.breadtracker.starter;

import java.util.concurrent.ScheduledThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.DisposableBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.condor.breadtracker.push.PushManager;

@Component
public class StarterPollingBean implements DisposableBean {
  ScheduledThreadPoolExecutor tpe = new ScheduledThreadPoolExecutor(1);
  @Autowired
  PushManager pushManager;

  public StarterPollingBean() {
    tpe.schedule(new ScanForHungryStarters(tpe), 10, TimeUnit.SECONDS);
  }

  @Override
  public void destroy() {
    tpe.shutdownNow();
  }
  
  class ScanForHungryStarters implements Runnable {
    ScheduledThreadPoolExecutor tpe = null;

    public ScanForHungryStarters(ScheduledThreadPoolExecutor tpe) {
      this.tpe = tpe;
    }

    public void run() {
      System.out.println("Running hungry starters scan.");
      // Schedule the next scan
      tpe.schedule(new ScanForHungryStarters(tpe), 10, TimeUnit.SECONDS);
      pushManager.sendPushNotification("Hungry starter!", "I'm a message");
      // TODO: Check for expiring starters and optionally issue notifications
    }
  }
}
