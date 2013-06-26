package com.hp.common.xml;

import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

import org.apache.log4j.Logger;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

import com.hp.common.Constants;
import com.hp.common.exception.ConfigException;

public enum JDBCConfiguration {
	INSTANCE;
	
	
	private static final Logger LOGGER = Logger.getLogger(JDBCConfiguration.class);
	
	private final ConfigurationEntity configurationEntity = new ConfigurationEntity(); 

	private boolean isLoaded = false;
	
	public void loadConfiguration() throws ConfigException{
		if (!isLoaded){		
		Document document = loadXmlFile(Constants.JDBC_FILE);
		loadApplications(document);
		loadConnections(document);
		loadFieldSets(document);
		loadFilters(document);
		loadReports(document);
		loadPanels(document);
		
			isLoaded = true;
		}
	}
	
	public ConfigurationEntity getConfigurationEntity(){
		return configurationEntity;
	}
	
	private void loadReports(Document document){
		NodeList nodeList = document.getElementsByTagName(Constants.REPORTS).item(0).getChildNodes();
		int nodeLength = nodeList.getLength();
		for (int i = 0; i < nodeLength; i++) {
			Node node = nodeList.item(i);
			if (node.getNodeType() == Node.ELEMENT_NODE) {
				ReportEntity entity = new ReportEntity();
				Element eElement = (Element) node;
				loadEntity(eElement, entity);
				entity.setApplicationId(Integer.parseInt(eElement.getAttribute(Constants.APPLICATION_ID)));
				entity.setConnectionId(Integer.parseInt(eElement.getAttribute(Constants.CONNECTION_ID)));
				entity.setFieldSetId(Integer.parseInt(eElement.getAttribute(Constants.FIELDSET_ID)));
				entity.setBaseQuery(eElement.getAttribute(Constants.QUERY));
				entity.setWhereCondition(eElement.getAttribute(Constants.WHERE_CONDITION));
				entity.setGroupBy(eElement.getAttribute(Constants.GROUP_BY));
				entity.setOrderBy(eElement.getAttribute(Constants.ORDER_BY));
				entity.setFilterId(eElement.getAttribute(Constants.FILTER_CONDITION_ID));
				configurationEntity.getReports().put(entity.getId(), entity);
			}
			
		}		
	}
	
	private void loadApplications(Document document){
		NodeList nodeList = document.getElementsByTagName(Constants.APPLICATIONS).item(0).getChildNodes();
		int nodeLength = nodeList.getLength();
		for (int i = 0; i < nodeLength; i++) {
			Node node = nodeList.item(i);
			if (node.getNodeType() == Node.ELEMENT_NODE) {
				ApplicationEntity entity = new ApplicationEntity();
				Element eElement = (Element) node;
				loadEntity(eElement, entity);
				configurationEntity.getApplications().put(entity.getId(), entity);
			}
			
		}		
	}
	
	private void loadConnections(Document document){
		NodeList nodeList = document.getElementsByTagName(Constants.CONNECTIONS).item(0).getChildNodes();
		int nodeLength = nodeList.getLength();
		for (int i = 0; i < nodeLength; i++) {
			Node node = nodeList.item(i);
			if (node.getNodeType() == Node.ELEMENT_NODE) {
				ConnectionEntity entity = new ConnectionEntity();
				Element eElement = (Element) node;
				loadEntity(eElement, entity);
				entity.setDataSourceName(eElement.getAttribute(Constants.DATASOURCE_NAME));
				entity.setUrl(eElement.getAttribute(Constants.URL));
				configurationEntity.getConnections().put(entity.getId(), entity);
			}
			
		}		
	}
	
	
	private void loadPanels(Document document) {
		NodeList nodeList = document.getElementsByTagName(Constants.PANELS).item(0).getChildNodes();
		int nodeLength = nodeList.getLength();
		for (int i = 0; i < nodeLength; i++) {
			Node node = nodeList.item(i);
			if (node.getNodeType() == Node.ELEMENT_NODE) {
				PanelEntity entity = new PanelEntity();
				Element eElement = (Element) node;
				loadEntity(eElement, entity);
				entity.setType(eElement.getAttribute(Constants.TYPE));
				entity.setHeight(eElement.getAttribute(Constants.HEIGHT));
				entity.setWidth(eElement.getAttribute(Constants.WIDTH));
				entity.setReportId(Integer.parseInt(eElement.getAttribute(Constants.REPORTID)));
				configurationEntity.getPanels().put(entity.getId(), entity);
			}
			
		}		
	}
	
