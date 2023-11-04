package com.condor.breadtracker.starter;

import java.util.UUID;

// TODO: Incorporate statistics about starter feedings, so we can have data on it
public class Starter {
  private String name;
  private String flourType;
  private boolean inFridge;
  private long timeLastFed;
  private UUID uuid;

  public Starter(UUID uuid, String name, String flourType, boolean inFridge, long timeLastFed) {
    this.uuid = uuid;
    this.name = name;
    this.flourType = flourType;
    this.inFridge = inFridge;
    this.timeLastFed = timeLastFed;
  }

  public Starter(UUID uuid, String name, String flourType, boolean inFridge) {
    this.uuid = uuid;
    this.name = name;
    this.flourType = flourType;
    this.inFridge = inFridge;
    // TODO: Replace with UTC later
    this.timeLastFed = System.currentTimeMillis();
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

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public UUID getUuid() {
    return uuid;
  }
}
