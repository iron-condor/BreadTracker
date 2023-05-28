// package com.condor.breadtracker.session.websocket;

// import java.io.IOException;
// import java.util.Collection;
// import java.util.HashMap;
// import java.util.UUID;

// import javax.websocket.EncodeException;
// import javax.websocket.OnClose;
// import javax.websocket.OnError;
// import javax.websocket.OnMessage;
// import javax.websocket.OnOpen;
// import javax.websocket.server.ServerEndpoint;

// import org.springframework.stereotype.Component;

// import com.condor.breadtracker.recipe.RecipeController;
// import com.condor.breadtracker.session.websocket.object.Base;
// import com.fasterxml.jackson.databind.ObjectMapper;

// import javax.websocket.Session;

// /**
//  * This class exists to keep track of websockets
//  * that are being maintained with browsers.
//  * When a browser connects, a websocket connects
//  * to it so that we can serve content in realtime
//  * to the browser, such as notifications.
//  */
// @Component
// @ServerEndpoint(value = "/websocket", configurator = WebsocketConfigurator.class)
// public class WebsocketController {
//   // Map of session ID to Session (websocket session)
//   public static HashMap<String, Session> websocketMap = new HashMap<>();
//   // Map of session ID to session key (BreadTracker login session)
//   public static HashMap<String, UUID> websocketIDsToLogins = new HashMap<>();
//   // Map of session key (BreadTracker login session) to websocket session ID
//   public static HashMap<UUID, String> loginsToWebsocketIDs = new HashMap<>();
//   // Maps objects to JSON, so they can be sent over the websocket
//   public static ObjectMapper objectMapper = new ObjectMapper();

//   /**
//    * This sends a message to the browser, for processing
//    * by the remote websocket. Messages should be of 
//    * @param type The 'type' of the object
//    * @param obj The object to be serialized
//    * @param destination  The session key for the person the message is intended for
//    * @return True if successful, false otehrwise
//    * @throws IOException
//    * @throws EncodeException
//    */
//   public static boolean sendMessage(WebsocketTypes type, Object obj, UUID destination) throws IOException, EncodeException {
//     String sessionID = loginsToWebsocketIDs.get(destination);
//     if (sessionID == null) {
//       return false;
//     }
//     Session session = websocketMap.get(sessionID);
//     if (session == null) {
//       System.out.println("ERROR: No websocket session matches ID " + sessionID);
//       return false;
//     }
//     Base finalObj = new Base(sessionID, type, type.klass.cast(obj));
//     session.getBasicRemote().sendText(objectMapper.writeValueAsString(finalObj));
//     return true;
//   }

//   /**
//    * This method gets called when a new websocket opens
//    * and is bound to the browser
//    * @param session The session that is being created
//    * @throws IOException
//    */
//   @OnOpen
//   public void onOpen(Session session) throws IOException {
//     System.out.println("Binding new websocket session");
//     Collection<String> cookies = (Collection<String>) session.getUserProperties().get("cookie");
//     if (cookies == null) {
//       // No user session. Ignore it.
//       session.close();
//       return;
//     }
//     String sessionKey = "";
//     for (String cookie : cookies) {
//       if (cookie.startsWith(RecipeController.SESSION_KEY_COOKIE)) {
//         sessionKey = cookie.split("=")[1];
//       }
//     }
//     if (sessionKey == null || sessionKey.isEmpty()) {
//       // No user session. Ignore it.
//       session.close();
//       return;
//     }
//     websocketMap.put(session.getId(), session);
//     websocketIDsToLogins.put(session.getId(), UUID.fromString(sessionKey));
//     loginsToWebsocketIDs.put(UUID.fromString(sessionKey), session.getId());
//     Base obj = new Base(session.getId(), WebsocketTypes.BLANK, null);
//     session.getBasicRemote().sendText(objectMapper.writeValueAsString(obj));
//   }

//   /**
//    * This method gets called when a new message
//    * is sent to the websocket from the browser
//    * @param message The message
//    * @param session The session
//    * @throws IOException
//    */
//   @OnMessage
//   public void onMessage(String message, Session session) throws IOException {
//     // Handle new messages
//     System.out.println(message);
//   }

//   /**
//    * This method is called when the session with the
//    * browser closes. We use it to clean up the memory
//    * and make sure that we don't leak
//    * @param session The session that is being closed
//    * @throws IOException
//    */
//   @OnClose
//   public void onClose(Session session) throws IOException {
//     websocketMap.remove(session.getId());
//     UUID removed = websocketIDsToLogins.remove(session.getId());
//     if (removed != null) {
//       loginsToWebsocketIDs.remove(removed);
//     }
//   }

//   /**
//    * This method gets called when we encounter
//    * an error with the websocket.
//    * @param session The session that is having an error
//    * @param throwable The error
//    */
//   @OnError
//   public void onError(Session session, Throwable throwable) {
//     // Just print it for now. May want to do something
//     // more intelligent later.
//     throwable.printStackTrace(System.out);
//   }
// }
