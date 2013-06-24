package com.hp.common.exception;

public class ConfigException extends BaseException {

	

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public ConfigException(Throwable throwable) {
		super(throwable);
	}
	
	public ConfigException(String message,Throwable throwable){
		super(message,throwable);
	}
}
