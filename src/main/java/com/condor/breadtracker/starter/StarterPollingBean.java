package com.condor.breadtracker.starter;

import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.concurrent.ScheduledThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.DisposableBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.condor.breadtracker.push.PushManager;
import com.condor.breadtracker.util.SQLLinker;

@Component
public class StarterPollingBean implements DisposableBean {
  ScheduledThreadPoolExecutor tpe = new ScheduledThreadPoolExecutor(1);
  @Autowired
  PushManager pushManager;

  public StarterPollingBean() {
    tpe.schedule(new ScanForHungryStarters(tpe), 1, TimeUnit.SECONDS);
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
      tpe.schedule(new ScanForHungryStarters(tpe), 1, TimeUnit.HOURS);
      ArrayList<Starter> starters = SQLLinker.getInstance().getStarters();
      long now = System.currentTimeMillis();
      for (Starter starter : starters) {
        if (starter.getNextFeedingTime() <= now && shouldNotifyAgain(starter.getTimeLastNotified(), now)) {
          System.out.println("Issuing notification for " + starter.getName() + " with ID " + starter.getUuid() + " because it is hungry.");
          pushManager.sendFeedStarterReminder(starter);
          starter.setTimeLastNotified(now);
          SQLLinker.getInstance().updateStarter(starter);
        }
      }
    }

    public boolean shouldNotifyAgain(long timeLastNotified, long now) {
      ZoneId zoneId = ZoneId.systemDefault();
      Instant nowInstant = Instant.ofEpochMilli(now);
      Instant thenInstant = Instant.ofEpochMilli(timeLastNotified);
      LocalDateTime nowDate = nowInstant.atZone(zoneId).toLocalDateTime();
      LocalDateTime lastNotifiedDate = thenInstant.atZone(zoneId).toLocalDateTime();
      Duration diff = Duration.between(lastNotifiedDate, nowDate);
      // TODO: Make number of days configurable
      return diff.toDays() >= 1;
    }
  }
}
