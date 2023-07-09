package com.condor.breadtracker.recipe;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Timer {
  @JsonProperty
  private String label;
  @JsonProperty
  private long lowerLimit;
  @JsonProperty
  private long upperLimit;
  @JsonProperty
  private boolean overnight;

  public Timer(String label, long lowerLimit, long upperLimit) {
    this.label = label;
    this.lowerLimit = lowerLimit;
    this.upperLimit = upperLimit;
  }

  public Timer(String label, boolean overnight) {
    this.label = label;
    this.overnight = overnight;
  }

  public long getLowerLimit() {
    return lowerLimit;
  }

  public void setLowerLimit(long lowerLimit) {
    this.lowerLimit = lowerLimit;
  }

  public long getUpperLimit() {
    return upperLimit;
  }

  public void setUpperLimit(long upperLimit) {
    this.upperLimit = upperLimit;
  }

  public String getLabel() {
    return label;
  }

  public void setLabel(String label) {
    this.label = label;
  }

  public boolean isOvernight() {
    return overnight;
  }

  public void setOvernight(boolean overnight) {
    this.overnight = overnight;
  }
}
