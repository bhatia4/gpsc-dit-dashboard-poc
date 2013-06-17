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

import com.hp.common.dao.DataManager;
import com.hp.common.exception.DAOException;

@Path("/reports")
public class ReportGenerator {
	
	private static final Logger logger = Logger.getLogger(ReportGenerator.class);
	
	private static final String BASEURL = "http://localhost:7001/Report/ReportUI/reports/";
	
	private static final HashMap<String, String> baseQuery = new HashMap<String, String>();
	
	static {
		baseQuery.put("pnoc" , "select rownum recordnum,keyid,buyer_region,smt,buyer_name,buyer_code,release_status,model_year,part_number,part_Description,reason_code,comments,product_line from pnoc" );
		baseQuery.put("expiringcontract" , "select rownum recordnum,KEYID,SMT,CREATIVTY_TEAM_DSC,CNTRCT_NBR,CNTRCT_LI_NBR,LGL_BSNS_ENT_DSC,PART_NBR,PRT_DSC from expiring_contract" );
		baseQuery.put("recentFiles" , "select rownum recordnum,buyer_region,smt,buyer_name,buyer_code,product_line from pnoc" );
		baseQuery.put("fileList" , "select segment_name,plant,region,file_process_status FROM dashboard.control_table" );
		baseQuery.put("fileListChart" , "select segment_name,count(*) as count FROM dashboard.control_table group by segment_name order by count(*) desc" );
		baseQuery.put("fileStatusChart" , "select file_process_status as status , count(*) as count from control_table group by file_process_status order by count(*) desc" );
		
	}
	
	public ReportGenerator() {
		logger.info("Root Resource Instance Created");
	}
	
	@GET
	@Produces(MediaType.TEXT_XML)
	public String getReports(@Context UriInfo uri)  {
		StringBuffer buffer = new StringBuffer();
		buffer.append("<xml><reports>");
		for (Iterator iterator = baseQuery.keySet().iterator(); iterator.hasNext();) {
			String reportName = (String) iterator.next();
			buffer.append("<report name='"+protectSpecialCharacters(reportName)+"'  url='"+ BASEURL  + reportName +"' />");
		}
		buffer.append("</reports></xml>");
		return buffer.toString();
	}
	
	
	@GET
	@Path("/{reportName}")
	@Produces(MediaType.TEXT_XML)
	public String getReportCollections(@PathParam("reportName") String id,@Context UriInfo uri)  {
		
		 MultivaluedMap<String, String> queryParms = uri.getQueryParameters();
		 String pageNumString = queryParms.getFirst("pageNum");
		 int pageNum = -1;
		 if (pageNumString == null || "".equals(pageNumString) ){
			 pageNum = 1;
		 }else{
			pageNum = Integer.parseInt(pageNumString) ;
		 }
		 
		 DataManager dataManager = DataManager.INSTANCE;
		try {
			ArrayList<String[]> dataList = dataManager.getData(baseQuery.get(id), System.currentTimeMillis()+"", false,-1);
			String[] headers = dataManager.getHeaders(baseQuery.get(id), System.currentTimeMillis()+"", false);
			ReportGenerator generator = new ReportGenerator();
			int[] keyPosition = {0};
			return generator.buildXmlString(headers,dataList, id,  keyPosition).toString();
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
			urlBuffer.append(BASEURL).append(entityName).append("/");
			for (int i = 0; i < keyPosition.length; i++) {
				urlBuffer.append(removeNullEmpty(data[i])).append("~$~");
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
			String query = "expiringcontract";
			try {
				ArrayList<String[]> dataList = dataManager.getData(baseQuery.get(query), System.currentTimeMillis()+"", false,-1);
				String[] headers = dataManager.getHeaders(baseQuery.get(query), System.currentTimeMillis()+"", false);
				ReportGenerator generator = new ReportGenerator();
				int[] keyPosition = {0};
				logger.info(generator.buildXmlString(headers,dataList,query,  keyPosition));
				
			} catch (DAOException e) {
				logger.error(e);
			}
		}
		
}
