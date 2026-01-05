package com.secrets.residuos.dto;

import java.util.List;

public class EmailResponse {

    private boolean success;
    private String message;
    private List<String> recipients;
    private String error;

    public EmailResponse() {}

    public EmailResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    public EmailResponse(boolean success, String message, List<String> recipients) {
        this.success = success;
        this.message = message;
        this.recipients = recipients;
    }

    public static EmailResponse success(String message, List<String> recipients) {
        return new EmailResponse(true, message, recipients);
    }

    public static EmailResponse error(String message) {
        EmailResponse response = new EmailResponse(false, message);
        response.setError(message);
        return response;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public List<String> getRecipients() {
        return recipients;
    }

    public void setRecipients(List<String> recipients) {
        this.recipients = recipients;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }
}
