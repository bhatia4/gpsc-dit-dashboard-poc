package com.hp.common.xml;

import java.util.HashMap;

public class ConfigurationEntity {
	private HashMap<Integer, ApplicationEntity> applications  = new HashMap<Integer, ApplicationEntity>();
	private HashMap<Integer, HashMap<String, FieldEntity>> fieldSets = new HashMap<Integer, HashMap<String,FieldEntity>>();
	private HashMap<Integer, PaginationEntity> paginationQuerys = new HashMap<Integer, PaginationEntity>();
	private HashMap<Integer, ReportEntity> reports = new HashMap<Integer, ReportEntity>();
	private final HashMap<Integer, ConnectionEntity> connections = new HashMap<Integer, ConnectionEntity>();
	
	
	
	public HashMap<Integer, ConnectionEntity> getConnections() {
		return connections;
	}
	public HashMap<Integer, ApplicationEntity> getApplications() {
		return applications;
	}
	public void setApplications(HashMap<Integer, ApplicationEntity> applications) {
		this.applications = applications;
	}
	public HashMap<Integer, HashMap<String, FieldEntity>> getFieldSets() {
		return fieldSets;
	}
	public void setFieldSets(
			HashMap<Integer, HashMap<String, FieldEntity>> fieldSets) {
		this.fieldSets = fieldSets;
	}
	public HashMap<Integer, PaginationEntity> getPaginationQuerys() {
		return paginationQuerys;
	}
	public void setPaginationQuerys(
			HashMap<Integer, PaginationEntity> paginationQuerys) {
		this.paginationQuerys = paginationQuerys;
	}
	public HashMap<Integer, ReportEntity> getReports() {
		return reports;
	}
	public void setReports(HashMap<Integer, ReportEntity> reports) {
		this.reports = reports;
	}
	
	

}
