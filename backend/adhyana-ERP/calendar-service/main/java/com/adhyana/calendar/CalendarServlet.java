package com.adhyana.calendar;

// Import Gson
import com.adhyana.calendar.services.CalendarService;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonSyntaxException;


import com.adhyana.calendar.services.*;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import java.util.logging.Logger;

@WebServlet("api/scholarship/*")
public class CalendarServlet extends HttpServlet {
    private static final Logger LOGGER = Logger.getLogger(CalendarServlet.class.getName());
    private static CalendarService calendarService = new CalendarService();
}
