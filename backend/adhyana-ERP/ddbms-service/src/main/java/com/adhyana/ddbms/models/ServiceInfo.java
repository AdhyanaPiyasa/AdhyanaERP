package com.adhyana.ddbms.models;

/**
 * Model class representing information about a service in the system
 */
public class ServiceInfo {
    private int id;
    private String serviceName;
    private String endpointUrl;
    private String apiKey;
    private boolean active;

    /**
     * Default constructor
     */
    public ServiceInfo() {
    }

    /**
     * Constructor with all fields
     */
    public ServiceInfo(int id, String serviceName, String endpointUrl, String apiKey, boolean active) {
        this.id = id;
        this.serviceName = serviceName;
        this.endpointUrl = endpointUrl;
        this.apiKey = apiKey;
        this.active = active;
    }

    // Getters and Setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getServiceName() {
        return serviceName;
    }

    public void setServiceName(String serviceName) {
        this.serviceName = serviceName;
    }

    public String getEndpointUrl() {
        return endpointUrl;
    }

    public void setEndpointUrl(String endpointUrl) {
        this.endpointUrl = endpointUrl;
    }

    public String getApiKey() {
        return apiKey;
    }

    public void setApiKey(String apiKey) {
        this.apiKey = apiKey;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    @Override
    public String toString() {
        return "ServiceInfo{" +
                "id=" + id +
                ", serviceName='" + serviceName + '\'' +
                ", endpointUrl='" + endpointUrl + '\'' +
                ", apiKey='" + apiKey + '\'' +
                ", active=" + active +
                '}';
    }
}