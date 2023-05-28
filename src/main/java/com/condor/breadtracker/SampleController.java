package com.condor.breadtracker;

import javax.servlet.http.HttpServletRequest;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/**
 * This is a sample class used to enable
 * rapid development of REST controllers
 */
@RestController
public class SampleController {

    // Request and response bodies

    public static class SampleInput {
        public String thisIsAString;
        public boolean thisIsABool;
    }

    public static class SampleResponse {
        public int thisIsAnInt;
    }

    /**
     * This method takes in a request and returns the number 42
     * as part of its response.
     * @param request The request
     * @param inputs The request body
     * @return {@link #SampleResponse SampleResponse} object
     */
    @RequestMapping(value = "/samplerequest", method = RequestMethod.POST)
    ResponseEntity<SampleResponse> sampleRequestHandler(HttpServletRequest request, @RequestBody SampleInput inputs) {
        SampleResponse resp = new SampleResponse();
        resp.thisIsAnInt = 42;
        return ResponseEntity.ok(resp);
    }
}