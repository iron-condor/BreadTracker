package com.condor.breadtracker.starter;

public class Starter {
  private String flourType;
  private boolean inFridge;
  private long timeLastFed;
  
  public Starter(String flourType, boolean inFridge, long timeLastFed) {
    this.flourType = flourType;
    this.inFridge = inFridge;
    this.timeLastFed = timeLastFed;
  }

  public Starter(String flourType, boolean inFridge) {
    this.flourType = flourType;
    this.inFridge = inFridge;
  }
  
  public long getNextFeedingTime() {
    // How many days between feedings
    int feedingInterval = inFridge ? 7 : 1;
    long timeToAdd = feedingInterval * 24 * 60 * 60 * 1000;
    return timeLastFed + timeToAdd;
  }

  public void feed() {
    this.timeLastFed = System.currentTimeMillis();
  }

  public String getFlourType() {
    return flourType;
  }
  public void setFlourType(String flourType) {
    this.flourType = flourType;
  }

  public boolean isInFridge() {
    return inFridge;
  }
  public void setInFridge(boolean inFridge) {
    this.inFridge = inFridge;
  }
  public long getTimeLastFed() {
    return timeLastFed;
  }
  public void setTimeLastFed(long timeLastFed) {
    this.timeLastFed = timeLastFed;
  }
}
