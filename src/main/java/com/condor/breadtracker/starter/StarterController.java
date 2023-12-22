package com.condor.breadtracker.starter;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.condor.breadtracker.push.PushManager;
import com.condor.breadtracker.util.BaseResponse;
import com.condor.breadtracker.util.SQLLinker;

@RestController
public class StarterController {

  @Autowired
  PushManager pushManager;

  public static class GetStartersResponse extends BaseResponse {
    public Starter[] starterList;
  }

  public static class AddStarterRequest {
    public String name;
    public String flourType;
    public Boolean inFridge;
  }

  public static class AddStarterResponse extends BaseResponse {
    public Starter newStarter;
  }

  public static class UpdateStarterResponse extends BaseResponse {
    public Starter starter;
  }

  @RequestMapping(value = "/starters", method = RequestMethod.GET)
  ResponseEntity<GetStartersResponse> getStarters(HttpServletRequest request) {
    GetStartersResponse resp = new GetStartersResponse();

    ArrayList<Starter> starterList = SQLLinker.getInstance().getStarters();
    Starter[] asArray = new Starter[starterList.size()];
    asArray = (Starter[]) starterList.toArray(asArray);
    resp.starterList = asArray;
    resp.success = true;
    
    return ResponseEntity.status(HttpStatus.OK).body(resp);
  }

  @RequestMapping(value = "/starters", method = RequestMethod.POST)
  ResponseEntity<AddStarterResponse> newStarter(HttpServletRequest request, @RequestBody AddStarterRequest requestBody) {
    AddStarterResponse resp = new AddStarterResponse();

    if (requestBody.name == null || requestBody.flourType == null || requestBody.inFridge == null) {
      resp.success = false;
      resp.errorMessage = "No starter provided / bad format";
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(resp);
    }
    UUID uuid = UUID.randomUUID();
    Starter starter = null;
    starter = new Starter(uuid, requestBody.name, requestBody.flourType, requestBody.inFridge);
    resp.success = SQLLinker.getInstance().addStarter(starter);
    resp.newStarter = starter;
    
    return ResponseEntity.status(HttpStatus.OK).body(resp);
  }

  @RequestMapping(value = "/starters/{uuid}", method = RequestMethod.DELETE)
  ResponseEntity<BaseResponse> deleteStarter(HttpServletRequest request, @PathVariable String uuid) {
    BaseResponse resp = new BaseResponse();
    
    resp.success = SQLLinker.getInstance().deleteStarter(UUID.fromString(uuid));
    
    return ResponseEntity.status(HttpStatus.OK).body(resp);
  }

  @RequestMapping(value = "/starters/feed/{uuid}", method = RequestMethod.PUT)
  ResponseEntity<UpdateStarterResponse> feedStarter(HttpServletRequest request, @PathVariable String uuid) {
    UpdateStarterResponse resp = new UpdateStarterResponse();
    
    Starter starter = SQLLinker.getInstance().getStarter(UUID.fromString(uuid));
    if (starter == null) {
      resp.success = false;
      resp.errorMessage = "No starter found matching provided ID";
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(resp);
    }
    starter.feed();
    resp.success = SQLLinker.getInstance().updateStarter(starter);
    resp.starter = starter;
    
    return ResponseEntity.status(HttpStatus.OK).body(resp);
  }

  @RequestMapping(value = "/starters/move/{uuid}", method = RequestMethod.PUT)
  ResponseEntity<UpdateStarterResponse> moveStarter(HttpServletRequest request, @PathVariable String uuid, @RequestParam boolean inFridge) {
    UpdateStarterResponse resp = new UpdateStarterResponse();
    
    Starter starter = SQLLinker.getInstance().getStarter(UUID.fromString(uuid));
    if (starter == null) {
      resp.success = false;
      resp.errorMessage = "No starter found matching provided ID";
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(resp);
    }
    starter.setInFridge(inFridge);
    resp.success = SQLLinker.getInstance().updateStarter(starter);
    resp.starter = starter;
    
    return ResponseEntity.status(HttpStatus.OK).body(resp);
  }

  // Helper endpoint for development. Sends a push notification about starter needing to be fed
  @RequestMapping(value = "/starters/notify/{uuid}", method = RequestMethod.POST)
  ResponseEntity<UpdateStarterResponse> notifyAboutStarter(HttpServletRequest request, @PathVariable String uuid) {
    UpdateStarterResponse resp = new UpdateStarterResponse();

    Starter starter = SQLLinker.getInstance().getStarter(UUID.fromString(uuid));
    if (starter == null) {
      resp.success = false;
      resp.errorMessage = "No starter found matching provided ID";
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(resp);
    }
    resp.success = pushManager.sendFeedStarterReminder(starter);
    resp.starter = starter;

    return ResponseEntity.ok().body(resp);
  }
}
