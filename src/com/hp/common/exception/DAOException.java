/* 
 * Title        : DAOException.java
 * Copyright    : Copyright (c) 2009-2010, General Motors Inc. 
 * Company      : Hewlett Packard
 * Project Name : FileReader
 */
package com.hp.common.exception;

/**
 * @author Manikandan Dhandapani
 * 
 */
public class DAOException extends BaseException {

	/**
	 * 
	 */
	private static final long serialVersionUID = 2174867624513971098L;

	/**
	 * @param throwable
	 */
	public DAOException(Throwable throwable) {
		super(throwable);
		// TODO Auto-generated constructor stub
	}

	/**
	 * @param message
	 */
	public DAOException(String message) {
		super(message);
		// TODO Auto-generated constructor stub
	}

}
