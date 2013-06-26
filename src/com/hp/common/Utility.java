package com.hp.common;

import java.util.HashMap;
import java.util.Iterator;

import org.apache.log4j.Logger;

import com.hp.common.exception.ConfigException;
import com.hp.common.xml.FieldEntity;
import com.hp.common.xml.JDBCConfiguration;

public class Utility {
	private static final Logger LOGGER = Logger.getLogger(Utility.class);
	
	public  static String convertFilterString(String filters,HashMap<String, FieldEntity> fields) {
		LOGGER.debug(filters);
		StringBuffer filterString = new StringBuffer();
		String[] filterElements = filters.split(Constants.FILTER_SEPERATOR);
		
		for (int i = 0; i < filterElements.length; i++) {
			if (i>0){
				filterString.append(Constants.AND_STRING);
			}
			String filterElement = filterElements[i];
			substituteColumns(filterElement, filterString, fields);
		}
		
		LOGGER.debug(filterString.toString());
		return filterString.toString();
	}
	
	
	public static void substituteColumns(String filterElement,StringBuffer filterString,HashMap<String, FieldEntity> fields){
		FieldEntity fieldEntity = null; 
		String[] elements = null;
		
		if (filterElement.indexOf(Constants.EQUAL_FIELD_SEPERATOR) != -1){
			elements = filterElement.split(Constants.EQUAL_FIELD_SEPERATOR);
			fieldEntity = fields.get(elements[0]);
			filterString.append(fieldEntity.getColumnName().trim()).append(Constants.EQUAL_FIELD); 
		}else if (filterElement.indexOf(Constants.GREATER_FIELD_SEPERATOR) != -1){
			
			elements = filterElement.split(Constants.GREATER_FIELD_SEPERATOR);
			fieldEntity = fields.get(elements[0]);
			filterString.append(fieldEntity.getColumnName().trim()).append(Constants.GREATER_FIELD);
		}else if (filterElement.indexOf(Constants.LESS_FIELD_SEPERATOR) != -1){
			elements = filterElement.split(Constants.LESS_FIELD_SEPERATOR);
			fieldEntity = fields.get(elements[0]);
			filterString.append(fieldEntity.getColumnName().trim()).append(Constants.LESS_FIELD);
		}
		if (fieldEntity != null)
			convertFilterValue(fieldEntity.getDataType(), elements[1], filterString);
		
	}
	
	
	public static void convertFilterValue(String dataType,String elementValue,StringBuffer filterString){
		if ("java.lang.String".equalsIgnoreCase(dataType)){
			filterString.append(Constants.SINGLE_QUOUTE).append(elementValue).append(Constants.SINGLE_QUOUTE);
			return;
		}
		if ("java.util.Date".equalsIgnoreCase(dataType) || "java.lang.Integer".equalsIgnoreCase(dataType)){
			filterString.append(elementValue);
			return;
		}
			
	}
	
	
	
	
	
	
	public static String getNameFromColumnName(String columnName,HashMap<String, FieldEntity> fields){
		if (isEmpty(columnName)){
			return columnName;
		}
		if (fields != null && (!fields.isEmpty())){
			for (Iterator<String> iterator = fields.keySet().iterator(); iterator.hasNext();) {
				String name =  iterator.next();
				FieldEntity entity = fields.get(name);
				if (entity != null){
					if (columnName.equals(entity.getColumnName())){
						return (isEmpty(entity.getDisplayName())) ? entity.getName() : entity.getDisplayName() ;
					}
				}
			}
		}
		return columnName;
	}
	/**
	 * This method determines if a String is null or empty.
	 * 
	 * @param string
	 *            A String to be evaluated for existence
	 * @return true if the String is not null or not empty, false if the String
	 *         is null or empty
	 */
	public static boolean isEmpty(final String string) {
		return string == null || string.isEmpty();
	}
	
	public static void main(String args[]) {
		try {
			JDBCConfiguration.INSTANCE.loadConfiguration();
		} catch (ConfigException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		System.out.println("Converted "+getNameFromColumnName("segment_name", JDBCConfiguration.INSTANCE.getConfigurationEntity().getFieldSets().get(1)));
	}
}
