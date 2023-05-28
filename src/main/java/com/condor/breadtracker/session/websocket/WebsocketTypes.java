package com.condor.breadtracker.session.websocket;

import com.condor.breadtracker.session.websocket.object.Base;

/**
 * This contains a list of "types" that are recognized
 */
public enum WebsocketTypes {
  BASE(Base.class),
  BLANK(null);

  Class klass;
  private WebsocketTypes(Class klass) {
    this.klass = klass;
  }
}
