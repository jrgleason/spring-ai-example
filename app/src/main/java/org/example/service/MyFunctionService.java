package org.example.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.function.Function;

public class MyFunctionService implements Function<MyFunctionService.Request, MyFunctionService.Response> {
    private static final Logger logger = LoggerFactory.getLogger(MyFunctionService.class);
    public enum Unit { C, F }
    public record Request(String location, Unit unit) {}
    public record Response(double temp, Unit unit) {}

    public Response apply(Request request) {
        logger.warn("Hitting the function");
        return new Response(30.0, Unit.C);
    }
}
