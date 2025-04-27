package com.adhyana.announcement;

// Import Gson
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonSyntaxException;


import com.adhyana.announcement.services.*;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import java.util.logging.Logger;

@WebServlet("api/announcement/*")
public class AnnouncementServlet extends HttpServlet {
    private static final Logger LOGGER = Logger.getLogger(AnnouncementServlet.class.getName());
    private static AnnouncementService announcementService = new AnnouncementService();
}
