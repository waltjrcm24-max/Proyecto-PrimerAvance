package com.secrets.residuos.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public class EmailRequest {

    @NotEmpty(message = "La lista de destinatarios no puede estar vacía")
    private List<String> recipients;

    @NotNull(message = "Los datos del reporte son requeridos")
    private Object reportData;

    @NotNull(message = "El formato del reporte es requerido")
    private String reportFormat;

    @NotNull(message = "El texto del período es requerido")
    private String periodText;

    @NotNull(message = "La fecha de inicio es requerida")
    private String startDate;

    @NotNull(message = "La fecha de fin es requerida")
    private String endDate;

    public EmailRequest() {}

    public EmailRequest(List<String> recipients, Object reportData, String reportFormat,
                       String periodText, String startDate, String endDate) {
        this.recipients = recipients;
        this.reportData = reportData;
        this.reportFormat = reportFormat;
        this.periodText = periodText;
        this.startDate = startDate;
        this.endDate = endDate;
    }

    public List<String> getRecipients() {
        return recipients;
    }

    public void setRecipients(List<String> recipients) {
        this.recipients = recipients;
    }

    public Object getReportData() {
        return reportData;
    }

    public void setReportData(Object reportData) {
        this.reportData = reportData;
    }

    public String getReportFormat() {
        return reportFormat;
    }

    public void setReportFormat(String reportFormat) {
        this.reportFormat = reportFormat;
    }

    public String getPeriodText() {
        return periodText;
    }

    public void setPeriodText(String periodText) {
        this.periodText = periodText;
    }

    public String getStartDate() {
        return startDate;
    }

    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }

    public String getEndDate() {
        return endDate;
    }

    public void setEndDate(String endDate) {
        this.endDate = endDate;
    }
}
