package com.adhyana.scholarship;

// Import Gson
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonSyntaxException;


import com.adhyana.scholarship.services.*;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import java.util.logging.Logger;

@WebServlet("api/scholarship/*")
public class ScholarshipServlet extends HttpServlet {
    private static final Logger LOGGER = Logger.getLogger(ScholarshipServlet.class.getName());
    private static ScholarshipService scholarshipService = new ScholarshipService();
}
