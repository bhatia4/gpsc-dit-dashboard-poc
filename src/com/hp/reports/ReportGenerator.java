package com.hp.reports;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.MultivaluedMap;
import javax.ws.rs.core.UriInfo;

import org.apache.log4j.Logger;

import com.hp.common.Constants;
import com.hp.common.dao.DataManager;
import com.hp.common.exception.ConfigException;
import com.hp.common.exception.DAOException;
import com.hp.common.xml.ConfigurationEntity;
import com.hp.common.xml.JDBCConfiguration;
import com.hp.common.xml.PanelEntity;
import com.hp.common.xml.ReportEntity;

@Path("/reports")
public class ReportGenerator {
	
	private static final Logger logger = Logger.getLogger(ReportGenerator.class);
	
	private final ConfigurationEntity configurationEntity ; 
	
	static {
		
		try {
			JDBCConfiguration.INSTANCE.loadConfiguration();
		} catch (ConfigException e) {
			logger.error(e.getMessage());
		}
	}
	
	public ReportGenerator() {
		configurationEntity = JDBCConfiguration.INSTANCE.getConfigurationEntity();
		logger.info("Root Resource Instance Created");
	}
	
	@GET
	@Produces(MediaType.TEXT_XML)
	public String getReports(@Context UriInfo uri)  {
		StringBuffer buffer = new StringBuffer();
		buffer.append("<xml><reports>");
		HashMap<Integer, ReportEntity> reportEntities = configurationEntity.getReports(); 
		for (Iterator<Integer> iterator = reportEntities.keySet().iterator(); iterator.hasNext();) {
			Integer reportId = iterator.next();
			ReportEntity entity = reportEntities.get(reportId);
			buffer.append("<report id='"+ entity.getId()+"' name='"+protectSpecialCharacters(entity.getName())+"'  url='"+ Constants.BASEURL  + entity.getId() +"'  desc='"+entity.getDesc()+"'/>");
		}
		buffer.append("</reports></xml>");
		return buffer.toString();
	}
	
	
	@GET
	@Path("/panels")
	@Produces(MediaType.TEXT_XML)
	public String getPanels(@Context UriInfo uri)  {
		StringBuffer buffer = new StringBuffer();
		buffer.append("<xml><panels>");
		HashMap<Integer, PanelEntity> panelEntities = configurationEntity.getPanels(); 
		for (Iterator<Integer> iterator = panelEntities.keySet().iterator(); iterator.hasNext();) {
			Integer reportId = iterator.next();
			PanelEntity entity = panelEntities.get(reportId);
			buffer.append("<panel id='"+ entity.getId()+"' name='"+protectSpecialCharacters(entity.getName())+"'  url='"+ Constants.BASEURL  + entity.getReportId() +"'  desc='"+entity.getDesc()+"' height='"+entity.getHeight()+"' width='"+entity.getWidth()+"' type='"+entity.getType()+"'/>");
		}
		buffer.append("</panels></xml>");
		return buffer.toString();
	}
	
	
	@GET
	@Path("/{reportId}")
	@Produces(MediaType.TEXT_XML)
	public String getReportCollections(@PathParam("reportId") String id,@Context UriInfo uri)  {
		 MultivaluedMap<String, String> queryParms = uri.getQueryParameters();
		 String pageNumString = queryParms.getFirst("pageNum");
		 int pageNum = -1;
		 if (pageNumString == null || "".equals(pageNumString) ){
			 pageNum = 1;
		 }else{
			pageNum = Integer.parseInt(pageNumString) ;
		 }
		 
		 int reportId = Integer.parseInt(id);
		 String filterString = queryParms.getFirst("filter");
		 
		 DataManager dataManager = DataManager.INSTANCE;
		 ReportEntity entity = JDBCConfiguration.INSTANCE.getConfigurationEntity().getReports().get(reportId);
		try {
			ArrayList<String[]> dataList = dataManager.getData(reportId, System.currentTimeMillis()+"",filterString, false,-1);
			String[] headers = dataManager.getHeaders(reportId, System.currentTimeMillis()+"", false);
			ReportGenerator generator = new ReportGenerator();
			int[] keyPosition = {0};
			return generator.buildXmlString(headers,dataList,entity.getName(),  keyPosition).toString();
		} catch (DAOException e) {
			logger.error(e);
		}
		return "";
	}
	
	
	
	
	private StringBuffer buildXmlString(String[] headers , ArrayList<String[]> dataList,String entityName,int[] keyPosition) {
		StringBuffer buffer = new StringBuffer();
		StringBuffer dataBuffer = new StringBuffer();
		StringBuffer urlBuffer = new StringBuffer();
		buffer.append("<xml><records>");
		for (Iterator iterator = dataList.iterator(); iterator.hasNext();) {
			
			String[] data = (String[]) iterator.next();
			
			for (int i = 0; i < data.length; i++) {
				dataBuffer.append("<").append(headers[i]).append(">").append(removeNullEmpty(data[i])).append("</").append(headers[i]).append(">");
			}
			urlBuffer.append(Constants.BASEURL).append(entityName).append("/");
			for (int i = 0; i < keyPosition.length; i++) {
				urlBuffer.append(removeNullEmpty(data[i])).append(Constants.FILTER_SEPERATOR);
			}
			buffer.append("<").append(entityName).append(" url=\"").append(urlBuffer).append("\">");
			buffer.append(dataBuffer.toString());
			buffer.append("</").append(entityName).append(">");
			
			urlBuffer.setLength(0);
			dataBuffer.setLength(0);
		}
		buffer.append("</records></xml>");
		return buffer;
	}
	
