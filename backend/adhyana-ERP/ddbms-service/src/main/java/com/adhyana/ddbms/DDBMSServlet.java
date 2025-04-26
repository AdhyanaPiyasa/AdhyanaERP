package com.adhyana.ddbms;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.sql.*;
import java.util.*;

@WebServlet("/api/ddbms/replicate")
public class DDBMSServlet extends HttpServlet {
    // your DDBMS JDBC URL + creds
    private static final String URL      = "jdbc:mysql://localhost:3306/adhyana_ddbms";
    private static final String USER     = "root";
    private static final String PASSWORD = "";

    // which tables live in which services' /api/sync
    private static final Map<String,String> SYNC_ENDPOINT = new HashMap<>();
    static {
        SYNC_ENDPOINT.put("students",    "http://localhost:8083/api/sync");
        SYNC_ENDPOINT.put("courses",     "http://localhost:8084/api/sync");
        SYNC_ENDPOINT.put("exams",       "http://localhost:8085/api/sync");
        SYNC_ENDPOINT.put("administration","http://localhost:8086/api/sync");
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        String body = readBody(req);
        Map<String,String> data = parseJsonToMap(body);
        String query = data.get("query");
        String table = data.get("table");

        // 1) apply to DDBMS
        try (Connection conn = DriverManager.getConnection(URL, USER, PASSWORD);
             Statement  st   = conn.createStatement()) {
            st.executeUpdate(query);
        } catch (SQLException e) {
            resp.sendError(500, "DDBMS exec failed: " + e.getMessage());
            return;
        }

        // 2) broadcast to service holding that table
        String endpoint = SYNC_ENDPOINT.get(table.toLowerCase());
        if (endpoint != null) {
            try {
                URL url = new URL(endpoint);
                HttpURLConnection c = (HttpURLConnection)url.openConnection();
                c.setRequestMethod("POST");
                c.setDoOutput(true);
                c.setRequestProperty("Content-Type","application/json");
                try(OutputStream os = c.getOutputStream()){
                    os.write(body.getBytes());
                }
                c.getResponseCode(); // fire-and-forget
            } catch (Exception ignore) { /* swallow for simplicity */ }
        }

        resp.setStatus(200);
    }

    private String readBody(HttpServletRequest r) throws IOException {
        BufferedReader br = r.getReader();
        StringBuilder sb = new StringBuilder();
        String line;
        while((line=br.readLine())!=null) sb.append(line);
        return sb.toString();
    }

    private Map<String,String> parseJsonToMap(String json) {
        // very naive JSON: {"query":"...","table":"..."}
        Map<String,String> m = new HashMap<>();
        json = json.replaceAll("[{}\"]","");
        for (String pair : json.split(",")) {
            String[] kv = pair.split(":",2);
            if (kv.length==2) m.put(kv[0].trim(), kv[1].trim());
        }
        return m;
    }
}
