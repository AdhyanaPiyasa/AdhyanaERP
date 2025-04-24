package com.adhyana.ddbms.models;

/**
 * Model class representing a mapping between a database table and a service
 */
public class TableMapping {
    private int id;
    private String tableName;
    private int serviceId;
    private boolean primary;

    /**
     * Default constructor
     */
    public TableMapping() {
    }

    /**
     * Constructor with all fields
     */
    public TableMapping(int id, String tableName, int serviceId, boolean primary) {
        this.id = id;
        this.tableName = tableName;
        this.serviceId = serviceId;
        this.primary = primary;
    }

    // Getters and Setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getTableName() {
        return tableName;
    }

    public void setTableName(String tableName) {
        this.tableName = tableName;
    }

    public int getServiceId() {
        return serviceId;
    }

    public void setServiceId(int serviceId) {
        this.serviceId = serviceId;
    }

    public boolean isPrimary() {
        return primary;
    }

    public void setPrimary(boolean primary) {
        this.primary = primary;
    }

    @Override
    public String toString() {
        return "TableMapping{" +
                "id=" + id +
                ", tableName='" + tableName + '\'' +
                ", serviceId=" + serviceId +
                ", primary=" + primary +
                '}';
    }
}