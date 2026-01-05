package com.secrets.residuos.controller;

import com.secrets.residuos.dto.EmailRequest;
import com.secrets.residuos.dto.EmailResponse;
import com.secrets.residuos.service.EmailService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/email")
@CrossOrigin(origins = "${app.cors.allowed-origins}")
public class EmailController {

    private static final Logger logger = LoggerFactory.getLogger(EmailController.class);

    private final EmailService emailService;

    public EmailController(EmailService emailService) {
        this.emailService = emailService;
    }

    @PostMapping("/send-report")
    public ResponseEntity<EmailResponse> sendReport(@Valid @RequestBody EmailRequest request) {
        try {
            logger.info("Recibida solicitud de envío de reporte: formato={}, destinatarios={}",
                       request.getReportFormat(), request.getRecipients().size());

            emailService.sendReportEmail(request);

            String message = String.format("Reporte enviado exitosamente a %d destinatario(s)",
                                         request.getRecipients().size());

            return ResponseEntity.ok(EmailResponse.success(message, request.getRecipients()));

        } catch (IllegalStateException e) {
            logger.error("Configuración incorrecta: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(EmailResponse.error("Configuración de email incorrecta. " + e.getMessage()));

        } catch (Exception e) {
            logger.error("Error al enviar reporte", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(EmailResponse.error("Error al enviar el reporte: " + e.getMessage()));
        }
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Email service is running - Sustentabilidad Secrets");
    }
}
