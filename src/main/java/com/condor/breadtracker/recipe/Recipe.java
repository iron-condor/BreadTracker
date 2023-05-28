package com.condor.breadtracker.recipe;

import java.sql.Array;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Recipe {
  private UUID uuid;
  private String name;
  private String description;
  private List<Timer> timers;
  // TODO
  // private byte[] picture;

  public Recipe(UUID uuid, String name, String description, List<Timer> timers) {
    this.uuid = uuid;
    this.name = name;
    this.description = description;
    this.timers = timers;
  }

  public Recipe(UUID uuid, String name, String description, Array timerLabels, Array lowerLimits, Array upperLimits) throws SQLException {
    this.uuid = uuid;
    this.name = name;
    this.description = description;
    this.timers = rebuildTimers(timerLabels, lowerLimits, upperLimits);
  }

  protected ArrayList<Timer> rebuildTimers(Array timerLabels, Array lowerLimits, Array upperLimits) throws SQLException {
    
    Long[] lowerLimitsArr = (Long[]) lowerLimits.getArray();
    Long[] upperLimitsArr = (Long[]) upperLimits.getArray();
    String[] timerLabelsArr = (String[]) timerLabels.getArray();
    ArrayList<Timer> ret = new ArrayList<>(lowerLimitsArr.length);

    for (int i = 0; i < lowerLimitsArr.length; i++) {
      ret.add(new Timer(timerLabelsArr[i], lowerLimitsArr[i], upperLimitsArr[i]));
    }

    return ret;
  }

  public UUID getUuid() {
    return uuid;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public List<Timer> getTimers() {
    return timers;
  }

  public HashMap<String, Object[]> getTimersMap() {
    HashMap<String, Object[]> ret = new HashMap<>();

    String[] labels = new String[this.timers.size()];
    Long[] lowerLimits = new Long[this.timers.size()];
    Long[] upperLimits = new Long[this.timers.size()];
    for (int i = 0; i < this.timers.size(); i++) {
      Timer timer = this.timers.get(i);
      labels[i] = timer.getLabel();
      lowerLimits[i] = timer.getLowerLimit();
      upperLimits[i] = timer.getUpperLimit();
    }
    ret.put("labels", labels);
    ret.put("lower_limits", lowerLimits);
    ret.put("upper_limits", upperLimits);

    return ret;
  }

  public void setTimers(ArrayList<Timer> timers) {
    this.timers = timers;
  }
}
