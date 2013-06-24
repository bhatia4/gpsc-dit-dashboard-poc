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
			String[] elements = filterElement.split(Constants.EQUAL_FIELD_SEPERATOR);
			filterString.append(fields.get(elements[0]).getColumnName()).append(Constants.EQUAL_FIELD).append(Constants.SINGLE_QUOUTE).append(elements[1]).append(Constants.SINGLE_QUOUTE);
		}
		
		LOGGER.debug(filterString.toString());
		return filterString.toString();
		
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
