/* 
 * Title        : DataManager.java
 * Copyright    : Copyright (c) 2009-2010, General Motors Inc. 
 * Company      : Hewlett Packard
 * Project Name : FileReader
 */
package com.hp.common.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Hashtable;
import java.util.Properties;
import java.util.regex.Matcher;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.sql.DataSource;

import org.apache.log4j.Logger;

import com.hp.common.Constants;
import com.hp.common.Utility;
import com.hp.common.exception.DAOException;
import com.hp.common.xml.ConnectionEntity;
import com.hp.common.xml.FieldEntity;
import com.hp.common.xml.JDBCConfiguration;
import com.hp.common.xml.ReportEntity;

/**
 * @author Manikandan Dhandapani
 * 
 */
public enum DataManager {
	INSTANCE;

	private static final Logger logger = Logger.getLogger(DataManager.class);
	
	private static final String DEFAULT_DATASOURCE = "jdbc/dashboard";
	
	private static final 	String EMPTY_STRING = "";
	
	/** The da o_ paginate d_ query. */
	private static String DAO_PAGINATED_QUERY = "select * from (mainQuery) where recordnum  > minRow and recordnum <= maxRow";
	
	/** The NEGATIV e_ one. */
	private static final int NEGATIVE_ONE = -1;
	
	/** The MAINQUERYNAME. */
	private static final String MAINQUERYNAME = "mainQuery";

	/** The MINROWNUM. */
	private static final String MINROWNUM = "minRow";

	/** The MAXROWNUM. */
	private static final String MAXROWNUM = "maxRow";


	final Hashtable<String, Connection> connections = new Hashtable<String, Connection>();

	public void startTransaction(String keyName,  int dataSouceId)
			throws DAOException {
		startTransaction(keyName, dataSouceId,false);
	}
	
	
	public void startTransaction(String keyName, int dataSouceId,boolean autoCommit)
			throws DAOException {
		try {
			if (connections.get(keyName) != null) {
				throw new DAOException("Transaction " + keyName
						+ " Already Started");
			}
			Connection connection = getConnectionfromDataSource(dataSouceId);
			connection.setAutoCommit(autoCommit);
			connections.put(keyName, connection);
			logger.info("Transaction Started.." + keyName);
		} catch (NamingException e) {
			throw new DAOException(e);
		} catch (SQLException e) {
			logger.error(e.getMessage());
		}
	}

	
	public String[] getHeaders(int reportId,String transactionName,boolean inTransaction) throws DAOException{
		String[] headers = null;
		PreparedStatement statement  = null;
		ResultSet  resultSet = null;
		ReportEntity reportEntity = JDBCConfiguration.INSTANCE.getConfigurationEntity().getReports().get(reportId);
		HashMap<String, FieldEntity> fields = JDBCConfiguration.INSTANCE.getConfigurationEntity().getFieldSets().get(reportEntity.getFieldSetId());
		if(!inTransaction){
			startTransaction(transactionName, reportEntity.getConnectionId(),true);
		}
		try {
			Connection connection = connections.get(transactionName);
			statement = connection.prepareStatement(reportEntity.getBaseQuery());
			resultSet = statement.executeQuery();
			ResultSetMetaData md = resultSet.getMetaData() ;
			headers = new String[md.getColumnCount()];
			for( int i = 1; i <= md.getColumnCount(); i++ ) {
				logger.info("Header Name Before Conversion.."+md.getColumnLabel(i));
				headers[i-1] =  Utility.getNameFromColumnName(md.getColumnLabel(i), fields);
				logger.info("Header Name After Conversion.."+headers[i-1]);
			}
		} catch (SQLException e) {
			throw new DAOException(e);
		} finally {
			try {
					if (resultSet != null){
						resultSet.close();
						statement.close();
					}
			} catch (SQLException e) {
				logger.error(e);
			}
			closeTransaction(transactionName);
		}
		return headers;
	}
	
