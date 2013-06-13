/* 
 * Title        : BaseException.java
 * Copyright    : Copyright (c) 2009-2010, General Motors Inc. 
 * Company      : Hewlett Packard
 * Project Name : FileReader
 */
package com.hp.common.exception;

/**
 * @author Manikandan Dhandapani
 * 
 */
public abstract class BaseException extends Exception {

	/**
	 * 
	 */
	private static final long serialVersionUID = 7081223359325980541L;

	public BaseException(Throwable throwable) {
		super(throwable);
	}

	public BaseException(String message) {
		super(message);
	}

}
