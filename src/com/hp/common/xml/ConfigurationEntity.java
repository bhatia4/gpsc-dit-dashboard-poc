package com.hp.common.xml;

import java.util.HashMap;

public class ConfigurationEntity {
	private final HashMap<Integer, ApplicationEntity> applications  = new HashMap<Integer, ApplicationEntity>();
	private final HashMap<Integer, HashMap<String, FieldEntity>> fieldSets = new HashMap<Integer, HashMap<String,FieldEntity>>();
	private final HashMap<Integer, PaginationEntity> paginationQuerys = new HashMap<Integer, PaginationEntity>();
	private final HashMap<Integer, ReportEntity> reports = new HashMap<Integer, ReportEntity>();
	private final HashMap<Integer, ConnectionEntity> connections = new HashMap<Integer, ConnectionEntity>();
	private final HashMap<Integer, FilterEntity> filters = new HashMap<Integer, FilterEntity>();
	private final HashMap<Integer, PanelEntity> panels = new HashMap<Integer, PanelEntity>();
	
	
	
	public HashMap<Integer, PanelEntity> getPanels() {
		return panels;
	}

	public  HashMap<Integer, FilterEntity>  getFilters() {
		return filters;
	}
	
	public HashMap<Integer, ConnectionEntity> getConnections() {
		return connections;
	}
	public HashMap<Integer, ApplicationEntity> getApplications() {
		return applications;
	}
	
	public HashMap<Integer, HashMap<String, FieldEntity>> getFieldSets() {
		return fieldSets;
	}
	
	public HashMap<Integer, PaginationEntity> getPaginationQuerys() {
		return paginationQuerys;
	}
	
	public HashMap<Integer, ReportEntity> getReports() {
		return reports;
	}
	
}
