package com.hp.common.xml;

public class ReportEntity extends XmlEntity {
	int applicationId;
	int connectionId;
	int fieldSetId;
	int paginationId;
	String baseQuery;
	String groupBy;
	String whereCondition;
	String orderBy;
	String filterId;
	
	
	public String getFilterId() {
		return filterId;
	}
	public void setFilterId(String filterId) {
		this.filterId = filterId;
	}
	public String getGroupBy() {
		return groupBy;
	}
	public void setGroupBy(String groupBy) {
		this.groupBy = groupBy;
	}
	public String getWhereCondition() {
		return whereCondition;
	}
	public void setWhereCondition(String whereCondition) {
		this.whereCondition = whereCondition;
	}
	public String getOrderBy() {
		return orderBy;
	}
	public void setOrderBy(String orderBy) {
		this.orderBy = orderBy;
	}
	
	public int getApplicationId() {
		return applicationId;
	}
	public void setApplicationId(int applicationId) {
		this.applicationId = applicationId;
	}
	public int getConnectionId() {
		return connectionId;
	}
	public void setConnectionId(int connectionId) {
		this.connectionId = connectionId;
	}
	public int getFieldSetId() {
		return fieldSetId;
	}
	public void setFieldSetId(int fieldSetId) {
		this.fieldSetId = fieldSetId;
	}
	public int getPaginationId() {
		return paginationId;
	}
	public void setPaginationId(int paginationId) {
		this.paginationId = paginationId;
	}
	public String getBaseQuery() {
		return baseQuery;
	}
	public void setBaseQuery(String baseQuery) {
		this.baseQuery = baseQuery;
	}
	
}