	public ArrayList<String[]> getData( int reportId, String transactionName, String filterString, boolean inTransaction, int pageNum ) throws DAOException{
		ArrayList<String[]> dataList = new ArrayList<String[]>();
		PreparedStatement statement  = null;
		ResultSet  resultSet = null;
		ReportEntity reportEntity = JDBCConfiguration.INSTANCE.getConfigurationEntity().getReports().get(reportId);
		if(!inTransaction){
			startTransaction(transactionName, reportEntity.getConnectionId() ,true);
		}
		try {
			Connection connection = connections.get(transactionName);			
			//buildPaginationQuery(reportId, pageNum, 20)
			statement = connection.prepareStatement(buildQuery(reportEntity.getBaseQuery(),reportEntity,filterString));
			resultSet = statement.executeQuery();
			int columnCount = resultSet.getMetaData().getColumnCount();	
			resultSet.setFetchSize(500);
			while(resultSet != null && resultSet.next()) {
				String[] data = new String[columnCount];
				for (int i = 1; i <= columnCount; i++) {
					data[i-1] = resultSet.getString(i);
				}
				dataList.add(data);
			}
		} catch (SQLException e) {
			throw new DAOException(e);
		} finally {
			try {
					if (resultSet != null){
						resultSet.close();
						statement.close();
					}
			} catch (SQLException e) {
				logger.error(e);
			}
			closeTransaction(transactionName);
		}
		
		return dataList;
	}
	
	
	public String buildQuery(String query,ReportEntity entity , String filterString) {
		StringBuffer buffer = new StringBuffer();
		buffer.append(query);
		if (!Utility.isEmpty(filterString)) {
			 HashMap<String, FieldEntity> fields = JDBCConfiguration.INSTANCE.getConfigurationEntity().getFieldSets().get(entity.getFieldSetId());
			 String additionalFilter = Utility.convertFilterString(filterString, fields);
			 if (Utility.isEmpty(entity.getWhereCondition())){
				 buffer.append(Constants.WHERE_CONDITION_STRING).append(additionalFilter);
			 }else{
				 buffer.append(Constants.AND_STRING).append(additionalFilter);
			 }
		}
		
		 if (!Utility.isEmpty(entity.getGroupBy())){
			 buffer.append(Constants.GROUP_BY_STRING).append(entity.getGroupBy());
		 }
		 
		 if (!Utility.isEmpty(entity.getOrderBy())){
			 buffer.append(Constants.ORDER_BY_STRING).append(entity.getOrderBy());
		 }
		
		logger.debug("Query.."+buffer.toString());
		return buffer.toString();
	}

	
	 /**
     * This method will build the paginated query based on the given input
     * parameters. If the requiredPage is -1 then the main query will be returned
     * as it is, meaning that pagination is not required. 
     * 
     * @param query Main query to be executed.
     * @param requiredPage required recored to be fetched from data base.
     * @param recordsPerPage Number of records per page.
     * @return Paginated query.
     */
    private static String buildPaginationQuery(final String query,
            final int requiredPage, final int recordsPerPage) {
    	logger.debug(requiredPage + EMPTY_STRING + recordsPerPage 
                + EMPTY_STRING + query);
        String replacedQuery = query;
        String tmpQuery = DAO_PAGINATED_QUERY;
        if (NEGATIVE_ONE == requiredPage) {            
            return replacedQuery;
        }
        replacedQuery = Matcher.quoteReplacement(replacedQuery);
        tmpQuery = tmpQuery.replaceAll(MAINQUERYNAME, replacedQuery);
        tmpQuery = tmpQuery.replaceAll(MINROWNUM,
                EMPTY_STRING + (requiredPage - 1)
                        * recordsPerPage);
        tmpQuery = tmpQuery.replaceAll(MAXROWNUM,
               EMPTY_STRING + (requiredPage) * recordsPerPage);
        logger.debug(tmpQuery);
        return tmpQuery;
    }
    
    
	
	public void commitTransaction(String keyName) {
		try {
			Connection connection = connections.get(keyName);
			if (connection != null) {
				connection.commit();
				logger.info("Transaction Commited .." + keyName);
			}

		} catch (SQLException e) {
			logger.error(e.getLocalizedMessage());
		}
	}

	public void rollbackTransaction(String keyName) {
		try {
			Connection connection = connections.get(keyName);
			if (connection != null) {
				connection.rollback();
				logger.info("Transaction Rollbacked.." + keyName);
			}
		} catch (SQLException e) {
			logger.error(e.getLocalizedMessage());
		}
	}

	public void closeTransaction(String keyName) {
		try {
			Connection connection = connections.get(keyName);
			if (connection != null) {
				connection.close();
				connections.remove(keyName);
				logger.info("Transaction Closed.." + keyName);
			}

		} catch (SQLException e) {
			logger.error(e.getLocalizedMessage());
		}
	}

	public Connection getConnectionfromDataSource(int dataSouceId)
			throws NamingException, SQLException {
		Connection connection = null;
		ConnectionEntity connectionEntity = JDBCConfiguration.INSTANCE.getConfigurationEntity().getConnections().get(dataSouceId);
		Properties env = new Properties();
		env.put(Context.INITIAL_CONTEXT_FACTORY,
				"weblogic.jndi.WLInitialContextFactory");
		env.put(Context.PROVIDER_URL, connectionEntity.getUrl());
		final Context ctx = new InitialContext(env);
		DataSource dataSource = (DataSource) ctx.lookup(connectionEntity.getDataSourceName());
		connection = dataSource.getConnection();
		return connection;
	}
}
