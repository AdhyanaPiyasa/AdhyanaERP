package com.adhyana.administration.filters; // or the appropriate package

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.*;
import java.sql.*;
import java.util.HashMap;
import java.util.Map;

import com.adhyana.administration.utils.DatabaseConnection; // or your service's DB util

@WebServlet("/api/sync")
public class SyncServlet extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        String body = readBody(req);
        Map<String,String> data = parseJsonToMap(body);
        String query = data.get("query");

        try (Connection conn = DatabaseConnection.getConnection();
             Statement  st   = conn.createStatement()) {
            st.executeUpdate(query);
            resp.setStatus(200);
        } catch (Exception e) {
            resp.sendError(500, "Sync failed: " + e.getMessage());
        }
    }

    private String readBody(HttpServletRequest r) throws IOException {
        BufferedReader br = r.getReader();
        StringBuilder sb = new StringBuilder();
        String line;
        while((line=br.readLine())!=null) sb.append(line);
        return sb.toString();
    }

    private Map<String,String> parseJsonToMap(String json) {
        Map<String,String> m = new HashMap<>();
        json = json.replaceAll("[{}\"]","");
        for (String pair : json.split(",")) {
            String[] kv = pair.split(":",2);
            if (kv.length==2) m.put(kv[0].trim(), kv[1].trim());
        }
        return m;
    }
}
