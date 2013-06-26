package com.hp.common;

public interface Constants {
	public enum DATA_TYPE_COLL { STRING,INTEGER,FLOAT,DOUBLE,DATE};
	public static final String ID = "id";
	public static final String NAME = "name";
	public static final String DESC = "desc";
	public static final String APPLICATION_ID = "applicationId";
	public static final String CONNECTION_ID = "connectionId";
	public static final String QUERY = "query";
	public static final String FIELDSET_ID = "fieldSetId";
	public static final String CONNECTIONS = "connections";
	public static final String APPLICATIONS = "Applications";
	public static final String FIELDSETS = "fieldSets";
	public static final String FIELDSET = "fieldSet";
	public static final String COLUMN_NAME = "columnName";
	public static final String DATA_TYPE = "dataType";
	public static final String DISPLAY_NAME = "displayName";
	
	public static final String DATASOURCE_NAME = "dataSourceName";
	public static final String URL = "url";
	public static final String REPORTS = "reports"; 
	public static final String JDBC_FILE = "JDBCConfiguration.xml";
	public static final String BASEURL = "http://localhost:7001/Report/ReportUI/reports/";
	public static final String FILTER_SEPERATOR = "~-~";
	public static final String EQUAL_FIELD_SEPERATOR = "~eq~";
	public static final String GREATER_FIELD_SEPERATOR = "~grt~";
	public static final String LESS_FIELD_SEPERATOR = "~lst~";
	
	
	public static final String EQUAL_FIELD = "=";
	public static final String GREATER_FIELD = ">";
	public static final String LESS_FIELD = "<";
	
	public static final String GROUP_BY = "groupBy";
	public static final String ORDER_BY = "orderBy";
	public static final String WHERE_CONDITION = "whereCondition";
	
	public static final String GROUP_BY_STRING = " group by ";
	public static final String ORDER_BY_STRING = " order by ";
	public static final String WHERE_CONDITION_STRING = " where ";
	public static final String AND_STRING = " and ";
	
	
	public static final String SINGLE_QUOUTE = "'";
	
	
	public static final String FILTER_CONDITION_ID = "filterId";
	public static final String FILTERS = "filters";
	public static final String FILTER = "filter";
	public static final String VALUE = "value";
	
	public static final String PANELS = "panels";
	public static final String HEIGHT = "height";
	public static final String WIDTH = "width";
	public static final String TYPE = "type";
	public static final String REPORTID = "reportId";
}