	 private static String removeNullEmpty(String str) {
	        return ((str==null || "".equals(str.trim())) ? ""       : protectSpecialCharacters(str.trim()));
	 }
	
	 private static String removeNullNbsp(String str) {
	        return ((str==null || "".equals(str.trim())) ? "&nbsp;" : protectSpecialCharacters(str.trim()));
	 }
	
	 
	 /**
	  * Returns the string where all non-ascii and <, &, > are encoded as numeric entities. I.e. "&lt;A &amp; B &gt;"
	  * .... (insert result here). The result is safe to include anywhere in a text field in an XML-string. If there was
	  * no characters to protect, the original string is returned.
	  * 
	  * @param originalUnprotectedString
	  *            original string which may contain characters either reserved in XML or with different representation
	  *            in different encodings (like 8859-1 and UFT-8)
	  * @return
	  */
	 public static String protectSpecialCharacters(String originalUnprotectedString) {
	     if (originalUnprotectedString == null) {
	         return null;
	     }
	     boolean anyCharactersProtected = false;

	     StringBuffer stringBuffer = new StringBuffer();
	     for (int i = 0; i < originalUnprotectedString.length(); i++) {
	         char ch = originalUnprotectedString.charAt(i);

	         boolean controlCharacter = ch < 32;
	         boolean unicodeButNotAscii = ch > 126;
	         boolean characterWithSpecialMeaningInXML = ch == '<' || ch == '&' || ch == '>';

	         if (characterWithSpecialMeaningInXML || unicodeButNotAscii || controlCharacter) {
	             stringBuffer.append("&#" + (int) ch + ";");
	             anyCharactersProtected = true;
	         } else {
	             stringBuffer.append(ch);
	         }
	     }
	     if (anyCharactersProtected == false) {
	         return originalUnprotectedString;
	     }

	     return stringBuffer.toString();
	 }
	
	 

		public static void main(String args[]) {
			DataManager dataManager = DataManager.INSTANCE;
			String query = "fileListChart";
			try {
				ArrayList<String[]> dataList = dataManager.getData(2, System.currentTimeMillis()+"", "Plant~,~SZ~-~Region~,~SRU" ,false,-1);
				String[] headers = dataManager.getHeaders(2, System.currentTimeMillis()+"", false);
				ReportGenerator generator = new ReportGenerator();
				int[] keyPosition = {0};
			} catch (DAOException e) {
				logger.error(e);
			}
		}
		
}
