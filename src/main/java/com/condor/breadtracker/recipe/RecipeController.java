package com.condor.breadtracker.recipe;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Base64;
import java.util.UUID;

import javax.servlet.http.HttpServletRequest;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.condor.breadtracker.util.SQLLinker;
import com.condor.breadtracker.session.websocket.object.Blank;
import com.condor.breadtracker.util.BaseResponse;
import com.fasterxml.jackson.annotation.JsonProperty;

@RestController
public class RecipeController {

  // Request/response body formats

  public static class GetRecipesResponse extends BaseResponse {
    public Recipe[] recipeList;
  }

  public static class AddRecipeRequest {
    public String name;
    public String description;
    public Timer[] timers;
    // Base64 encoded version of the file
    public String image;
  }

  public static class AddRecipeResponse extends BaseResponse {
    public Recipe newRecipe;
  }


  @RequestMapping(value = "/recipes", method = RequestMethod.GET)
  ResponseEntity<GetRecipesResponse> getRecipes(HttpServletRequest request) {
    GetRecipesResponse resp = new GetRecipesResponse();

    ArrayList<Recipe> recipeList = SQLLinker.getInstance().getRecipes();
    Recipe[] asArray = new Recipe[recipeList.size()];
    asArray = (Recipe[]) recipeList.toArray(asArray);
    resp.recipeList = asArray;
    resp.success = true;
    
    return ResponseEntity.status(HttpStatus.OK).body(resp);
  }

  @RequestMapping(value = "/recipes", method = RequestMethod.POST)
  ResponseEntity<AddRecipeResponse> newRecipe(HttpServletRequest request, @RequestBody AddRecipeRequest requestBody) {
    AddRecipeResponse resp = new AddRecipeResponse();

    if (requestBody.name == null || requestBody.description == null || requestBody.timers == null) {
      resp.success = false;
      resp.errorMessage = "No recipe provided / bad format";
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(resp);
    }
    UUID uuid = UUID.randomUUID();
    Recipe recipe = null;
    if (requestBody.image != null && !requestBody.image.isEmpty()) {
      recipe = new Recipe(uuid, requestBody.name, requestBody.description, Arrays.asList(requestBody.timers), requestBody.image);
    } else {
      recipe = new Recipe(uuid, requestBody.name, requestBody.description, Arrays.asList(requestBody.timers));
    }
    resp.success = SQLLinker.getInstance().addRecipe(recipe);
    resp.newRecipe = recipe;
    
    return ResponseEntity.status(HttpStatus.OK).body(resp);
  }

  @RequestMapping(value = "/recipes/{uuid}", method = RequestMethod.DELETE)
  ResponseEntity<BaseResponse> deleteRecipe(HttpServletRequest request, @PathVariable String uuid) {
    BaseResponse resp = new BaseResponse();
    
    resp.success = SQLLinker.getInstance().deleteRecipe(UUID.fromString(uuid));
    
    return ResponseEntity.status(HttpStatus.OK).body(resp);
  }
}