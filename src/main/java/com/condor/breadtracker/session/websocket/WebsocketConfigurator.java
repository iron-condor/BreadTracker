package com.condor.breadtracker.session.websocket;

import java.util.List;
import java.util.Map;

import javax.websocket.HandshakeResponse;
import javax.websocket.server.HandshakeRequest;
import javax.websocket.server.ServerEndpointConfig;

/**
 * This class performs some server configuration
 * to make websockets work
 */
public class WebsocketConfigurator extends ServerEndpointConfig.Configurator {
  /**
   * Modify the handshake so that cookies are preserved
   * in the request, in order to retrieve session cookies
   */
  @Override
    public void modifyHandshake(ServerEndpointConfig config, 
                                HandshakeRequest request, 
                                HandshakeResponse response)
    {
        Map<String, List<String>> headers = request.getHeaders();
        if(config != null && config.getUserProperties() != null && headers != null && headers.get("cookie") != null) {
          config.getUserProperties().put("cookie", headers.get("cookie"));
        }
        
    }
}