	private void loadFilters(Document document) {
		NodeList nodeList = document.getElementsByTagName(Constants.FILTERS).item(0).getChildNodes();
		int nodeLength = nodeList.getLength();
		for (int i = 0; i < nodeLength; i++) {
			Node node = nodeList.item(i);
			if (node.getNodeType() == Node.ELEMENT_NODE) {
				FilterEntity entity = new FilterEntity();
				Element eElement = (Element) node;
				loadEntity(eElement, entity);
				configurationEntity.getFilters().put(entity.getId(), entity);
			}
			
		}		
	}
	
	private void loadFieldSets(Document document){
		NodeList nodeList = document.getElementsByTagName(Constants.FIELDSETS).item(0).getChildNodes();
		int nodeLength = nodeList.getLength();
		for (int i = 0; i < nodeLength; i++) {
			Node node = nodeList.item(i);
			if (node.getNodeType() == Node.ELEMENT_NODE) {
				HashMap<String, FieldEntity> fieldSet = new HashMap<String, FieldEntity>();
				int fieldSetId = Integer.parseInt(((Element)node).getAttribute(Constants.ID));
				NodeList fieldSetNodeList = node.getChildNodes();
				for (int j = 0; j < fieldSetNodeList.getLength(); j++) {
					Node childNode = fieldSetNodeList.item(j);
					if (childNode.getNodeType() == Node.ELEMENT_NODE) {
						FieldEntity entity = new FieldEntity();
						Element eElement = (Element) childNode;
						loadEntity(eElement, entity);
						entity.setColumnName(eElement.getAttribute(Constants.COLUMN_NAME));
						entity.setDataType(eElement.getAttribute(Constants.DATA_TYPE));
						entity.setDisplayName(eElement.getAttribute(Constants.DISPLAY_NAME));
						fieldSet.put(entity.getName(), entity);
					}
				}
				configurationEntity.getFieldSets().put(fieldSetId, fieldSet);
			}
						
		}		
	}
	
	private void loadEntity(Element eElement , XmlEntity entity) {
		entity.setId(Integer.parseInt(eElement.getAttribute(Constants.ID)));
		entity.setName(eElement.getAttribute(Constants.NAME));
		entity.setDesc(eElement.getAttribute(Constants.DESC));
	}
	
	
	public static void main(String args[]) {
		try {
			JDBCConfiguration inst = JDBCConfiguration.INSTANCE;
			inst.loadConfiguration();
			ReportEntity entity = inst.getConfigurationEntity().getReports().get(1);
			inst.getConfigurationEntity().getFilters().get(entity.getFilterId());
			
		} catch (ConfigException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	
	/**
	 * Loading JdbcFrameworkConfig.xml file
	 * 
	 * @param fileName
	 *            The jdbc file name
	 * @return Returns the document
	 * @throws ConfigException
	 *             Throws Exception, if any
	 */
	private  Document loadXmlFile(String fileName) throws ConfigException {
		Document document = null;
		try {
			LOGGER.debug("Loading configuration: " + fileName);
			DocumentBuilderFactory factory = DocumentBuilderFactory
					.newInstance();
			// then we have to create document-loader:
			DocumentBuilder loader = factory.newDocumentBuilder();
			final InputStream is = Thread.currentThread()
					.getContextClassLoader().getResourceAsStream(fileName);
			document = loader.parse(is);
			document.getDocumentElement().normalize();
			is.close();
		} catch (ParserConfigurationException e) {
			LOGGER.error(
					"DocumentBuilder creation failed for file " + fileName, e);
			throw new ConfigException(
					"DocumentBuilder creation failed for file " + fileName, e);
		} catch (SAXException e1) {
			LOGGER.error("Error parsing xml file: " + fileName, e1);
			throw new ConfigException("Error parsing xml file: " + fileName, e1);
		} catch (IOException e2) {
			LOGGER.error("Error in access to file: " + fileName, e2);
			throw new ConfigException("Error in access to file: " + fileName,
					e2);
		} catch (Exception e) {
			LOGGER.error(e.getMessage());
			throw new ConfigException("Error in access to file: " + fileName, e);
		}

		return document;
	}
}
