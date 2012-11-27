package com.keaplogik.webapp.model;

public class Film {
	private String title;

	public Film(String title) {
		this.title = title;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	@Override
	public String toString() {
		return title;
	}
	
}
