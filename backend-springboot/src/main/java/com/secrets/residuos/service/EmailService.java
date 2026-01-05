package com.secrets.residuos.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.secrets.residuos.dto.EmailRequest;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;
    private final ObjectMapper objectMapper;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${app.mail.from-name}")
    private String fromName;

    public EmailService(JavaMailSender mailSender, ObjectMapper objectMapper) {
        this.mailSender = mailSender;
        this.objectMapper = objectMapper;
    }

    public void sendReportEmail(EmailRequest request) throws MessagingException, IOException {
        logger.info("Iniciando envío de reporte a {} destinatarios", request.getRecipients().size());

        if ("sustentabilidadsecrets@gmail.com".equals(fromEmail) &&
            System.getProperty("spring.mail.password", "").equals("lzly bjsh ggho nqyb")) {
            throw new IllegalStateException("Por favor configura spring.mail.password con tu contraseña de aplicación real en application.properties");
        }

        Map<String, Object> reportDataMap = objectMapper.convertValue(request.getReportData(), Map.class);
        String totalRecords = getTotalRecords(reportDataMap);
        String totalWeight = getTotalWeight(reportDataMap);

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom(fromEmail, fromName);
        helper.setTo(request.getRecipients().toArray(new String[0]));

        String subject = String.format("Reporte %s de Residuos Sólidos - %s a %s",
                                      request.getPeriodText(),
                                      request.getStartDate().split("T")[0],
                                      request.getEndDate().split("T")[0]);
        helper.setSubject(subject);

        String htmlBody = generateHtmlBody(request, totalRecords, totalWeight);
        helper.setText(htmlBody, true);

        byte[] attachmentData = generateAttachment(request, reportDataMap);
        String filename = generateFilename(request);
        String contentType = getContentType(request.getReportFormat());

        helper.addAttachment(filename, new ByteArrayResource(attachmentData), contentType);

        mailSender.send(message);
        logger.info("Reporte enviado exitosamente a: {}", String.join(", ", request.getRecipients()));
    }

    private String getTotalRecords(Map<String, Object> reportData) {
        try {
            if (reportData.containsKey("estadisticas")) {
                Map<String, Object> stats = (Map<String, Object>) reportData.get("estadisticas");
                return String.valueOf(stats.get("totalRegistros"));
            }
            if (reportData.containsKey("registros")) {
                List<?> registros = (List<?>) reportData.get("registros");
                return String.valueOf(registros.size());
            }
            return "N/A";
        } catch (Exception e) {
            return "N/A";
        }
    }

    private String getTotalWeight(Map<String, Object> reportData) {
        try {
            if (reportData.containsKey("estadisticas")) {
                Map<String, Object> stats = (Map<String, Object>) reportData.get("estadisticas");
                return String.valueOf(stats.get("pesoTotal"));
            }
            return "N/A";
        } catch (Exception e) {
            return "N/A";
        }
    }

    private String generateHtmlBody(EmailRequest request, String totalRecords, String totalWeight) {
        String startDateFormatted = request.getStartDate().split("T")[0];
        String endDateFormatted = request.getEndDate().split("T")[0];

        return "<!DOCTYPE html>" +
                "<html>" +
                "<head>" +
                "<meta charset=\"utf-8\">" +
                "<style>" +
                "body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }" +
                ".container { max-width: 600px; margin: 0 auto; }" +
                ".header { background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%); color: white; padding: 30px; text-align: center; }" +
                ".header h1 { margin: 0 0 10px 0; font-size: 24px; }" +
                ".content { background: #f9f9f9; padding: 30px; }" +
                ".stats { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #0ea5e9; }" +
                ".stats h3 { margin-top: 0; color: #0ea5e9; }" +
                ".stats p { margin: 10px 0; }" +
                ".footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }" +
                "</style>" +
                "</head>" +
                "<body>" +
                "<div class=\"container\">" +
                "<div class=\"header\">" +
                "<h1>Reporte de Residuos Sólidos</h1>" +
                "<p>Secrets Playa Blanca Costa Mujeres</p>" +
                "</div>" +
                "<div class=\"content\">" +
                "<p>Estimado/a,</p>" +
                "<p>Adjunto encontrará el reporte <strong>" + request.getPeriodText() + "</strong> de gestión de residuos sólidos.</p>" +
                "<div class=\"stats\">" +
                "<h3>Resumen del Período</h3>" +
                "<p><strong>Período:</strong> " + startDateFormatted + " - " + endDateFormatted + "</p>" +
                "<p><strong>Total de registros:</strong> " + totalRecords + "</p>" +
                "<p><strong>Peso total:</strong> " + totalWeight + "</p>" +
                "<p><strong>Formato:</strong> " + request.getReportFormat().toUpperCase() + "</p>" +
                "</div>" +
                "<p>El archivo adjunto contiene el detalle completo de todos los registros del período seleccionado.</p>" +
                "<p style=\"margin-top: 30px;\">Saludos cordiales,<br><strong>Sistema de Gestión de Residuos Sólidos</strong><br>Sustentabilidad Secrets Playa Blanca</p>" +
                "</div>" +
                "<div class=\"footer\">" +
                "<p>Este es un correo automático, por favor no responda a este mensaje.</p>" +
                "<p>&copy; 2025 Secrets Playa Blanca Costa Mujeres</p>" +
                "</div>" +
                "</div>" +
                "</body>" +
                "</html>";
    }

    private byte[] generateAttachment(EmailRequest request, Map<String, Object> reportData) throws IOException {
        String format = request.getReportFormat().toLowerCase();

        switch (format) {
            case "json":
                return objectMapper.writerWithDefaultPrettyPrinter()
                                 .writeValueAsString(reportData)
                                 .getBytes(StandardCharsets.UTF_8);

            case "csv":
                return generateCsv(reportData).getBytes(StandardCharsets.UTF_8);

            case "pdf":
                return generateHtmlForPdf(request, reportData).getBytes(StandardCharsets.UTF_8);

            default:
                throw new IllegalArgumentException("Formato no soportado: " + format);
        }
    }

    private String generateCsv(Map<String, Object> reportData) {
        StringBuilder csv = new StringBuilder();
        csv.append("Tipo de Residuo,Ubicación,Peso (kg),Fecha,Hora,Notas,Creado por\n");

        List<Map<String, Object>> registros = (List<Map<String, Object>>) reportData.get("registros");
        if (registros != null) {
            for (Map<String, Object> record : registros) {
                csv.append(escapeCSV(String.valueOf(record.get("type")))).append(",");
                csv.append(escapeCSV(String.valueOf(record.get("location")))).append(",");
                csv.append(record.get("weight")).append(",");
                csv.append(record.get("date")).append(",");
                csv.append(record.get("time")).append(",");
                csv.append(escapeCSV(String.valueOf(record.getOrDefault("notes", "")))).append(",");
                csv.append(escapeCSV(String.valueOf(record.getOrDefault("createdBy", "")))).append("\n");
            }
        }

        return csv.toString();
    }

    private String escapeCSV(String value) {
        if (value == null || value.equals("null")) {
            return "";
        }
        if (value.contains(",") || value.contains("\"") || value.contains("\n")) {
            return "\"" + value.replace("\"", "\"\"") + "\"";
        }
        return value;
    }

    private String generateHtmlForPdf(EmailRequest request, Map<String, Object> reportData) {
        StringBuilder html = new StringBuilder();
        html.append("<!DOCTYPE html>");
        html.append("<html>");
        html.append("<head>");
        html.append("<meta charset=\"utf-8\">");
        html.append("<title>Reporte ").append(request.getPeriodText()).append("</title>");
        html.append("<style>");
        html.append("body { font-family: Arial, sans-serif; margin: 40px; }");
        html.append("h1 { color: #0ea5e9; }");
        html.append("table { width: 100%; border-collapse: collapse; margin-top: 20px; }");
        html.append("th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }");
        html.append("th { background-color: #0ea5e9; color: white; }");
        html.append("@media print { body { margin: 0; } }");
        html.append("</style>");
        html.append("</head>");
        html.append("<body>");
        html.append("<h1>Reporte ").append(request.getPeriodText()).append(" de Residuos Sólidos</h1>");
        html.append("<p><strong>Período:</strong> ").append(request.getStartDate().split("T")[0])
            .append(" - ").append(request.getEndDate().split("T")[0]).append("</p>");

        Map<String, Object> stats = (Map<String, Object>) ((Map<String, Object>) reportData).get("estadisticas");
        if (stats != null) {
            html.append("<p><strong>Total de registros:</strong> ").append(stats.get("totalRegistros")).append("</p>");
            html.append("<p><strong>Peso total:</strong> ").append(stats.get("pesoTotal")).append("</p>");
        }

        List<Map<String, Object>> registros = (List<Map<String, Object>>) reportData.get("registros");
        if (registros != null && !registros.isEmpty()) {
            html.append("<table>");
            html.append("<tr><th>Tipo</th><th>Ubicación</th><th>Peso (kg)</th><th>Fecha</th><th>Hora</th><th>Notas</th></tr>");
            for (Map<String, Object> record : registros) {
                html.append("<tr>");
                html.append("<td>").append(record.get("type")).append("</td>");
                html.append("<td>").append(record.get("location")).append("</td>");
                html.append("<td>").append(record.get("weight")).append("</td>");
                html.append("<td>").append(record.get("date")).append("</td>");
                html.append("<td>").append(record.get("time")).append("</td>");
                html.append("<td>").append(record.getOrDefault("notes", "")).append("</td>");
                html.append("</tr>");
            }
            html.append("</table>");
        }

        html.append("<p style=\"margin-top: 30px;\"><small>Para guardar como PDF: Archivo → Imprimir → Guardar como PDF</small></p>");
        html.append("</body>");
        html.append("</html>");

        return html.toString();
    }

    private String generateFilename(EmailRequest request) {
        String dateStr = request.getStartDate().split("T")[0] + "_" + request.getEndDate().split("T")[0];
        String extension = switch (request.getReportFormat().toLowerCase()) {
            case "json" -> ".json";
            case "csv" -> ".csv";
            case "pdf" -> ".html";
            default -> ".txt";
        };
        return "reporte-" + request.getPeriodText().toLowerCase() + "-" + dateStr + extension;
    }

    private String getContentType(String format) {
        return switch (format.toLowerCase()) {
            case "json" -> "application/json";
            case "csv" -> "text/csv";
            case "pdf" -> "text/html";
            default -> "text/plain";
        };
    }
}
