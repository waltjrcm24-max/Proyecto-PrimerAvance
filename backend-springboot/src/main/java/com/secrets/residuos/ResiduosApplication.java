package com.secrets.residuos;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ResiduosApplication {

    public static void main(String[] args) {
        SpringApplication.run(ResiduosApplication.class, args);
        System.out.println("\n" +
                "╔═══════════════════════════════════════════════════════════╗\n" +
                "║                                                           ║\n" +
                "║   Sistema de Gestión de Residuos Sólidos - Backend       ║\n" +
                "║   Secrets Playa Blanca Costa Mujeres                      ║\n" +
                "║                                                           ║\n" +
                "║   Servidor corriendo en: http://localhost:8080            ║\n" +
                "║   Endpoint: /api/email/send-report                        ║\n" +
                "║   Health check: /api/email/health                         ║\n" +
                "║                                                           ║\n" +
                "║   Remitente: sustentabilidadsecrets@gmail.com             ║\n" +
                "║                                                           ║\n" +
                "║   Configura tu app password en application.properties     ║\n" +
                "║                                                           ║\n" +
                "╚═══════════════════════════════════════════════════════════╝\n");
    }
}
