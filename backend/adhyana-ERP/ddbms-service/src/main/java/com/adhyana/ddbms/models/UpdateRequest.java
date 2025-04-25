package com.adhyana.ddbms.models;

import java.util.Map;

/**
 * Model class representing an update request from a service
 */
public class UpdateRequest {
    private String serviceName;
    private String apiKey;
    private String tableName;
    private int recordId;
    private String operationType; // INSERT, UPDATE, DELETE
    private Map<String, Object> data; // For INSERT/UPDATE operations, contains field values

    /**
     * Default constructor
     */
    public UpdateRequest() {
    }

    /**
     * Constructor with all fields
     */
    public UpdateRequest(String serviceName, String apiKey, String tableName,
                         int recordId, String operationType, Map<String, Object> data) {
        this.serviceName = serviceName;
        this.apiKey = apiKey;
        this.tableName = tableName;
        this.recordId = recordId;
        this.operationType = operationType;
        this.data = data;
    }

    // Getters and Setters
    public String getServiceName() {
        return serviceName;
    }

    public void setServiceName(String serviceName) {
        this.serviceName = serviceName;
    }

    public String getApiKey() {
        return apiKey;
    }

    public void setApiKey(String apiKey) {
        this.apiKey = apiKey;
    }

    public String getTableName() {
        return tableName;
    }

    public void setTableName(String tableName) {
        this.tableName = tableName;
    }

    public int getRecordId() {
        return recordId;
    }

    public void setRecordId(int recordId) {
        this.recordId = recordId;
    }

    public String getOperationType() {
        return operationType;
    }

    public void setOperationType(String operationType) {
        this.operationType = operationType;
    }

    public Map<String, Object> getData() {
        return data;
    }

    public void setData(Map<String, Object> data) {
        this.data = data;
    }

    @Override
    public String toString() {
        return "UpdateRequest{" +
                "serviceName='" + serviceName + '\'' +
                ", apiKey='" + apiKey + '\'' +
                ", tableName='" + tableName + '\'' +
                ", recordId=" + recordId +
                ", operationType='" + operationType + '\'' +
                ", data=" + data +
                '}';
    }
}